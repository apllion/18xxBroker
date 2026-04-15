import { useState } from 'react'

// Bidbox auction (1861, 1867, 1822 style):
// - Companies are offered one at a time (cheapest first)
// - In player order, each player can bid (min face value) or pass
// - If nobody bids: price drops by 5. At 0: current player must take it.
// - Once someone bids, others can outbid or pass.
// - Pass = permanently out for this item. Last bidder wins.
// - After resolution, next company is offered.

export default function BidboxAuction({ game, players, dispatch, fmt }) {
  const companies = game.companies

  const [companyIdx, setCompanyIdx] = useState(() => companies.findIndex((c) => !c.ownerId))
  const [playerIdx, setPlayerIdx] = useState(0)
  const [highBid, setHighBid] = useState(null)
  const [activeBidders, setActiveBidders] = useState(() => players.map((p) => p.id))
  const [priceDrops, setPriceDrops] = useState({})
  const [bidInput, setBidInput] = useState('')
  const [log, setLog] = useState([])

  const unsold = companies.filter((c) => !c.ownerId)
  const company = companies[companyIdx]
  const done = !company || unsold.length === 0

  const faceValue = company?.value ?? 0
  const currentPrice = Math.max(0, faceValue - (priceDrops[company?.sym] || 0))
  const minBid = highBid ? highBid.amount + 5 : currentPrice

  const currentPlayer = highBid
    ? players.find((p) => p.id === activeBidders[playerIdx % activeBidders.length])
    : players[playerIdx % players.length]

  function addLog(msg) {
    setLog((prev) => [msg, ...prev].slice(0, 30))
  }

  function pName(id) {
    return players.find((p) => p.id === id)?.name ?? id
  }

  function resetForNext() {
    const next = companies.findIndex((c, i) => i > companyIdx && !c.ownerId)
    setCompanyIdx(next >= 0 ? next : companies.length)
    setHighBid(null)
    setActiveBidders(players.map((p) => p.id))
    setPlayerIdx(0)
    setBidInput('')
  }

  function handleBid() {
    if (!currentPlayer || !company) return
    const amount = parseInt(bidInput, 10)
    if (!amount || amount < minBid || currentPlayer.cash < amount) return

    addLog(`${pName(currentPlayer.id)} bids ${fmt(amount)} on ${company.sym}`)

    if (!highBid) {
      // First bid — start auction among all players
      const bidders = players.map((p) => p.id)
      setActiveBidders(bidders)
      setHighBid({ playerId: currentPlayer.id, amount })
      // Next bidder after current
      const curIdx = bidders.indexOf(currentPlayer.id)
      setPlayerIdx((curIdx + 1) % bidders.length)
    } else {
      setHighBid({ playerId: currentPlayer.id, amount })
      // Remove players who can't afford next min
      const nextMin = amount + 5
      const canAfford = activeBidders.filter((id) => {
        if (id === currentPlayer.id) return true
        const p = players.find((pl) => pl.id === id)
        return p && p.cash >= nextMin
      })
      if (canAfford.length === 1) {
        winAuction(canAfford[0], amount)
        setBidInput('')
        return
      }
      setActiveBidders(canAfford)
      const curIdx = canAfford.indexOf(currentPlayer.id)
      setPlayerIdx((curIdx + 1) % canAfford.length)
    }
    setBidInput('')
  }

  function handlePass() {
    if (!currentPlayer) return

    if (highBid) {
      // In auction — pass means out
      addLog(`${pName(currentPlayer.id)} passes on ${company.sym}`)
      const remaining = activeBidders.filter((id) => id !== currentPlayer.id)

      if (remaining.length === 1) {
        winAuction(remaining[0], highBid.amount)
        return
      }
      const newIdx = playerIdx % remaining.length
      setActiveBidders(remaining)
      setPlayerIdx(newIdx)
    } else {
      // No bids yet — pass in turn order
      addLog(`${pName(currentPlayer.id)} passes`)
      const nextIdx = nextPlayer(playerIdx)

      // Check if everyone passed (full round)
      if (nextIdx === 0 || playerIdx + 1 >= players.length) {
        // All passed — drop price
        const sym = company.sym
        const newDrop = (priceDrops[sym] || 0) + 5
        const newPrice = faceValue - newDrop
        if (newPrice <= 0) {
          addLog(`${company.sym} drops to ${fmt(0)} — must be taken`)
          setPriceDrops({ ...priceDrops, [sym]: faceValue })
        } else {
          addLog(`No bids — ${company.sym} drops to ${fmt(newPrice)}`)
          setPriceDrops({ ...priceDrops, [sym]: newDrop })
        }
        setPlayerIdx(0)
      } else {
        setPlayerIdx(nextIdx)
      }
    }
  }

  function handleForcedBuy() {
    if (!currentPlayer || !company) return
    addLog(`${pName(currentPlayer.id)} takes ${company.sym} for ${fmt(0)}`)
    dispatch({ type: 'BUY_PRIVATE', playerId: currentPlayer.id, companySym: company.sym, price: 0 })
    resetForNext()
  }

  function winAuction(winnerId, price) {
    addLog(`${pName(winnerId)} wins ${company.sym} for ${fmt(price)}`)
    dispatch({ type: 'BUY_PRIVATE', playerId: winnerId, companySym: company.sym, price })
    resetForNext()
  }

  function nextPlayer(fromIdx) {
    return (fromIdx + 1) % players.length
  }

  // --- Render ---

  if (done) {
    return (
      <div className="space-y-3">
        <div className="bg-broker-surface rounded-lg p-4 text-center text-green-300 font-medium">
          Auction complete
        </div>
        <SoldList companies={companies} players={players} fmt={fmt} />
        {log.length > 0 && <AuctionLog log={log} />}
      </div>
    )
  }

  const isForced = currentPrice === 0
  const bidAmount = parseInt(bidInput, 10)
  const canBid = currentPlayer && bidAmount >= minBid && currentPlayer.cash >= bidAmount
  const isHighBidder = highBid && currentPlayer?.id === highBid.playerId

  return (
    <div className="space-y-3">
      {/* Current company */}
      <div className={`bg-broker-surface rounded-lg p-4 ring-2 ${highBid ? 'ring-blue-500' : 'ring-amber-500'}`}>
        <div className="text-xs text-amber-400 uppercase font-medium mb-2">
          Now offering ({companies.filter((c) => c.ownerId).length + 1}/{companies.length})
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-bold">{company.sym}</div>
            <div className="text-sm text-broker-text-muted">{company.name}</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold">{fmt(currentPrice)}</div>
            {priceDrops[company.sym] > 0 && (
              <div className="text-xs text-red-400 line-through">{fmt(faceValue)}</div>
            )}
            <div className="text-xs text-broker-text-muted">Rev {fmt(company.revenue)}/OR</div>
          </div>
        </div>
        {company.desc && (
          <div className="text-xs text-broker-text-muted mt-2 border-t border-broker-border pt-2">{company.desc}</div>
        )}
        {highBid && (
          <div className="mt-3 bg-blue-900/50 border border-blue-700/50 rounded px-3 py-2">
            <div className="text-xs text-blue-400 uppercase font-medium">High bid</div>
            <div className="text-sm mt-0.5">
              <span className="font-bold text-white">{fmt(highBid.amount)}</span>
              {' by '}
              <span className="font-medium text-blue-300">{pName(highBid.playerId)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Current player actions */}
      {currentPlayer && (
        <div className="bg-broker-surface rounded-lg p-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-white font-bold">{currentPlayer.name}</span>
              <span className="text-broker-text-muted">'s turn</span>
            </div>
            <div className="text-sm text-broker-text-muted">{fmt(currentPlayer.cash)}</div>
          </div>

          {isForced ? (
            <button
              onClick={handleForcedBuy}
              className="w-full py-2.5 rounded-lg font-medium text-sm bg-red-800 hover:bg-red-700 text-white transition-colors"
            >
              Must take {company.sym} for {fmt(0)}
            </button>
          ) : isHighBidder ? (
            <div className="flex gap-2">
              <div className="flex-1 py-2.5 rounded-lg text-sm text-center bg-blue-900/30 text-blue-300">
                You lead at {fmt(highBid.amount)}
              </div>
              <button
                onClick={handlePass}
                className="flex-1 py-2.5 rounded-lg font-medium text-sm bg-broker-surface-hover hover:bg-red-900/40 text-broker-text-muted hover:text-red-300 transition-colors"
              >
                Withdraw
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={bidInput}
                  onChange={(e) => setBidInput(e.target.value)}
                  placeholder={`Min ${fmt(minBid)}`}
                  className="flex-1 bg-broker-bg border border-broker-border rounded px-3 py-2.5 text-sm text-white placeholder-broker-text-muted"
                />
                <button
                  onClick={handleBid}
                  disabled={!canBid}
                  className="px-5 py-2.5 rounded-lg font-medium text-sm bg-blue-700 hover:bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Bid
                </button>
                <button
                  onClick={handlePass}
                  className="px-5 py-2.5 rounded-lg font-medium text-sm bg-broker-surface-hover hover:bg-red-900/40 text-broker-text-muted hover:text-red-300 transition-colors"
                >
                  Pass
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Player status */}
      <div className="flex gap-1.5 flex-wrap">
        {(highBid ? activeBidders.map((id) => players.find((p) => p.id === id)) : players).filter(Boolean).map((p) => {
          const isCurrent = currentPlayer?.id === p.id
          const isHigh = highBid?.playerId === p.id
          const isOut = highBid && !activeBidders.includes(p.id)
          return (
            <div
              key={p.id}
              className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                isCurrent
                  ? 'bg-blue-700 text-white font-bold ring-2 ring-blue-400'
                  : isOut
                    ? 'bg-broker-surface/30 text-broker-text-muted opacity-40'
                    : isHigh
                      ? 'bg-blue-900/60 text-blue-300 font-medium'
                      : 'bg-broker-surface text-broker-text-muted'
              }`}
            >
              {p.name} {isOut ? '(out)' : isHigh && !isCurrent ? `(${fmt(highBid.amount)})` : ''}
            </div>
          )
        })}
      </div>

      {/* Upcoming */}
      {unsold.filter((c) => c.sym !== company.sym).length > 0 && (
        <div>
          <div className="text-xs text-broker-text-muted font-medium uppercase mb-1">Up next</div>
          <div className="space-y-1">
            {unsold.filter((c) => c.sym !== company.sym).map((c) => (
              <div key={c.sym} className="bg-broker-surface/40 rounded px-3 py-1.5 flex items-center justify-between text-sm text-broker-text-muted">
                <span>{c.sym} — {c.name}</span>
                <span>{fmt(c.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <SoldList companies={companies} players={players} fmt={fmt} />
      {log.length > 0 && <AuctionLog log={log} />}
    </div>
  )
}

function SoldList({ companies, players, fmt }) {
  const sold = companies.filter((c) => c.ownerId)
  if (sold.length === 0) return null
  function ownerName(c) {
    if (c.ownerType === 'player') return players.find((p) => p.id === c.ownerId)?.name ?? c.ownerId
    return c.ownerId
  }
  return (
    <div>
      <div className="text-xs text-broker-text-muted font-medium uppercase mb-1">Sold</div>
      <div className="space-y-1">
        {sold.map((c) => (
          <div key={c.sym} className="bg-broker-surface/40 rounded px-3 py-1.5 flex items-center justify-between text-sm">
            <span className="text-broker-text-muted">{c.sym} — <span className="text-green-400">{ownerName(c)}</span></span>
            <span className="text-broker-text-muted">{fmt(c.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AuctionLog({ log }) {
  return (
    <div>
      <div className="text-xs text-broker-text-muted font-medium uppercase mb-1">Auction log</div>
      <div className="bg-broker-surface/40 rounded px-3 py-2 space-y-0.5 max-h-32 overflow-y-auto">
        {log.map((msg, i) => (
          <div key={i} className={`text-xs ${i === 0 ? 'text-amber-200' : 'text-broker-text-muted'}`}>
            {msg}
          </div>
        ))}
      </div>
    </div>
  )
}
