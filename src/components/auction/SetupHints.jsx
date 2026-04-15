import { useState } from 'react'

export default function SetupHints({ game, dispatch }) {
  const hints = game.setupHints || []
  if (hints.length === 0) return null

  return (
    <div className="space-y-2">
      {hints.map((hint, i) => (
        <SetupHint key={i} hint={hint} game={game} dispatch={dispatch} />
      ))}
    </div>
  )
}

function SetupHint({ hint, game, dispatch }) {
  switch (hint.type) {
    case 'remove_corps':
      return <RemoveCorpsHint hint={hint} game={game} dispatch={dispatch} />
    case 'corp_order':
      return <CorpOrderHint hint={hint} game={game} dispatch={dispatch} />
    case 'random_president':
      return <RandomPresidentHint hint={hint} game={game} dispatch={dispatch} />
    default:
      return (
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg px-3 py-2 text-sm text-amber-200">
          {hint.message}
        </div>
      )
  }
}

function RemoveCorpsHint({ hint, game, dispatch }) {
  const [removed, setRemoved] = useState([])
  const corps = game.corporations

  function handleRandom() {
    const count = parseInt(hint.message.match(/\d+/)?.[0]) || 1
    const available = corps.filter((c) => !removed.includes(c.sym)).map((c) => c.sym)
    const shuffled = [...available].sort(() => Math.random() - 0.5)
    const toRemove = shuffled.slice(0, count)
    for (const sym of toRemove) {
      dispatch({ type: 'REMOVE_CORPORATION', corpSym: sym })
    }
    setRemoved([...removed, ...toRemove])
  }

  function handlePick(sym) {
    dispatch({ type: 'REMOVE_CORPORATION', corpSym: sym })
    setRemoved([...removed, sym])
  }

  if (removed.length > 0) {
    return (
      <div className="bg-green-900/30 border border-green-700/50 rounded-lg px-3 py-2 text-sm text-green-300">
        Removed: {removed.join(', ')}
      </div>
    )
  }

  return (
    <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg px-3 py-2">
      <div className="text-sm text-amber-200 mb-2">{hint.message}</div>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleRandom}
          className="text-xs bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded font-medium"
        >
          Random
        </button>
        <span className="text-xs text-amber-400 py-1.5">or pick:</span>
        {corps.map((c) => (
          <button
            key={c.sym}
            onClick={() => handlePick(c.sym)}
            className="text-xs px-2 py-1.5 rounded font-medium"
            style={{ backgroundColor: c.color, color: c.textColor || '#fff' }}
          >
            {c.sym}
          </button>
        ))}
      </div>
    </div>
  )
}

function CorpOrderHint({ hint, game, dispatch }) {
  const [order, setOrder] = useState(null)
  const [editing, setEditing] = useState(false)

  function handleShuffle() {
    const syms = game.corporations.map((c) => c.sym)
    const shuffled = [...syms].sort(() => Math.random() - 0.5)
    dispatch({ type: 'SET_CORP_ORDER', order: shuffled })
    setOrder(shuffled)
    setEditing(false)
  }

  function moveItem(idx, direction) {
    if (!order) return
    const newIdx = idx + direction
    if (newIdx < 0 || newIdx >= order.length) return
    const newOrder = [...order]
    ;[newOrder[idx], newOrder[newIdx]] = [newOrder[newIdx], newOrder[idx]]
    dispatch({ type: 'SET_CORP_ORDER', order: newOrder })
    setOrder(newOrder)
  }

  function handleSetManual() {
    const syms = game.corporations.map((c) => c.sym)
    setOrder(syms)
    dispatch({ type: 'SET_CORP_ORDER', order: syms })
    setEditing(true)
  }

  if (order) {
    return (
      <div className="bg-green-900/30 border border-green-700/50 rounded-lg px-3 py-2">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm text-green-300">Corporation order:</div>
          <div className="flex gap-1">
            <button
              onClick={handleShuffle}
              className="text-xs text-green-400 hover:text-white px-1.5"
            >
              Reshuffle
            </button>
            <button
              onClick={() => setEditing(!editing)}
              className="text-xs text-green-400 hover:text-white px-1.5"
            >
              {editing ? 'Done' : 'Reorder'}
            </button>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {order.map((sym, i) => {
            const c = game.corporations.find((co) => co.sym === sym)
            return (
              <div key={sym} className="flex items-center gap-0.5">
                {editing && (
                  <button
                    onClick={() => moveItem(i, -1)}
                    disabled={i === 0}
                    className="text-xs text-green-400 disabled:opacity-20 px-0.5"
                  >
                    ←
                  </button>
                )}
                <div
                  className="text-xs px-2 py-1 rounded font-medium"
                  style={{ backgroundColor: c?.color, color: c?.textColor || '#fff' }}
                >
                  {i + 1}. {sym}
                </div>
                {editing && (
                  <button
                    onClick={() => moveItem(i, 1)}
                    disabled={i === order.length - 1}
                    className="text-xs text-green-400 disabled:opacity-20 px-0.5"
                  >
                    →
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg px-3 py-2">
      <div className="text-sm text-amber-200 mb-2">{hint.message}</div>
      <div className="flex gap-2">
        <button
          onClick={handleShuffle}
          className="text-xs bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded font-medium"
        >
          Shuffle
        </button>
        <button
          onClick={handleSetManual}
          className="text-xs bg-broker-surface-hover hover:bg-broker-surface text-broker-text-muted hover:text-white px-3 py-1.5 rounded font-medium"
        >
          Set Manually
        </button>
      </div>
    </div>
  )
}

function RandomPresidentHint({ hint, game, dispatch }) {
  const [result, setResult] = useState(null)
  const corps = game.corporations.filter((c) => c.type !== 'national' && c.type !== 'minor')

  function handleRandom() {
    const pick = corps[Math.floor(Math.random() * corps.length)]
    setResult(pick)
  }

  function handlePick(corp) {
    setResult(corp)
  }

  if (result) {
    return (
      <div className="bg-green-900/30 border border-green-700/50 rounded-lg px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-green-300">
            {hint.message}: <span className="font-bold" style={{ color: result.color }}>{result.sym}</span> — {result.name}
          </div>
          <button
            onClick={() => setResult(null)}
            className="text-xs text-green-400 hover:text-white px-1.5"
          >
            Change
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg px-3 py-2">
      <div className="text-sm text-amber-200 mb-2">{hint.message}</div>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleRandom}
          className="text-xs bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded font-medium"
        >
          Random
        </button>
        <span className="text-xs text-amber-400 py-1.5">or pick:</span>
        {corps.map((c) => (
          <button
            key={c.sym}
            onClick={() => handlePick(c)}
            className="text-xs px-2 py-1.5 rounded font-medium"
            style={{ backgroundColor: c.color, color: c.textColor || '#fff' }}
          >
            {c.sym}
          </button>
        ))}
      </div>
    </div>
  )
}
