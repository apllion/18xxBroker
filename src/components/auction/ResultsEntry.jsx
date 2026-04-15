import { useState } from 'react'

// Manual results entry — just record who bought what for how much.
// No turn tracking, no bidding logic. For when the auction happens at the table.

export default function ResultsEntry({ game, dispatch, fmt }) {
  const companies = game.companies
  const players = game.players
  const unsold = companies.filter((c) => !c.ownerId)
  const sold = companies.filter((c) => c.ownerId)

  function playerName(id) {
    return players.find((p) => p.id === id)?.name ?? id
  }

  return (
    <div className="space-y-2">
      {unsold.length > 0 && (
        <div className="text-xs text-broker-text-muted uppercase font-medium">Record results</div>
      )}

      {unsold.map((c) => (
        <ResultCard key={c.sym} company={c} players={players} dispatch={dispatch} fmt={fmt} />
      ))}

      {sold.length > 0 && (
        <div>
          <div className="text-xs text-broker-text-muted font-medium uppercase mb-1 mt-3">Sold</div>
          <div className="space-y-1">
            {sold.map((c) => (
              <div key={c.sym} className="bg-broker-surface/40 rounded px-3 py-1.5 flex items-center justify-between text-sm">
                <span className="text-broker-text-muted">
                  {c.sym} — <span className="text-green-400">{playerName(c.ownerId)}</span>
                </span>
                <span className="text-broker-text-muted">{fmt(c.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ResultCard({ company, players, dispatch, fmt }) {
  const [price, setPrice] = useState(String(company.value))

  function handleBuy(playerId) {
    const p = parseInt(price, 10)
    if (p == null || p < 0) return
    dispatch({ type: 'BUY_PRIVATE', playerId, companySym: company.sym, price: p })
  }

  return (
    <div className="bg-broker-surface rounded-lg p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-medium">
            {company.sym}
            <span className="text-broker-text-muted font-normal"> — {company.name}</span>
          </div>
          <div className="text-xs text-broker-text-muted mt-0.5">
            Face: {fmt(company.value)} · Rev: {fmt(company.revenue)}/OR
          </div>
          {company.desc && <div className="text-xs text-broker-text-muted mt-1">{company.desc}</div>}
        </div>
      </div>

      <div className="mt-2 flex gap-2 items-center flex-wrap">
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-20 bg-broker-bg border border-broker-border rounded px-2 py-1.5 text-sm text-white"
        />
        {players.map((p) => {
          const canAfford = p.cash >= (parseInt(price, 10) || 0)
          return (
            <button
              key={p.id}
              onClick={() => handleBuy(p.id)}
              disabled={!canAfford}
              className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                canAfford
                  ? 'bg-blue-800 hover:bg-blue-700 text-white'
                  : 'bg-broker-surface-hover text-broker-text-muted opacity-40 cursor-not-allowed'
              }`}
            >
              {p.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
