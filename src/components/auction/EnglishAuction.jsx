import { useState } from 'react'

// English auction (SelectionAuction / PassableAuction from 18xx.games):
// 1. Selection phase: current player picks a company and places opening bid (≥ face value)
// 2. Bidding phase: players bid or pass. Pass = permanently out for this company.
//    Turn goes to player after the high bidder.
//    When only one bidder remains with a bid → they win.
// 3. After win: next player (from where the triggerer was) picks a company.
// 4. If everyone passes without selecting → all pass, cheapest drops by 5.

export default function EnglishAuction({ game, players, dispatch, fmt }) {
  const companies = game.companies

  const [playerIdx, setPlayerIdx] = useState(0)
  const [priceDrops, setPriceDrops] = useState({})
  const [log, setLog] = useState([])

  // Auction state (null = selection phase)
  const [auction, setAuction] = useState(null)
  // auction = { sym, highBid: { playerId, amount }, activeBidders: [ids], bidderIdx: 0, triggerIdx: playerIdx }

  const [bidInput, setBidInput] = useState('')
  const [passedSelection, setPassedSelection] = useState([]) // players who passed selection this round

  const unsold = companies.filter((c) => !c.ownerId)
  const done = unsold.length === 0
  const currentPlayer = players[playerIdx % players.length]

  function addLog(msg) {
    setLog((prev) => [msg, ...prev].slice(0, 30))
  }

  function pName(id) {
    return players.find((p) => p.id === id)?.name ?? id
  }

  function effectivePrice(c) {
    return Math.max(0, c.value - (priceDrops[c.sym] || 0))
  }

  function nextPlayerIdx(fromIdx) {
    return (fromIdx + 1) % players.length
  }

  // --- Selection phase ---

  function handleSelect(companySym, bidValue) {
    const amount = parseInt(bidValue || bidInput, 10)
    const company = unsold.find((c) => c.sym === companySym)
    if (!company || !currentPlayer) return
    const minBid = effectivePrice(company)
    if (!amount || amount < minBid || currentPlayer.cash < amount) return

    addLog(`${pName(currentPlayer.id)} opens auction on ${company.sym} with ${fmt(amount)}`)

    // Find bidder order: starting from player after the triggerer
    const otherPlayers = players.filter((p) => p.id !== currentPlayer.id)
    const activeBidders = [currentPlayer.id, ...otherPlayers.map((p) => p.id)]

    // Filter out players who can't afford min bid + increment
    const canAfford = activeBidders.filter((id) => {
      const p = players.find((pl) => pl.id === id)
      return p && (p.id === currentPlayer.id || p.cash >= amount + 5)
    })

    if (canAfford.length === 1) {
      // Only the opener can afford → they win immediately
      addLog(`${pName(currentPlayer.id)} wins ${company.sym} for ${fmt(amount)} (no one can outbid)`)
      dispatch({
        type: 'BUY_PRIVATE',
        playerId: currentPlayer.id,
        companySym: company.sym,
        price: amount,
      })
      setBidInput('')
      setPassedSelection([])
      setPlayerIdx(nextPlayerIdx(playerIdx))
      return
    }

    setAuction({
      sym: companySym,
      highBid: { playerId: currentPlayer.id, amount },
      activeBidders: canAfford,
      bidderIdx: 1 % canAfford.length, // start with next player after opener
      triggerIdx: playerIdx,
    })
    setBidInput('')
    setPassedSelection([])
  }

  function handlePassSelection() {
    if (!currentPlayer) return
    addLog(`${pName(currentPlayer.id)} passes`)
    const newPassed = [...passedSelection, currentPlayer.id]

    if (newPassed.length >= players.length) {
      // Everyone passed → cheapest drops by 5
      const cheapest = unsold[0]
      if (cheapest) {
        const newDrop = (priceDrops[cheapest.sym] || 0) + 5
        const newPrice = cheapest.value - newDrop
        if (newPrice <= 0) {
          addLog(`${cheapest.sym} drops to ${fmt(0)} — ${pName(currentPlayer.id)} must take it`)
          setPriceDrops({ ...priceDrops, [cheapest.sym]: cheapest.value })
          // Force current player to take it (render will show forced buy)
        } else {
          addLog(`All passed — ${cheapest.sym} drops to ${fmt(newPrice)}`)
          setPriceDrops({ ...priceDrops, [cheapest.sym]: newDrop })
        }
      }
      setPassedSelection([])
      return
    }

    setPassedSelection(newPassed)
    // Skip to next non-passed player
    let next = nextPlayerIdx(playerIdx)
    while (newPassed.includes(players[next % players.length].id)) {
      next = nextPlayerIdx(next)
    }
    setPlayerIdx(next)
  }

  function handleForcedBuy(companySym) {
    if (!currentPlayer) return
    const company = unsold.find((c) => c.sym === companySym)
    if (!company) return
    addLog(`${pName(currentPlayer.id)} takes ${company.sym} for ${fmt(0)}`)
    dispatch({
      type: 'BUY_PRIVATE',
      playerId: currentPlayer.id,
      companySym: company.sym,
      price: 0,
    })
    const newDrops = { ...priceDrops }
    delete newDrops[company.sym]
    setPriceDrops(newDrops)
    setPlayerIdx(nextPlayerIdx(playerIdx))
  }

  // --- Bidding phase ---

  function handleBid() {
    if (!auction || !currentBidder) return
    const amount = parseInt(bidInput, 10)
    const min = auction.highBid.amount + 5
    if (!amount || amount < min || currentBidder.cash < amount) return

    addLog(`${pName(currentBidder.id)} bids ${fmt(amount)} on ${unsold.find((c) => c.sym === auction.sym)?.sym}`)

    // Remove players who can't afford next min bid
    const nextMin = amount + 5
    const canStillBid = auction.activeBidders.filter((id) => {
      if (id === currentBidder.id) return true // bidder stays
      const p = players.find((pl) => pl.id === id)
      return p && p.cash >= nextMin
    })

    const newAuction = {
      ...auction,
      highBid: { playerId: currentBidder.id, amount },
      activeBidders: canStillBid,
    }

    // Check if only high bidder remains
    if (canStillBid.length === 1) {
      winAuction(canStillBid[0], amount)
      setBidInput('')
      return
    }

    // Next bidder (skip the one who just bid)
    const nextIdx = (canStillBid.indexOf(currentBidder.id) + 1) % canStillBid.length
    newAuction.bidderIdx = nextIdx
    setAuction(newAuction)
    setBidInput('')
  }

  function handlePassBid() {
    if (!auction || !currentBidder) return
    addLog(`${pName(currentBidder.id)} passes on ${auction.sym}`)

    const remaining = auction.activeBidders.filter((id) => id !== currentBidder.id)

    if (remaining.length === 1) {
      // Last bidder wins
      winAuction(remaining[0], auction.highBid.amount)
      return
    }

    if (remaining.length === 0) {
      // Everyone passed (shouldn't happen if there's a bid, but handle gracefully)
      setAuction(null)
      return
    }

    const newIdx = auction.bidderIdx % remaining.length
    setAuction({ ...auction, activeBidders: remaining, bidderIdx: newIdx })
  }

  function winAuction(winnerId, price) {
    const sym = auction.sym
    addLog(`${pName(winnerId)} wins ${sym} for ${fmt(price)}`)
    dispatch({
      type: 'BUY_PRIVATE',
      playerId: winnerId,
      companySym: sym,
      price,
    })
    // Resume from next player after the triggerer
    setPlayerIdx(nextPlayerIdx(auction.triggerIdx))
    setAuction(null)
  }

  // Current bidder in auction phase
  const currentBidder = auction
    ? players.find((p) => p.id === auction.activeBidders[auction.bidderIdx % auction.activeBidders.length])
    : null

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

  // Check for forced buy (cheapest at $0)
  const cheapest = unsold[0]
  const cheapestPrice = cheapest ? effectivePrice(cheapest) : 1

  // --- Bidding phase render ---
  if (auction) {
    const company = unsold.find((c) => c.sym === auction.sym)
    const min = auction.highBid.amount + 5
    const bidAmount = parseInt(bidInput, 10)
    const canBid = currentBidder && bidAmount >= min && currentBidder.cash >= bidAmount
    const isHighBidder = currentBidder?.id === auction.highBid.playerId

    return (
      <div className="space-y-3">
        {/* Auction banner */}
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg px-3 py-2 text-sm text-blue-200">
          Auction for <span className="font-bold text-white">{auction.sym}</span> — bid or pass
        </div>

        {/* The company */}
        <div className="bg-broker-surface ring-2 ring-blue-500 rounded-lg p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-bold">{company?.sym}</div>
              <div className="text-sm text-broker-text-muted">{company?.name}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-broker-text-muted">Rev {fmt(company?.revenue || 0)}/OR</div>
            </div>
          </div>
          {company?.desc && (
            <div className="text-xs text-broker-text-muted mt-2 border-t border-broker-border pt-2">
              {company.desc}
            </div>
          )}
          <div className="mt-3 bg-blue-900/50 border border-blue-700/50 rounded px-3 py-2">
            <div className="text-xs text-blue-400 uppercase font-medium">High bid</div>
            <div className="text-sm mt-0.5">
              <span className="font-bold text-white">{fmt(auction.highBid.amount)}</span>
              {' by '}
              <span className="font-medium text-blue-300">{pName(auction.highBid.playerId)}</span>
            </div>
          </div>
        </div>

        {/* Current bidder's turn */}
        {currentBidder && (
          <div className="bg-broker-surface rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-white font-bold">{currentBidder.name}</span>
                <span className="text-broker-text-muted">'s turn</span>
              </div>
              <div className="text-sm text-broker-text-muted">{fmt(currentBidder.cash)}</div>
            </div>

            {isHighBidder ? (
              <div className="flex gap-2">
                <div className="flex-1 py-2.5 rounded-lg text-sm text-center bg-blue-900/30 text-blue-300">
                  You lead at {fmt(auction.highBid.amount)}
                </div>
                <button
                  onClick={handlePassBid}
                  className="flex-1 py-2.5 rounded-lg font-medium text-sm bg-broker-surface-hover hover:bg-red-900/40 text-broker-text-muted hover:text-red-300 transition-colors"
                >
                  Withdraw
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={bidInput}
                  onChange={(e) => setBidInput(e.target.value)}
                  placeholder={`Min ${fmt(min)}`}
                  className="flex-1 bg-broker-bg border border-broker-border rounded px-3 py-2.5 text-sm text-white placeholder-broker-text-muted"
                  autoFocus
                />
                <button
                  onClick={handleBid}
                  disabled={!canBid}
                  className="px-5 py-2.5 rounded-lg font-medium text-sm bg-blue-700 hover:bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Bid
                </button>
                <button
                  onClick={handlePassBid}
                  className="px-5 py-2.5 rounded-lg font-medium text-sm bg-broker-surface-hover hover:bg-red-900/40 text-broker-text-muted hover:text-red-300 transition-colors"
                >
                  Pass
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bidder status */}
        <div className="flex gap-1.5 flex-wrap">
          {players.map((p) => {
            const inAuction = auction.activeBidders.includes(p.id)
            const isCurrent = currentBidder?.id === p.id
            const isHigh = auction.highBid.playerId === p.id
            return (
              <div
                key={p.id}
                className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-blue-700 text-white font-bold ring-2 ring-blue-400'
                    : !inAuction
                      ? 'bg-broker-surface/30 text-broker-text-muted opacity-40'
                      : isHigh
                        ? 'bg-blue-900/60 text-blue-300 font-medium'
                        : 'bg-broker-surface text-broker-text-muted'
                }`}
              >
                {p.name} {!inAuction ? '(out)' : isHigh && !isCurrent ? `(${fmt(auction.highBid.amount)})` : ''}
              </div>
            )
          })}
        </div>

        {log.length > 0 && <AuctionLog log={log} />}
      </div>
    )
  }

  // --- Selection phase render ---
  return (
    <div className="space-y-3">
      {/* Current player picks a company */}
      <div className="bg-broker-surface rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-white font-bold">{currentPlayer?.name}</span>
            <span className="text-broker-text-muted"> — select a company to auction</span>
          </div>
          <div className="text-sm text-broker-text-muted">{currentPlayer && fmt(currentPlayer.cash)}</div>
        </div>

        {/* Forced buy at $0 */}
        {cheapestPrice === 0 && (
          <div className="mt-2">
            <button
              onClick={() => handleForcedBuy(cheapest.sym)}
              className="w-full py-2.5 rounded-lg font-medium text-sm bg-red-800 hover:bg-red-700 text-white transition-colors"
            >
              Must take {cheapest.sym} for {fmt(0)}
            </button>
          </div>
        )}

        {/* Pass (only if no forced buy) */}
        {cheapestPrice > 0 && (
          <div className="mt-2">
            <button
              onClick={handlePassSelection}
              className="w-full py-2.5 rounded-lg font-medium text-sm bg-broker-surface-hover hover:bg-red-900/40 text-broker-text-muted hover:text-red-300 transition-colors"
            >
              Pass
            </button>
          </div>
        )}
      </div>

      {/* Available companies — tap to open auction */}
      <div className="space-y-2">
        {unsold.map((c) => (
          <SelectableCompanyCard
            key={c.sym}
            company={c}
            price={effectivePrice(c)}
            isCheapest={c.sym === cheapest?.sym}
            priceDrop={priceDrops[c.sym] || 0}
            canAuction={cheapestPrice > 0}
            currentPlayer={currentPlayer}
            fmt={fmt}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Player status */}
      <div className="flex gap-1.5 flex-wrap">
        {players.map((p) => {
          const isPassed = passedSelection.includes(p.id)
          const isCurrent = currentPlayer?.id === p.id
          return (
            <div
              key={p.id}
              className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                isCurrent
                  ? 'bg-blue-700 text-white font-bold ring-2 ring-blue-400'
                  : isPassed
                    ? 'bg-broker-surface/30 text-broker-text-muted opacity-40'
                    : 'bg-broker-surface text-broker-text-muted'
              }`}
            >
              {p.name} {isPassed ? '(passed)' : ''}
            </div>
          )
        })}
      </div>

      <SoldList companies={companies} players={players} fmt={fmt} />
      {log.length > 0 && <AuctionLog log={log} />}
    </div>
  )
}

function SelectableCompanyCard({ company, price, isCheapest, priceDrop, canAuction, currentPlayer, fmt, onSelect }) {
  const [showBid, setShowBid] = useState(false)
  const [localBid, setLocalBid] = useState(String(price))

  function handleOpen() {
    setShowBid(true)
    setLocalBid(String(price))
  }

  function handleSubmit() {
    onSelect(company.sym, localBid)
    setShowBid(false)
    setLocalBid(String(price))
  }

  const bidAmount = parseInt(localBid, 10)
  const canSubmit = currentPlayer && bidAmount >= price && currentPlayer.cash >= bidAmount

  return (
    <div className={`bg-broker-surface rounded-lg p-3 transition-all ${isCheapest ? 'ring-1 ring-amber-500/50' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-medium">
            {company.sym}
            <span className="text-broker-text-muted font-normal"> — {company.name}</span>
          </div>
          <div className="text-xs text-broker-text-muted mt-0.5">
            Value: {fmt(price)}
            {priceDrop > 0 && <span className="text-red-400 ml-1 line-through">{fmt(company.value)}</span>}
            {' · Rev: '}{fmt(company.revenue)}/OR
          </div>
          {company.desc && <div className="text-xs text-broker-text-muted mt-1">{company.desc}</div>}
        </div>

        {canAuction && !showBid && (
          <button onClick={handleOpen} className="text-xs bg-blue-900/60 hover:bg-blue-800 text-blue-200 px-3 py-1.5 rounded flex-shrink-0">
            Auction
          </button>
        )}
      </div>

      {showBid && currentPlayer && (
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            value={localBid}
            onChange={(e) => setLocalBid(e.target.value)}
            placeholder={`Min ${fmt(price)}`}
            className="flex-1 bg-broker-bg border border-broker-border rounded px-3 py-2 text-sm text-white placeholder-broker-text-muted"
            autoFocus
          />
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-4 py-2 rounded-lg font-medium text-sm bg-blue-700 hover:bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Open at {localBid ? fmt(parseInt(localBid, 10) || 0) : ''}
          </button>
          <button
            onClick={() => setShowBid(false)}
            className="px-2 py-2 rounded text-broker-text-muted hover:text-white text-sm"
          >
            Cancel
          </button>
        </div>
      )}
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
