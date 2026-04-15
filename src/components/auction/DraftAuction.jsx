import { useState } from 'react'

export default function DraftAuction({ game, players, dispatch, fmt, auctionType }) {
  const companies = game.companies
  const [turnIdx, setTurnIdx] = useState(0)
  const [lastEvent, setLastEvent] = useState(null)

  const unsold = companies.filter((c) => !c.ownerId)
  const sold = companies.filter((c) => c.ownerId)
  const currentPlayer = players[turnIdx % players.length]
  const isComplete = unsold.length === 0

  function handlePick(companySym) {
    const company = companies.find((c) => c.sym === companySym)
    if (!company || !currentPlayer) return
    if (currentPlayer.cash < company.value) return

    setLastEvent(`${currentPlayer.name} takes ${company.sym} for ${fmt(company.value)}`)
    dispatch({
      type: 'BUY_PRIVATE',
      playerId: currentPlayer.id,
      companySym: company.sym,
      price: company.value,
    })
    setTurnIdx((turnIdx + 1) % players.length)
  }

  function handlePass() {
    setLastEvent(`${currentPlayer.name} passes`)
    setTurnIdx((turnIdx + 1) % players.length)
  }

  function playerName(id) {
    return players.find((p) => p.id === id)?.name ?? id
  }

  return (
    <div className="space-y-3">
      {/* Status */}
      {lastEvent && (
        <div className="bg-broker-surface/80 border border-broker-border rounded-lg px-3 py-2 text-sm text-amber-200">
          {lastEvent}
        </div>
      )}

      {/* Current player */}
      {!isComplete && currentPlayer && (
        <div className="bg-broker-surface rounded-lg p-3">
          <div className="text-sm mb-1">
            <span className="text-white font-medium">{currentPlayer.name}</span>
            <span className="text-broker-text-muted"> picks ({fmt(currentPlayer.cash)} cash)</span>
          </div>
        </div>
      )}

      {/* Available companies */}
      {unsold.length > 0 && (
        <div className="space-y-2">
          {unsold.map((c) => {
            const canAfford = currentPlayer && currentPlayer.cash >= c.value
            return (
              <div key={c.sym} className="bg-broker-surface rounded-lg p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium">{c.sym} <span className="text-broker-text-muted font-normal">— {c.name}</span></div>
                    <div className="text-xs text-broker-text-muted mt-0.5">
                      Value: {fmt(c.value)} · Revenue: {fmt(c.revenue)}/OR
                    </div>
                    {c.desc && <div className="text-xs text-broker-text-muted mt-1">{c.desc}</div>}
                  </div>
                  <button
                    onClick={() => handlePick(c.sym)}
                    disabled={!canAfford || isComplete}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      canAfford && !isComplete
                        ? 'bg-green-800 hover:bg-green-700 text-white'
                        : 'bg-broker-surface-hover text-broker-text-muted opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {fmt(c.value)}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pass button */}
      {!isComplete && auctionType === 'draft' && (
        <button
          onClick={handlePass}
          className="w-full py-2 rounded-lg text-sm bg-broker-surface-hover hover:bg-red-900/30 text-broker-text-muted hover:text-red-300 transition-colors"
        >
          Pass
        </button>
      )}

      {/* Sold */}
      {sold.length > 0 && (
        <div>
          <div className="text-xs text-broker-text-muted font-medium uppercase mb-1">Sold</div>
          <div className="space-y-1">
            {sold.map((c) => (
              <div key={c.sym} className="bg-broker-surface/50 rounded px-3 py-1.5 flex items-center justify-between text-sm opacity-70">
                <span>{c.sym} — <span className="text-green-400">{playerName(c.ownerId)}</span></span>
                <span className="text-broker-text-muted">{fmt(c.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isComplete && (
        <div className="bg-broker-surface rounded-lg p-4 text-center text-green-300 font-medium">
          {auctionType === 'draft' ? 'Draft' : 'Purchase'} complete
        </div>
      )}
    </div>
  )
}
