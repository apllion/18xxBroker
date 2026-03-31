import { useGameStore } from '../../store/gameStore.js'
import { useUIStore } from '../../store/uiStore.js'
import { formatCurrency } from '../../utils/currency.js'
import { playerCertCount } from '../../engine/player.js'

export default function PlayerSelector() {
  const game = useGameStore((s) => s.game)
  const activePlayerId = useUIStore((s) => s.activePlayerId)
  const setActivePlayer = useUIStore((s) => s.setActivePlayer)

  if (!game) return null

  const fmt = (n) => formatCurrency(n, game.title.currencyFormat)

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {game.players.map((p) => {
        const isActive = activePlayerId === p.id
        const certs = playerCertCount(p)
        const overLimit = typeof game.certLimit === 'number' && certs > game.certLimit

        return (
          <button
            key={p.id}
            onClick={() => setActivePlayer(isActive ? null : p.id)}
            className={`flex-shrink-0 rounded-lg px-3 py-2 text-sm transition-colors border ${
              isActive
                ? 'bg-broker-green border-broker-gold text-white'
                : 'bg-broker-surface border-broker-border text-broker-text hover:border-broker-gold-dim'
            }`}
          >
            <div className="font-medium">{p.name}</div>
            <div className="text-xs opacity-70">
              {fmt(p.cash)}
              <span className={overLimit ? ' text-red-400' : ''}>
                {' '}· {certs}/{game.certLimit}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
