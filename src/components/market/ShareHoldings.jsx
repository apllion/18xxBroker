import { useGameStore } from '../../store/gameStore.js'
import { formatCurrency } from '../../utils/currency.js'
import { corpPrice } from '../../engine/stockMarket.js'

export default function ShareHoldings() {
  const game = useGameStore((s) => s.game)
  if (!game) return null

  const fmt = (n) => formatCurrency(n, game.title.currencyFormat)

  // Get all corps that are IPO'd
  const activeCorp = game.corporations.filter((c) => c.ipoed)

  if (activeCorp.length === 0) {
    return (
      <div className="text-broker-text-muted text-sm text-center py-2">
        No corporations have been started yet
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-broker-text-muted text-xs">
            <th className="text-left py-1 px-2">Corp</th>
            <th className="text-right py-1 px-1">Price</th>
            {game.players.map((p) => (
              <th key={p.id} className="text-center py-1 px-1">{p.name.slice(0, 4)}</th>
            ))}
            <th className="text-center py-1 px-1">IPO</th>
            <th className="text-center py-1 px-1">Mkt</th>
          </tr>
        </thead>
        <tbody>
          {activeCorp.map((corp) => {
            const price = corpPrice(game.stockMarket, corp.sym)
            return (
              <tr key={corp.sym} className="border-t border-gray-800">
                <td className="py-1 px-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-1 align-middle"
                    style={{ backgroundColor: corp.color }}
                  />
                  <span className="font-medium">{corp.sym}</span>
                </td>
                <td className="text-right py-1 px-1 text-broker-text">
                  {price ? fmt(price) : '—'}
                </td>
                {game.players.map((p) => {
                  const pct = p.shares
                    .filter((s) => s.corpSym === corp.sym)
                    .reduce((sum, s) => sum + s.percent, 0)
                  const isPres = p.shares.some((s) => s.corpSym === corp.sym && s.isPresident)
                  return (
                    <td key={p.id} className="text-center py-1 px-1">
                      {pct > 0 ? (
                        <span className={isPres ? 'font-bold text-yellow-400' : ''}>
                          {pct}%
                        </span>
                      ) : ''}
                    </td>
                  )
                })}
                <td className="text-center py-1 px-1 text-broker-text-muted">
                  {corp.ipoShares > 0 ? `${corp.ipoShares}%` : ''}
                </td>
                <td className="text-center py-1 px-1 text-broker-text-muted">
                  {corp.marketShares > 0 ? `${corp.marketShares}%` : ''}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
