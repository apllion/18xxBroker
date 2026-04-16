import { useGameStore } from '../../store/gameStore.js'
import { useUIStore } from '../../store/uiStore.js'
import { useDispatch } from '../../hooks/useDispatch.js'
import { corpPrice } from '../../engine/stockMarket.js'

const OR_STEPS = [
  { id: 'track', label: 'Track' },
  { id: 'token', label: 'Token' },
  { id: 'routes', label: 'Routes' },
  { id: 'dividend', label: 'Dividend' },
  { id: 'train', label: 'Trains' },
]

export default function TurnStatus() {
  const game = useGameStore((s) => s.game)
  const dispatch = useDispatch()
  const turnTracking = useUIStore((s) => s.turnTracking)

  if (!game || turnTracking !== 'on') return null
  const rt = game.roundTracker
  if (!rt || rt.inPregame) return null

  const turnQueue = game.turnQueue || []
  const turnIndex = game.turnIndex || 0
  const srPassed = game.srPassed || []
  const orStep = game.orStep || 0

  if (turnQueue.length === 0) return null

  const current = turnQueue[turnIndex]
  const isSR = rt.type === 'stock'
  const isOR = rt.type === 'operating'

  if (isSR) {
    const player = game.players.find((p) => p.id === current)
    if (!player) return null

    return (
      <div className="bg-broker-green/10 border-b border-broker-border px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-white">{player.name}</span>
          <span className="text-broker-text-muted">·</span>
          {game.players.map((p) => {
            const passed = srPassed.includes(p.id)
            const isCur = p.id === current
            return (
              <span key={p.id} className={`${
                isCur ? 'text-white font-bold' : passed ? 'text-broker-text-muted line-through opacity-40' : 'text-broker-text-muted'
              }`}>
                {p.name}
              </span>
            )
          })}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => dispatch({ type: 'SR_PASS', playerId: current })}
            className="text-xs px-1.5 py-0.5 rounded bg-broker-surface hover:bg-red-900/40 text-broker-text-muted hover:text-red-300"
          >
            Pass
          </button>
          <button
            onClick={() => dispatch({ type: 'SR_ACTED' })}
            className="text-xs px-1.5 py-0.5 rounded bg-broker-surface hover:bg-broker-surface-hover text-white"
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  if (isOR) {
    const corp = game.corporations.find((c) => c.sym === current)
    if (!corp) return null
    const pres = game.players.find((p) =>
      p.shares.some((s) => s.corpSym === current && s.isPresident)
    )

    return (
      <div className="bg-amber-900/10 border-b border-broker-border px-3 py-1.5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-white" style={{ color: corp.color }}>{corp.sym}</span>
            {pres && <span className="text-broker-text-muted">{pres.name}</span>}
            <span className="text-broker-text-muted">·</span>
            <span className="text-broker-text-muted">{turnIndex + 1}/{turnQueue.length}</span>
          </div>
          <button
            onClick={() => dispatch({ type: 'OR_NEXT_CORP' })}
            className="text-xs px-1.5 py-0.5 rounded bg-broker-surface hover:bg-broker-surface-hover text-white"
          >
            Next Corp
          </button>
        </div>
        <div className="flex gap-0.5">
          {OR_STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => dispatch({ type: 'SET_OR_STEP', step: i })}
              className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
                i === orStep
                  ? 'bg-amber-700 text-white font-medium'
                  : i < orStep
                    ? 'bg-broker-surface/30 text-broker-text-muted opacity-40'
                    : 'bg-broker-surface text-broker-text-muted hover:text-white'
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return null
}
