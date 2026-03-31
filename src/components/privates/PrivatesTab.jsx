import { useState } from 'react'
import { useGameStore } from '../../store/gameStore.js'
import { formatCurrency } from '../../utils/currency.js'

export default function PrivatesTab() {
  const game = useGameStore((s) => s.game)
  const dispatch = useGameStore((s) => s.dispatch)

  if (!game) return null

  const fmt = (n) => formatCurrency(n, game.title.currencyFormat)

  function handleCollectAll() {
    dispatch({ type: 'COLLECT_ALL_REVENUE' })
  }

  const openCompanies = game.companies.filter((c) => !c.closed)
  const closedCompanies = game.companies.filter((c) => c.closed)

  return (
    <div className="p-3 space-y-4">
      {openCompanies.length > 0 && (
        <button
          onClick={handleCollectAll}
          className="w-full bg-green-800 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
        >
          Collect All Revenue
        </button>
      )}

      {/* Open companies */}
      <div className="space-y-2">
        {openCompanies.map((c) => (
          <PrivateCard key={c.sym} company={c} game={game} dispatch={dispatch} fmt={fmt} />
        ))}
      </div>

      {/* Closed companies */}
      {closedCompanies.length > 0 && (
        <div>
          <div className="text-xs text-broker-text-muted font-medium uppercase mb-2">Closed</div>
          {closedCompanies.map((c) => (
            <div key={c.sym} className="text-sm text-broker-gold-dim py-1">
              {c.sym} — {c.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PrivateCard({ company, game, dispatch, fmt }) {
  const [buyMode, setBuyMode] = useState(false)
  const [buyPrice, setBuyPrice] = useState(String(company.value))
  const [sellMode, setSellMode] = useState(false)
  const [sellPrice, setSellPrice] = useState(String(company.value))
  const [sellCorpSym, setSellCorpSym] = useState('')

  const ownerName = company.ownerId
    ? (company.ownerType === 'player'
      ? game.players.find((p) => p.id === company.ownerId)?.name
      : company.ownerId)
    : 'Unowned'

  function handleBuy(playerId) {
    const price = parseInt(buyPrice, 10)
    if (!price || price <= 0) return
    dispatch({ type: 'BUY_PRIVATE', playerId, companySym: company.sym, price })
    setBuyMode(false)
  }

  function handleSell() {
    const price = parseInt(sellPrice, 10)
    if (!price || !sellCorpSym || !company.ownerId) return
    dispatch({
      type: 'SELL_PRIVATE',
      companySym: company.sym,
      fromPlayerId: company.ownerId,
      toCorpSym: sellCorpSym,
      price,
    })
    setSellMode(false)
  }

  return (
    <div className="bg-broker-surface rounded-lg p-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium">{company.sym} — {company.name}</div>
          <div className="text-xs text-broker-text-muted mt-0.5">
            Value: {fmt(company.value)} · Revenue: {fmt(company.revenue)}/OR
          </div>
          <div className="text-xs text-broker-text-muted mt-1">{company.desc}</div>
        </div>
        <div className="text-sm text-broker-text flex-shrink-0 ml-3">{ownerName}</div>
      </div>

      <div className="flex gap-2 mt-2">
        {!company.ownerId && (
          <button
            onClick={() => setBuyMode(!buyMode)}
            className="text-xs bg-broker-surface-hover hover:bg-broker-surface-hover px-2 py-1 rounded"
          >
            Buy
          </button>
        )}
        {company.ownerId && company.ownerType === 'player' && (
          <button
            onClick={() => setSellMode(!sellMode)}
            className="text-xs bg-broker-surface-hover hover:bg-broker-surface-hover px-2 py-1 rounded"
          >
            Sell to Corp
          </button>
        )}
      </div>

      {buyMode && (
        <div className="mt-2 flex gap-2 items-center">
          <input
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            className="w-20 bg-broker-bg border border-broker-border rounded px-2 py-1 text-sm text-white"
          />
          {game.players.map((p) => (
            <button
              key={p.id}
              onClick={() => handleBuy(p.id)}
              className="text-xs bg-blue-800 hover:bg-blue-700 px-2 py-1 rounded text-white"
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {sellMode && (
        <div className="mt-2 flex gap-2 items-center flex-wrap">
          <input
            type="number"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            className="w-20 bg-broker-bg border border-broker-border rounded px-2 py-1 text-sm text-white"
          />
          <span className="text-xs text-broker-text-muted">to</span>
          {game.corporations.filter((c) => c.floated).map((c) => (
            <button
              key={c.sym}
              onClick={() => {
                setSellCorpSym(c.sym)
                handleSell()
              }}
              className="text-xs px-2 py-1 rounded font-medium"
              style={{ backgroundColor: c.color, color: c.textColor || '#fff' }}
            >
              {c.sym}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
