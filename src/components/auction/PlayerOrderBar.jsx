import { useState } from 'react'
import { useGameStore } from '../../store/gameStore.js'

export default function PlayerOrderBar({ players, dispatch, fmt, activePlayerId }) {
  const [editing, setEditing] = useState(false)
  const game = useGameStore((s) => s.game)
  const priorityDeal = game?.priorityDeal

  function movePlayer(idx, direction) {
    const newIdx = idx + direction
    if (newIdx < 0 || newIdx >= players.length) return
    const order = players.map((p) => p.id)
    ;[order[idx], order[newIdx]] = [order[newIdx], order[idx]]
    dispatch({ type: 'SET_PLAYER_ORDER', order })
  }

  function shuffle() {
    const order = players.map((p) => p.id)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    dispatch({ type: 'SET_PLAYER_ORDER', order })
  }

  function setPriority(playerId) {
    dispatch({ type: 'SET_PRIORITY', playerId })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-broker-text-muted font-medium uppercase">Player Order</div>
        <div className="flex gap-1">
          {editing && (
            <button
              onClick={shuffle}
              className="text-xs text-broker-text-muted hover:text-amber-300 px-1.5"
            >
              Shuffle
            </button>
          )}
          <button
            onClick={() => setEditing(!editing)}
            className="text-xs text-broker-text-muted hover:text-white px-1.5"
          >
            {editing ? 'Done' : 'Reorder'}
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {players.map((p, i) => {
          const isPriority = p.id === priorityDeal
          return (
            <div
              key={p.id}
              className={`rounded-lg px-3 py-2 flex-shrink-0 text-center min-w-[80px] transition-all ${
                p.id === activePlayerId
                  ? 'bg-blue-900 ring-2 ring-blue-500'
                  : isPriority
                    ? 'bg-broker-surface ring-1 ring-amber-500'
                    : 'bg-broker-surface'
              }`}
            >
              <div className="text-xs text-broker-text-muted">
                <span className="text-broker-text-muted opacity-50 mr-1">{i + 1}.</span>
                {p.name}
                {isPriority && <span className="text-amber-400 ml-1">PD</span>}
              </div>
              <div className="text-sm font-medium">{fmt(p.cash)}</div>

              {editing && (
                <div className="flex justify-center gap-1 mt-1">
                  <button
                    onClick={() => movePlayer(i, -1)}
                    disabled={i === 0}
                    className="text-xs px-1.5 py-0.5 rounded bg-broker-surface-hover disabled:opacity-20 text-broker-text-muted hover:text-white"
                  >
                    ←
                  </button>
                  {!isPriority && (
                    <button
                      onClick={() => setPriority(p.id)}
                      className="text-xs px-1.5 py-0.5 rounded bg-amber-900/50 text-amber-300 hover:bg-amber-800"
                      title="Set priority deal"
                    >
                      PD
                    </button>
                  )}
                  <button
                    onClick={() => movePlayer(i, 1)}
                    disabled={i === players.length - 1}
                    className="text-xs px-1.5 py-0.5 rounded bg-broker-surface-hover disabled:opacity-20 text-broker-text-muted hover:text-white"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
