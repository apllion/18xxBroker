import { useState, useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore.js'
import { useUIStore } from '../../store/uiStore.js'
import { useDispatch } from '../../hooks/useDispatch.js'
import { currentPhase } from '../../engine/phase.js'
import { roundLabel, isLastRound } from '../../engine/roundTracker.js'
import { getEventInfo } from '../../engine/events.js'
import { corpPrice } from '../../engine/stockMarket.js'
import { formatCurrency } from '../../utils/currency.js'

export default function Header() {
  const game = useGameStore((s) => s.game)
  const dispatch = useDispatch()
  const undo = useGameStore((s) => s.undo)
  const canUndo = useGameStore((s) => s.canUndo)
  const toggleLog = useUIStore((s) => s.toggleLog)

  // Turn tracking
  const turnTracking = useUIStore((s) => s.turnTracking)
  const toggleTurnTracking = useUIStore((s) => s.toggleTurnTracking)

  // Confirm-to-advance state
  const [confirmPending, setConfirmPending] = useState(false)
  const confirmTimer = useRef(null)

  // Prominent undo banner
  const [showUndoBanner, setShowUndoBanner] = useState(false)
  const undoTimer = useRef(null)

  if (!game) return null

  const phase = currentPhase(game.phaseManager)
  const fmt = (n) => formatCurrency(n, game.title.currencyFormat)
  const rt = game.roundTracker
  const label = rt ? roundLabel(rt) : '—'
  const suggestion = rt?.suggestion
  const guidance = rt?.roundGuidance
  const lastRound = rt ? isLastRound(rt) : false
  const inPregame = rt?.inPregame
  const lastAction = game.actionLog?.[game.actionLog.length - 1]?.action

  function handleAdvanceClick() {
    if (inPregame) {
      // No confirm needed during pregame — AuctionGuide has its own button
      doAdvance()
      return
    }
    if (confirmPending) {
      // Second tap — execute
      clearTimeout(confirmTimer.current)
      setConfirmPending(false)
      doAdvance()
    } else {
      // First tap — show confirm
      setConfirmPending(true)
      confirmTimer.current = setTimeout(() => setConfirmPending(false), 2000)
    }
  }

  function doAdvance() {
    dispatch({ type: 'ADVANCE_ROUND' })

    // Rebuild turn queue for the new round
    if (turnTracking === 'on') {
      setTimeout(() => {
        const queue = buildTurnQueue()
        if (queue.length > 0) dispatch({ type: 'SET_TURN_QUEUE', queue })
      }, 0)
    }

    // Show prominent undo banner
    setShowUndoBanner(true)
    clearTimeout(undoTimer.current)
    undoTimer.current = setTimeout(() => setShowUndoBanner(false), 5000)
  }

  function buildTurnQueue() {
    if (!game || !game.roundTracker) return []
    // After advance, check what the NEW round type will be
    // Since we just dispatched, the store is updated — but we may need to read fresh
    const tracker = game.roundTracker
    if (tracker.type === 'stock') {
      // Start from priority deal holder
      const ids = game.players.map((p) => p.id)
      const prioIdx = ids.indexOf(game.priorityDeal)
      if (prioIdx > 0) {
        return [...ids.slice(prioIdx), ...ids.slice(0, prioIdx)]
      }
      return ids
    } else if (tracker.type === 'operating') {
      return game.corporations
        .filter((c) => c.floated)
        .map((c) => ({ sym: c.sym, price: corpPrice(game.stockMarket, c.sym) || 0 }))
        .sort((a, b) => b.price - a.price)
        .map((c) => c.sym)
    }
    return []
  }

  function handleUndo() {
    undo()
    setShowUndoBanner(false)
    setConfirmPending(false)
  }

  // Clean up timers
  useEffect(() => {
    return () => {
      clearTimeout(confirmTimer.current)
      clearTimeout(undoTimer.current)
    }
  }, [])

  return (
    <>
      <header className="sticky top-0 z-10 bg-broker-surface border-b border-broker-border px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{game.title.title}</span>
            <span className="text-xs bg-broker-surface-hover px-2 py-0.5 rounded">Phase {phase.name}</span>
            <button
              onClick={handleAdvanceClick}
              className={`text-sm font-medium px-2 py-0.5 rounded transition-all ${
                confirmPending
                  ? 'bg-red-700 text-white animate-pulse'
                  : rt?.type === 'stock'
                    ? 'bg-broker-green text-broker-gold hover:bg-broker-green-light'
                    : 'bg-amber-900 text-amber-200 hover:bg-amber-800'
              } ${lastRound ? 'ring-1 ring-red-500' : ''}`}
            >
              {confirmPending ? 'Tap to confirm' : `${label} →`}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs ${game.bank.broken ? 'text-red-400 font-bold' : 'text-broker-text-muted'}`}>
              Bank: {fmt(game.bank.cash)}
            </span>

            {/* Guided / Manual toggle */}
            {!inPregame && (
              <button
                onClick={toggleTurnTracking}
                className={`text-xs px-2.5 py-0.5 rounded transition-colors ${
                  turnTracking === 'on'
                    ? 'bg-blue-800 text-blue-200'
                    : 'bg-amber-800 text-amber-200'
                }`}
              >
                {turnTracking === 'on' ? 'Guided' : 'Manual'}
              </button>
            )}

            <button onClick={toggleLog} className="text-broker-text-muted hover:text-broker-gold text-xs">
              Log
            </button>
            <button
              onClick={handleUndo}
              disabled={!canUndo()}
              className="bg-broker-surface-hover hover:bg-broker-surface-hover disabled:opacity-30 disabled:cursor-not-allowed text-white px-2 py-1 rounded text-xs font-medium"
            >
              Undo
            </button>
          </div>
        </div>
      </header>

      {/* Prominent undo banner after advancing */}
      {showUndoBanner && !inPregame && (
        <div className="bg-amber-900/80 border-b border-amber-700 px-3 py-2 flex items-center justify-between">
          <span className="text-sm text-amber-200">Advanced to {label}</span>
          <div className="flex gap-2">
            <button
              onClick={handleUndo}
              className="bg-amber-700 hover:bg-amber-600 text-white px-3 py-1 rounded text-xs font-medium"
            >
              Undo
            </button>
            <button
              onClick={() => setShowUndoBanner(false)}
              className="text-amber-400 hover:text-amber-200 text-xs px-2"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Pending game events */}
      {game.pendingEvents?.length > 0 && (
        <EventBanner events={game.pendingEvents} dispatch={dispatch} />
      )}

      {/* Suggestion banner (collect privates, sold-out) */}
      {suggestion && !showUndoBanner && (
        <SuggestionBanner suggestion={suggestion} dispatch={dispatch} game={game} />
      )}
    </>
  )
}

function EventBanner({ events, dispatch }) {
  return (
    <div className="space-y-0">
      {events.map((eventName) => {
        const info = getEventInfo(eventName)
        return (
          <div key={eventName} className="bg-red-900/40 border-b border-red-700/50 px-3 py-2 flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-medium text-red-200">{info.label}</div>
              <div className="text-xs text-red-300/70 mt-0.5">{info.desc}</div>
            </div>
            <button
              onClick={() => dispatch({ type: 'DISMISS_EVENT', event: eventName })}
              className="flex-shrink-0 text-xs bg-red-800 hover:bg-red-700 text-white px-2 py-1 rounded"
            >
              OK
            </button>
          </div>
        )
      })}
    </div>
  )
}

function SuggestionBanner({ suggestion, dispatch, game }) {
  const orderRule = game.title.nextSRPlayerOrder
  const needsReorder = suggestion.action === 'sold_out' &&
    (orderRule === 'most_cash' || orderRule === 'least_cash')

  function handleCollectPrivates() {
    dispatch({ type: 'COLLECT_ALL_REVENUE' })
  }

  function handleSoldOut() {
    dispatch({ type: 'SOLD_OUT_ADJUST' })
  }

  function handleReorderByCash() {
    dispatch({ type: 'REORDER_BY_CASH', direction: orderRule === 'least_cash' ? 'asc' : 'desc' })
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
            Sold-out
          </button>
        )}
        {needsReorder && (
          <button
            onClick={handleReorderByCash}
            className="bg-blue-900 hover:bg-blue-800 text-blue-200 px-3 py-1 rounded text-xs"
          >
            Reorder ({orderRule === 'least_cash' ? 'least' : 'most'} cash)
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
