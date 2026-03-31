import { useGameStore } from '../../store/gameStore.js'
import { useUIStore } from '../../store/uiStore.js'
import { currentPhase } from '../../engine/phase.js'
import { roundLabel, isLastRound } from '../../engine/roundTracker.js'
import { formatCurrency } from '../../utils/currency.js'

export default function Header() {
  const game = useGameStore((s) => s.game)
  const dispatch = useGameStore((s) => s.dispatch)
  const undo = useGameStore((s) => s.undo)
  const canUndo = useGameStore((s) => s.canUndo)
  const toggleLog = useUIStore((s) => s.toggleLog)

  if (!game) return null

  const phase = currentPhase(game.phaseManager)
  const fmt = (n) => formatCurrency(n, game.title.currencyFormat)
  const rt = game.roundTracker
  const label = rt ? roundLabel(rt) : '—'
  const suggestion = rt?.suggestion
  const lastRound = rt ? isLastRound(rt) : false

  function handleAdvance() {
    dispatch({ type: 'ADVANCE_ROUND' })
  }

  return (
    <>
      <header className="sticky top-0 z-10 bg-broker-surface border-b border-broker-border px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{game.title.title}</span>
            <span className="text-xs bg-broker-surface-hover px-2 py-0.5 rounded">Phase {phase.name}</span>
            <button
              onClick={handleAdvance}
              className={`text-sm font-medium px-2 py-0.5 rounded transition-colors ${
                rt?.type === 'stock'
                  ? 'bg-broker-green text-broker-gold hover:bg-broker-green-light'
                  : 'bg-amber-900 text-amber-200 hover:bg-amber-800'
              } ${lastRound ? 'ring-1 ring-red-500' : ''}`}
            >
              {label} →
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs ${game.bank.broken ? 'text-red-400 font-bold' : 'text-broker-text-muted'}`}>
              Bank: {fmt(game.bank.cash)}
            </span>
            <button onClick={toggleLog} className="text-broker-text-muted hover:text-broker-gold text-xs">
              Log
            </button>
            <button
              onClick={undo}
              disabled={!canUndo()}
              className="bg-broker-surface-hover hover:bg-broker-surface-hover disabled:opacity-30 disabled:cursor-not-allowed text-white px-2 py-1 rounded text-xs font-medium"
            >
              ↩ Undo
            </button>
          </div>
        </div>
      </header>

      {/* Suggestion banner */}
      {suggestion && (
        <SuggestionBanner suggestion={suggestion} dispatch={dispatch} game={game} />
      )}
    </>
  )
}

function SuggestionBanner({ suggestion, dispatch, game }) {
  function handleCollectPrivates() {
    dispatch({ type: 'COLLECT_ALL_REVENUE' })
  }

  function handleSoldOut() {
    dispatch({ type: 'SOLD_OUT_ADJUST' })
  }

  function handleDismiss() {
    // Advance again to clear the suggestion
    dispatch({ type: 'ADVANCE_ROUND' })
  }

  return (
    <div className="bg-broker-surface border-b border-broker-border px-3 py-2 flex items-center justify-between text-sm">
      <span className="text-broker-text">{suggestion.message}</span>
      <div className="flex gap-2">
        {suggestion.action === 'collect_privates' && (
          <button
            onClick={handleCollectPrivates}
            className="bg-green-900 hover:bg-green-800 text-green-200 px-3 py-1 rounded text-xs"
          >
            Collect All
          </button>
        )}
        {suggestion.action === 'sold_out' && (
          <button
            onClick={handleSoldOut}
            className="bg-broker-green hover:bg-broker-green-light text-broker-gold px-3 py-1 rounded text-xs"
          >
            Sold-out ↑
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="text-broker-text-muted hover:text-broker-text text-xs px-2"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
