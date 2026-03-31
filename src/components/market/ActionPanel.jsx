import { useState } from 'react'
import { useGameStore } from '../../store/gameStore.js'
import { useUIStore } from '../../store/uiStore.js'
import { parPrices, corpPrice } from '../../engine/stockMarket.js'
import { formatCurrency } from '../../utils/currency.js'

export default function ActionPanel() {
  const game = useGameStore((s) => s.game)
  const dispatch = useGameStore((s) => s.dispatch)
  const activePlayerId = useUIStore((s) => s.activePlayerId)

  if (!game || !activePlayerId) {
    return (
      <div className="text-center text-broker-text-muted text-sm py-4">
        Select a player above to see actions
      </div>
    )
  }

  const player = game.players.find((p) => p.id === activePlayerId)
  const fmt = (n) => formatCurrency(n, game.title.currencyFormat)

  return (
    <div className="space-y-4">
      <ParSection game={game} player={player} dispatch={dispatch} fmt={fmt} />
      <BuySection game={game} player={player} dispatch={dispatch} fmt={fmt} />
      <SellSection game={game} player={player} dispatch={dispatch} fmt={fmt} />
    </div>
  )
}

function ParSection({ game, player, dispatch, fmt }) {
  const [selectedCorp, setSelectedCorp] = useState(null)

  const unparredCorps = game.corporations.filter((c) => !c.ipoed)
  const pars = parPrices(game.stockMarket)

  if (unparredCorps.length === 0) return null

  function handlePar(corpSym, par) {
    dispatch({
      type: 'PAR_SHARE',
      playerId: player.id,
      corpSym,
      parPrice: par.price,
      row: par.row,
      col: par.col,
    })
    setSelectedCorp(null)
  }

  return (
    <div className="bg-broker-surface rounded-lg p-3">
      <div className="text-xs text-broker-text-muted mb-2 font-medium uppercase">Par</div>
      <div className="flex flex-wrap gap-2 mb-2">
        {unparredCorps.map((c) => (
          <button
            key={c.sym}
            onClick={() => setSelectedCorp(selectedCorp === c.sym ? null : c.sym)}
            className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
              selectedCorp === c.sym
                ? 'ring-2 ring-broker-gold'
                : ''
            }`}
            style={{ backgroundColor: c.color, color: c.textColor || '#fff' }}
          >
            {c.sym}
          </button>
        ))}
      </div>
      {selectedCorp && (
        <div className="flex flex-wrap gap-1">
          {pars.map((par) => {
            const cost = (par.price * (game.title.shares?.[0] ?? 20)) / 10
            const canAfford = player.cash >= cost
            return (
              <button
                key={par.price}
                onClick={() => canAfford && handlePar(selectedCorp, par)}
                disabled={!canAfford}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  canAfford
                    ? 'bg-blue-700 hover:bg-broker-green-light text-white'
                    : 'bg-broker-surface-hover text-broker-text-muted cursor-not-allowed'
                }`}
              >
                {fmt(par.price)}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function BuySection({ game, player, dispatch, fmt }) {
  const buyableCorps = game.corporations.filter((c) => c.ipoed)
  if (buyableCorps.length === 0) return null

  function handleBuy(corpSym, source) {
    dispatch({
      type: 'BUY_SHARE',
      playerId: player.id,
      corpSym,
      source,
      percent: 10,
    })
  }

  return (
    <div className="bg-broker-surface rounded-lg p-3">
      <div className="text-xs text-broker-text-muted mb-2 font-medium uppercase">Buy</div>
      <div className="space-y-1">
        {buyableCorps.map((corp) => {
          const price = corpPrice(game.stockMarket, corp.sym)
          if (!price) return null
          const hasIPO = corp.ipoShares > 0
          const hasMarket = corp.marketShares > 0
          const canAfford = player.cash >= price

          return (
            <div key={corp.sym} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: corp.color }}
              />
              <span className="text-sm font-medium w-12">{corp.sym}</span>
              {hasIPO && (
                <button
                  onClick={() => canAfford && handleBuy(corp.sym, 'ipo')}
                  disabled={!canAfford}
                  className={`text-xs px-2 py-1 rounded ${
                    canAfford
                      ? 'bg-green-800 hover:bg-green-700 text-green-200'
                      : 'bg-broker-surface-hover text-broker-text-muted cursor-not-allowed'
                  }`}
                >
                  IPO {fmt(corp.parPrice ?? price)}
                </button>
              )}
              {hasMarket && (
                <button
                  onClick={() => canAfford && handleBuy(corp.sym, 'market')}
                  disabled={!canAfford}
                  className={`text-xs px-2 py-1 rounded ${
                    canAfford
                      ? 'bg-green-800 hover:bg-green-700 text-green-200'
                      : 'bg-broker-surface-hover text-broker-text-muted cursor-not-allowed'
                  }`}
                >
                  Mkt {fmt(price)}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SellSection({ game, player, dispatch, fmt }) {
  const holdingsToSell = []
  for (const corp of game.corporations) {
    const pct = player.shares
      .filter((s) => s.corpSym === corp.sym)
      .reduce((sum, s) => sum + s.percent, 0)
    if (pct > 0) {
      const price = corpPrice(game.stockMarket, corp.sym)
      holdingsToSell.push({ corp, pct, price })
    }
  }

  if (holdingsToSell.length === 0) return null

  function handleSell(corpSym, percent = 10) {
    dispatch({
      type: 'SELL_SHARES',
      playerId: player.id,
      corpSym,
      percent,
    })
  }

  return (
    <div className="bg-broker-surface rounded-lg p-3">
      <div className="text-xs text-broker-text-muted mb-2 font-medium uppercase">Sell</div>
      <div className="space-y-1">
        {holdingsToSell.map(({ corp, pct, price }) => (
          <div key={corp.sym} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: corp.color }}
            />
            <span className="text-sm font-medium w-12">{corp.sym}</span>
            <span className="text-xs text-broker-text-muted">{pct}%</span>
            <button
              onClick={() => handleSell(corp.sym, 10)}
              className="text-xs px-2 py-1 rounded bg-red-900 hover:bg-red-800 text-red-200"
            >
              Sell 10% → +{fmt(price)}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
