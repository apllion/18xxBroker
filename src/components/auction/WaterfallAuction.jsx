import { useState, useEffect } from 'react'

// 1830-style waterfall auction:
// - All privates visible, cheapest is "buyable" at face value (if no bids on it)
// - On your turn: buy cheapest at face, bid on ANY private (min face+5 / bid+5), or pass
// - Pass = done for this round (not permanently out)
// - After a full round of all passes:
//   → cheapest with bids: resolve (1 bidder = auto-win, 2+ bidders = bid fight)
//   → no bids: cheapest price drops by 5
// - Bid fight: only the bidders compete, ascending bids, pass = out. Last one wins.

export default function WaterfallAuction({ game, players, dispatch, fmt, auctionType }) {
  const companies = game.companies

  // bids[sym] = { high: { playerId, amount }, bidders: [playerId, ...] }
  const [bids, setBids] = useState({})
  const [passedThisRound, setPassed] = useState([])
  const [playerIdx, setPlayerIdx] = useState(0)
  const [priceDrops, setPriceDrops] = useState({})
  const [bidInput, setBidInput] = useState('')
  const [bidTarget, setBidTarget] = useState(null)
  const [log, setLog] = useState([])

  // Bid fight state: when cheapest has 2+ bidders
  const [bidFight, setBidFight] = useState(null) // { sym, activeBidders: [ids], fightIdx: 0 }

  const unsold = companies.filter((c) => !c.ownerId)
  const done = unsold.length === 0

  const cheapest = unsold.length > 0 ? unsold[0] : null
  const cheapestPrice = cheapest ? Math.max(0, cheapest.value - (priceDrops[cheapest.sym] || 0)) : 0

  // Check if cheapest has bids and auto-resolve or start bid fight
  useEffect(() => {
    if (!cheapest || bidFight) return
    const entry = bids[cheapest.sym]
    if (!entry) return

    if (entry.bidders.length === 1) {
      // Auto-sell to single bidder
      addLog(`${pName(entry.high.playerId)} wins ${cheapest.sym} for ${fmt(entry.high.amount)} (sole bidder)`)
      dispatch({
        type: 'BUY_PRIVATE',
        playerId: entry.high.playerId,
        companySym: cheapest.sym,
        price: entry.high.amount,
      })
      clearBid(cheapest.sym)
    } else if (entry.bidders.length > 1) {
      // Start bid fight among the bidders
      addLog(`${cheapest.sym} has ${entry.bidders.length} bidders — bid fight!`)
      const orderedBidders = players
        .filter((p) => entry.bidders.includes(p.id))
        .map((p) => p.id)
      setBidFight({ sym: cheapest.sym, activeBidders: orderedBidders, fightIdx: 0 })
    }
  }, [cheapest?.sym, bids, bidFight])

  // Normal mode: current player from full player list
  const currentPlayer = bidFight
    ? players.find((p) => p.id === bidFight.activeBidders[bidFight.fightIdx % bidFight.activeBidders.length])
    : players[playerIdx % players.length]

  function addLog(msg) {
    setLog((prev) => [msg, ...prev].slice(0, 30))
  }

  function pName(id) {
    return players.find((p) => p.id === id)?.name ?? id
  }

  function effectivePrice(c) {
    return Math.max(0, c.value - (priceDrops[c.sym] || 0))
  }

  function minBidFor(c) {
    const entry = bids[c.sym]
    return entry ? entry.high.amount + 5 : effectivePrice(c) + 5
  }

  function nextPlayerIdx(fromIdx) {
    return (fromIdx + 1) % players.length
  }

  function clearBid(sym) {
    const newBids = { ...bids }
    delete newBids[sym]
    setBids(newBids)
    const newDrops = { ...priceDrops }
    delete newDrops[sym]
    setPriceDrops(newDrops)
  }

  function startNewRound() {
    setPassed([])
  }

  // --- Normal auction actions ---

  function handleBuy() {
    if (bidFight || !currentPlayer || !cheapest) return
    if (currentPlayer.cash < cheapestPrice) return
    if (bids[cheapest.sym]) return // can't buy if has bid

    addLog(`${pName(currentPlayer.id)} buys ${cheapest.sym} for ${fmt(cheapestPrice)}`)
    dispatch({
      type: 'BUY_PRIVATE',
      playerId: currentPlayer.id,
      companySym: cheapest.sym,
      price: cheapestPrice,
    })
    clearBid(cheapest.sym)
    setPassed([])
    setPlayerIdx(nextPlayerIdx(playerIdx))
  }

  function handleBid(companySym) {
    if (bidFight) return
    if (!currentPlayer) return
    const amount = parseInt(bidInput, 10)
    const company = unsold.find((c) => c.sym === companySym)
    if (!company) return
    const min = minBidFor(company)
    if (!amount || amount < min || currentPlayer.cash < amount) return

    addLog(`${pName(currentPlayer.id)} bids ${fmt(amount)} on ${company.sym}`)

    const existing = bids[companySym]
    const bidders = existing ? [...new Set([...existing.bidders, currentPlayer.id])] : [currentPlayer.id]
    setBids({
      ...bids,
      [companySym]: { high: { playerId: currentPlayer.id, amount }, bidders },
    })
    setBidInput('')
    setBidTarget(null)
    setPassed([])
    setPlayerIdx(nextPlayerIdx(playerIdx))
  }

  function handlePass() {
    if (bidFight) return
    if (!currentPlayer) return
    const newPassed = [...passedThisRound, currentPlayer.id]
    addLog(`${pName(currentPlayer.id)} passes`)

    if (newPassed.length >= players.length) {
      resolveRound()
      return
    }

    setPassed(newPassed)
    let next = nextPlayerIdx(playerIdx)
    while (newPassed.includes(players[next % players.length].id)) {
      next = nextPlayerIdx(next)
    }
    setPlayerIdx(next)
  }

  function resolveRound() {
    // Full round of passes
    // Cheapest with bids will be caught by useEffect (auto-sell or bid fight)
    // If no bids: price drops
    const cheapestWithBid = unsold.find((c) => bids[c.sym])

    if (!cheapestWithBid) {
      const sym = cheapest?.sym
      if (sym) {
        const newDrop = (priceDrops[sym] || 0) + 5
        const newPrice = cheapest.value - newDrop

        if (newPrice <= 0) {
          // Drop to 0 — next player must buy it (render will enforce)
          addLog(`${cheapest.sym} drops to ${fmt(0)} — must be taken`)
          setPriceDrops({ ...priceDrops, [sym]: cheapest.value }) // exact drop to 0
        } else {
          addLog(`No bids — ${cheapest.sym} drops to ${fmt(newPrice)}`)
          setPriceDrops({ ...priceDrops, [sym]: newDrop })
        }
      }
    }
    // If there IS a bid, the useEffect will handle it when cheapest recalculates
    startNewRound()
  }

  // --- Bid fight actions ---

  function handleFightBid() {
    if (!bidFight || !currentPlayer) return
    const amount = parseInt(bidInput, 10)
    const entry = bids[bidFight.sym]
    const min = entry ? entry.high.amount + 5 : 0
    if (!amount || amount < min || currentPlayer.cash < amount) return

    addLog(`Bid fight: ${pName(currentPlayer.id)} bids ${fmt(amount)} on ${cheapest.sym}`)
    setBids({
      ...bids,
      [bidFight.sym]: { ...entry, high: { playerId: currentPlayer.id, amount } },
    })
    setBidInput('')
    setBidFight({
      ...bidFight,
      fightIdx: (bidFight.fightIdx + 1) % bidFight.activeBidders.length,
    })
  }

  function handleFightPass() {
    if (!bidFight || !currentPlayer) return
    addLog(`Bid fight: ${pName(currentPlayer.id)} passes`)

    const remaining = bidFight.activeBidders.filter((id) => id !== currentPlayer.id)

    if (remaining.length === 1) {
      // Winner
      const entry = bids[bidFight.sym]
      const winnerId = remaining[0]
      // Winner is the high bidder (they must be, since the other person just passed)
      const price = entry.high.amount
      addLog(`${pName(winnerId)} wins ${cheapest.sym} for ${fmt(price)}`)
      dispatch({
        type: 'BUY_PRIVATE',
        playerId: winnerId,
        companySym: bidFight.sym,
        price,
      })
      clearBid(bidFight.sym)
      setBidFight(null)
      startNewRound()
      return
    }

    // More than 1 remaining — continue fight
    const newFightIdx = bidFight.fightIdx % remaining.length
    setBidFight({ ...bidFight, activeBidders: remaining, fightIdx: newFightIdx })
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

  const cheapestHasBid = cheapest && !!bids[cheapest.sym]
  const canBuyCheapest = currentPlayer && currentPlayer.cash >= cheapestPrice && !cheapestHasBid && !bidFight

  // --- Bid fight render ---
  if (bidFight && cheapest) {
    const entry = bids[bidFight.sym]
    const fightMin = entry ? entry.high.amount + 5 : 0
    const fightBidAmount = parseInt(bidInput, 10)
    const canFightBid = currentPlayer && fightBidAmount >= fightMin && currentPlayer.cash >= fightBidAmount

    return (
      <div className="space-y-3">
        {/* Bid fight banner */}
        <div className="bg-red-900/30 border border-red-700/50 rounded-lg px-3 py-2 text-sm text-red-200">
          Bid fight for <span className="font-bold text-white">{cheapest.sym}</span> — only bidders may compete
        </div>

        {/* The company */}
        <div className="bg-broker-surface ring-2 ring-red-500 rounded-lg p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-bold">{cheapest.sym}</div>
              <div className="text-sm text-broker-text-muted">{cheapest.name}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-broker-text-muted">Rev {fmt(cheapest.revenue)}/OR</div>
            </div>
          </div>
          {cheapest.desc && (
            <div className="text-xs text-broker-text-muted mt-2 border-t border-broker-border pt-2">
              {cheapest.desc}
            </div>
          )}
          {entry && (
            <div className="mt-3 bg-blue-900/50 border border-blue-700/50 rounded px-3 py-2">
              <div className="text-xs text-blue-400 uppercase font-medium">High bid</div>
              <div className="text-sm mt-0.5">
                <span className="font-bold text-white">{fmt(entry.high.amount)}</span>
                {' by '}
                <span className="font-medium text-blue-300">{pName(entry.high.playerId)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Current fighter's turn */}
        {currentPlayer && (
          <div className="bg-broker-surface rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-white font-bold">{currentPlayer.name}</span>
                <span className="text-broker-text-muted">'s turn</span>
              </div>
              <div className="text-sm text-broker-text-muted">{fmt(currentPlayer.cash)}</div>
            </div>

            {/* Can't bid against yourself if you're the high bidder */}
            {entry?.high.playerId === currentPlayer.id ? (
              <div className="flex gap-2">
                <div className="flex-1 py-2.5 rounded-lg text-sm text-center bg-blue-900/30 text-blue-300">
                  You lead at {fmt(entry.high.amount)}
                </div>
                <button
                  onClick={handleFightPass}
                  className="flex-1 py-2.5 rounded-lg font-medium text-sm bg-broker-surface-hover hover:bg-red-900/40 text-broker-text-muted hover:text-red-300 transition-colors"
                >
                  Pass (forfeit)
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={bidInput}
                    onChange={(e) => setBidInput(e.target.value)}
                    placeholder={`Min ${fmt(fightMin)}`}
                    className="flex-1 bg-broker-bg border border-broker-border rounded px-3 py-2.5 text-sm text-white placeholder-broker-text-muted"
                    autoFocus
                  />
                  <button
                    onClick={handleFightBid}
                    disabled={!canFightBid}
                    className="px-5 py-2.5 rounded-lg font-medium text-sm bg-blue-700 hover:bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Bid
                  </button>
                  <button
                    onClick={handleFightPass}
                    className="px-5 py-2.5 rounded-lg font-medium text-sm bg-broker-surface-hover hover:bg-red-900/40 text-broker-text-muted hover:text-red-300 transition-colors"
                  >
                    Pass
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Fighter status */}
        <div className="flex gap-1.5 flex-wrap">
          {bidFight.activeBidders.map((id) => {
            const p = players.find((pl) => pl.id === id)
            const isCurrent = currentPlayer?.id === id
            const isHigh = entry?.high.playerId === id
            return (
              <div
                key={id}
                className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-red-700 text-white font-bold ring-2 ring-red-400'
                    : isHigh
                      ? 'bg-blue-900/60 text-blue-300 font-medium'
                      : 'bg-broker-surface text-broker-text-muted'
                }`}
              >
                {p?.name} {isHigh && !isCurrent ? `(${fmt(entry.high.amount)})` : ''}
              </div>
            )
          })}
        </div>

        {log.length > 0 && <AuctionLog log={log} />}
      </div>
    )
  }

  // --- Normal auction render ---
  return (
    <div className="space-y-3">
      {/* Current player turn */}
      <div className="bg-broker-surface rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-white font-bold">{currentPlayer?.name}</span>
            <span className="text-broker-text-muted">'s turn</span>
          </div>
          <div className="text-sm text-broker-text-muted">{currentPlayer && fmt(currentPlayer.cash)}</div>
        </div>

        <div className="flex gap-2 mt-2">
          {/* Price is 0 — must buy, no pass */}
          {cheapest && cheapestPrice === 0 && (
            <button
              onClick={handleBuy}
              className="flex-1 py-2.5 rounded-lg font-medium text-sm bg-red-800 hover:bg-red-700 text-white transition-colors"
            >
              Must take {cheapest.sym} for {fmt(0)}
            </button>
          )}

          {/* Normal buy (face value, no bids) */}
          {cheapest && cheapestPrice > 0 && !cheapestHasBid && (
            <button
              onClick={handleBuy}
              disabled={!canBuyCheapest}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                canBuyCheapest
                  ? 'bg-green-800 hover:bg-green-700 text-white'
                  : 'bg-broker-surface-hover text-broker-text-muted opacity-40 cursor-not-allowed'
              }`}
            >
              Buy {cheapest.sym} for {fmt(cheapestPrice)}
            </button>
          )}

          {/* Cheapest has a bid */}
          {cheapestHasBid && cheapestPrice > 0 && (
            <div className="flex-1 py-2.5 rounded-lg text-sm text-center bg-blue-900/30 text-blue-300">
              {cheapest.sym} has a bid — outbid or pass
            </div>
          )}

          {/* Pass — not allowed when cheapest is 0 */}
          {cheapestPrice > 0 && (
            <button
              onClick={handlePass}
              className="flex-1 py-2.5 rounded-lg font-medium text-sm bg-broker-surface-hover hover:bg-red-900/40 text-broker-text-muted hover:text-red-300 transition-colors"
            >
              Pass
            </button>
          )}
        </div>
      </div>

      {/* All unsold companies */}
      <div className="space-y-2">
        {unsold.map((c) => {
          const price = effectivePrice(c)
          const entry = bids[c.sym]
          const isCheapest = c.sym === cheapest?.sym
          const min = minBidFor(c)
          const isBidding = bidTarget === c.sym

          return (
            <div
              key={c.sym}
              className={`bg-broker-surface rounded-lg p-3 transition-all ${
                isCheapest ? 'ring-2 ring-amber-500' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium">
                    {c.sym}
                    <span className="text-broker-text-muted font-normal"> — {c.name}</span>
                    {isCheapest && !entry && <span className="text-amber-400 text-xs ml-1">(buyable)</span>}
                    {isCheapest && entry && <span className="text-blue-400 text-xs ml-1">(has bid)</span>}
                  </div>
                  <div className="text-xs text-broker-text-muted mt-0.5">
                    Value: {fmt(price)}
                    {priceDrops[c.sym] > 0 && (
                      <span className="text-red-400 ml-1 line-through">{fmt(c.value)}</span>
                    )}
                    {' · Rev: '}{fmt(c.revenue)}/OR
                  </div>
                  {c.desc && <div className="text-xs text-broker-text-muted mt-1">{c.desc}</div>}
                </div>

                <div className="flex-shrink-0 text-right">
                  {entry && (
                    <div className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded mb-1">
                      {pName(entry.high.playerId)}: {fmt(entry.high.amount)}
                      {entry.bidders.length > 1 && (
                        <span className="text-blue-400 ml-1">+{entry.bidders.length - 1}</span>
                      )}
                    </div>
                  )}
                  {!isBidding && (!isCheapest || entry) && (
                    <button
                      onClick={() => { setBidTarget(c.sym); setBidInput(String(min)) }}
                      className="text-xs bg-blue-900/60 hover:bg-blue-800 text-blue-200 px-2 py-1 rounded"
                    >
                      Bid
                    </button>
                  )}
                </div>
              </div>

              {isBidding && currentPlayer && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="number"
                    value={bidInput}
                    onChange={(e) => setBidInput(e.target.value)}
                    placeholder={`Min ${fmt(min)}`}
                    className="flex-1 bg-broker-bg border border-broker-border rounded px-3 py-2 text-sm text-white placeholder-broker-text-muted"
                    autoFocus
                  />
                  <button
                    onClick={() => handleBid(c.sym)}
                    disabled={!parseInt(bidInput, 10) || parseInt(bidInput, 10) < min || currentPlayer.cash < parseInt(bidInput, 10)}
                    className="px-4 py-2 rounded-lg font-medium text-sm bg-blue-700 hover:bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Bid {bidInput ? fmt(parseInt(bidInput, 10)) : ''}
                  </button>
                  <button
                    onClick={() => { setBidTarget(null); setBidInput('') }}
                    className="px-2 py-2 rounded text-broker-text-muted hover:text-white text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Player status */}
      <div className="flex gap-1.5 flex-wrap">
        {players.map((p) => {
          const isPassed = passedThisRound.includes(p.id)
          const isCurrent = currentPlayer?.id === p.id
          const hasBid = Object.values(bids).some((e) => e.bidders.includes(p.id))
          return (
            <div
              key={p.id}
              className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                isCurrent
                  ? 'bg-blue-700 text-white font-bold ring-2 ring-blue-400'
                  : isPassed
                    ? 'bg-broker-surface/30 text-broker-text-muted opacity-40'
                    : hasBid
                      ? 'bg-blue-900/60 text-blue-300'
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
