import { useState, useMemo } from 'react'

// 1846-style secret draft:
// - Companies shuffled randomly
// - Only playerCount + 2 visible at a time (the "draw")
// - Each player secretly picks one from the draw
// - Unchosen cards shuffled back into deck
// - At the end: all picks revealed, players pay
// - If only 1 company left: can pass to reduce price by $10

function isPassCard(sym) {
  return sym.startsWith('PASS_')
}

export default function SecretDraft({ game, players, dispatch, fmt }) {
  const allCompanies = game.companies

  // Generate pass cards based on title config
  const passCards = useMemo(() => {
    if (game.title.draftPassCards !== 'per_player') return []
    if (players.length <= 2) return [] // no pass cards in 2p
    return Array.from({ length: players.length }, (_, i) => ({
      sym: `PASS_${i + 1}`,
      name: `Pass (${i + 1})`,
      value: 0,
      revenue: 0,
      desc: "Choose this if you don't want to purchase any of the offered companies this turn.",
      isPass: true,
    }))
  }, [game.title.draftPassCards, players.length])

  const allCards = useMemo(() => [...allCompanies, ...passCards], [allCompanies, passCards])

  // Shuffle on first render
  const [deck, setDeck] = useState(() => {
    const shuffled = [...allCards].sort(() => Math.random() - 0.5)
    return shuffled.map((c) => c.sym)
  })

  const [picks, setPicks] = useState({})        // { playerId: [companySym, ...] }
  const [turnIdx, setTurnIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [log, setLog] = useState([])
  const [lastDiscount, setLastDiscount] = useState({}) // { companySym: discountAmount }

  const drawSize = players.length + 2
  const remaining = deck.filter((sym) => !Object.values(picks).flat().includes(sym))
  const draw = remaining.slice(0, drawSize)
  const currentPlayer = players[turnIdx % players.length]
  const totalPicks = Object.values(picks).flat().length
  const roundNum = Math.floor(totalPicks / players.length)

  // All done when no more cards to draw or all picked
  const draftDone = remaining.length === 0 || (draw.length === 0)
  // Only one real company left
  const onlyOne = remaining.length === 1

  function addLog(msg) {
    setLog((prev) => [msg, ...prev].slice(0, 30))
  }

  function handlePick(companySym) {
    if (!currentPlayer || revealed) return

    const playerPicks = picks[currentPlayer.id] || []
    const newPicks = { ...picks, [currentPlayer.id]: [...playerPicks, companySym] }
    setPicks(newPicks)

    addLog(`${currentPlayer.name} chose a company`)

    // Shuffle unchosen draw cards back into remaining deck
    if (!onlyOne) {
      const unchosen = draw.filter((sym) => sym !== companySym)
      const rest = remaining.filter((sym) => !draw.includes(sym))
      const reshuffled = [...rest, ...unchosen].sort(() => Math.random() - 0.5)
      setDeck([companySym, ...Object.values(newPicks).flat().filter((s) => s !== companySym), ...reshuffled])
    }

    setTurnIdx((turnIdx + 1) % players.length)
  }

  function handlePass() {
    if (!onlyOne || revealed) return
    const sym = remaining[0]
    const company = allCompanies.find((c) => c.sym === sym)
    const currentDiscount = lastDiscount[sym] || 0
    const newDiscount = currentDiscount + 10
    const newPrice = company.value - newDiscount

    addLog(`${currentPlayer.name} passes — ${sym} drops to ${fmt(Math.max(0, newPrice))}`)
    setLastDiscount({ ...lastDiscount, [sym]: newDiscount })

    if (newPrice <= 0) {
      // Must take it
      handlePick(sym)
    } else {
      setTurnIdx((turnIdx + 1) % players.length)
    }
  }

  function handleReveal() {
    setRevealed(true)
    const entries = []
    for (const [playerId, syms] of Object.entries(picks)) {
      for (const sym of syms) {
        if (isPassCard(sym)) {
          const player = players.find((p) => p.id === playerId)
          entries.push(`${player?.name} chose Pass`)
          continue
        }
        const company = allCards.find((c) => c.sym === sym)
        const discount = lastDiscount[sym] || 0
        const price = Math.max(0, company.value - discount)
        dispatch({ type: 'BUY_PRIVATE', playerId, companySym: sym, price })
        const player = players.find((p) => p.id === playerId)
        entries.push(`${player?.name} buys ${sym} for ${fmt(price)}`)
      }
    }
    for (const e of entries) addLog(e)
  }

  function getCompany(sym) {
    return allCards.find((c) => c.sym === sym)
  }

  // --- Render ---

  if (revealed) {
    return (
      <div className="space-y-3">
        <div className="bg-broker-surface rounded-lg p-4 text-center text-green-300 font-medium">
          Draft complete
        </div>
        {players.map((p) => {
          const syms = picks[p.id] || []
          return (
            <div key={p.id} className="bg-broker-surface rounded-lg p-3">
              <div className="font-medium text-sm mb-1">{p.name}</div>
              {syms.length === 0 && <div className="text-xs text-broker-text-muted">No picks</div>}
              {syms.map((sym) => {
                if (isPassCard(sym)) {
                  return <div key={sym} className="text-xs text-broker-text-muted opacity-50">Pass</div>
                }
                const c = getCompany(sym)
                const discount = lastDiscount[sym] || 0
                const price = Math.max(0, c.value - discount)
                return (
                  <div key={sym} className="text-xs text-broker-text-muted">
                    {c.sym} — {c.name} ({fmt(price)})
                  </div>
                )
              })}
            </div>
          )
        })}
        {log.length > 0 && <AuctionLog log={log} />}
      </div>
    )
  }

  if (draftDone) {
    return (
      <div className="space-y-3">
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg px-3 py-2 text-sm text-amber-200">
          All picks made — reveal to process payments
        </div>
        <div className="bg-broker-surface rounded-lg p-3">
          {players.map((p) => {
            const count = (picks[p.id] || []).length
            return (
              <div key={p.id} className="text-sm text-broker-text-muted py-0.5">
                {p.name}: {count} pick{count !== 1 ? 's' : ''} (hidden)
              </div>
            )
          })}
        </div>
        <button
          onClick={handleReveal}
          className="w-full py-3 rounded-lg font-medium bg-broker-green text-broker-gold hover:bg-broker-green-light transition-colors"
        >
          Reveal All Picks
        </button>
        {log.length > 0 && <AuctionLog log={log} />}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Current player */}
      <div className="bg-broker-surface rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-white font-bold">{currentPlayer?.name}</span>
            <span className="text-broker-text-muted">'s pick (round {roundNum + 1})</span>
          </div>
          <div className="text-sm text-broker-text-muted">{currentPlayer && fmt(currentPlayer.cash)}</div>
        </div>
        <div className="text-xs text-broker-text-muted mt-1">
          Other players: look away! Pick is secret until reveal.
        </div>
      </div>

      {/* Visible draw */}
      <div className="space-y-2">
        <div className="text-xs text-broker-text-muted font-medium uppercase">
          {draw.length} of {remaining.length} visible
        </div>
        {draw.map((sym) => {
          const c = getCompany(sym)
          const pass = isPassCard(sym)
          const discount = lastDiscount[sym] || 0
          const price = pass ? 0 : Math.max(0, c.value - discount)
          const canAfford = pass || (currentPlayer && currentPlayer.cash >= price)

          if (pass) {
            return (
              <div key={sym} className="bg-broker-surface/50 border border-dashed border-broker-border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-broker-text-muted">{c.name}</div>
                    <div className="text-xs text-broker-text-muted">{c.desc}</div>
                  </div>
                  <button
                    onClick={() => handlePick(sym)}
                    className="flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm bg-broker-surface-hover hover:bg-broker-surface text-broker-text-muted hover:text-white transition-colors"
                  >
                    Pass
                  </button>
                </div>
              </div>
            )
          }

          return (
            <div key={sym} className="bg-broker-surface rounded-lg p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium">
                    {c.sym}
                    <span className="text-broker-text-muted font-normal"> — {c.name}</span>
                  </div>
                  <div className="text-xs text-broker-text-muted mt-0.5">
                    Value: {fmt(price)}
                    {discount > 0 && <span className="text-red-400 ml-1 line-through">{fmt(c.value)}</span>}
                    {c.revenue > 0 && ` · Rev: ${fmt(c.revenue)}/OR`}
                  </div>
                  {c.desc && <div className="text-xs text-broker-text-muted mt-1">{c.desc}</div>}
                </div>
                <button
                  onClick={() => handlePick(sym)}
                  disabled={!canAfford}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    canAfford
                      ? 'bg-green-800 hover:bg-green-700 text-white'
                      : 'bg-broker-surface-hover text-broker-text-muted opacity-40 cursor-not-allowed'
                  }`}
                >
                  Pick
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Face-down count */}
      {remaining.length > draw.length && (
        <div className="text-xs text-broker-text-muted text-center">
          {remaining.length - draw.length} card{remaining.length - draw.length !== 1 ? 's' : ''} face-down in deck
        </div>
      )}

      {/* Pass button (only when 1 company left) */}
      {onlyOne && (
        <button
          onClick={handlePass}
          className="w-full py-2 rounded-lg text-sm bg-broker-surface-hover hover:bg-red-900/30 text-broker-text-muted hover:text-red-300 transition-colors"
        >
          Pass (reduce price by {fmt(10)})
        </button>
      )}

      {/* Player picks so far */}
      {totalPicks > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {players.map((p) => {
            const count = (picks[p.id] || []).length
            const isCurrent = currentPlayer?.id === p.id
            return (
              <div key={p.id} className={`text-xs px-2.5 py-1 rounded-full ${
                isCurrent
                  ? 'bg-blue-700 text-white font-bold ring-2 ring-blue-400'
                  : count > 0
                    ? 'bg-broker-surface text-broker-text-muted'
                    : 'bg-broker-surface/50 text-broker-text-muted opacity-50'
              }`}>
                {p.name} {count > 0 ? `(${count})` : ''}
              </div>
            )
          })}
        </div>
      )}

      {log.length > 0 && <AuctionLog log={log} />}
    </div>
  )
}

function AuctionLog({ log }) {
  return (
    <div>
      <div className="text-xs text-broker-text-muted font-medium uppercase mb-1">Draft log</div>
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
