import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { allTitles } from '../../titles/index.js'
import { useGameStore } from '../../store/gameStore.js'
import { useSyncContext } from '../../hooks/SyncContext.jsx'
import { loadAllGames, deleteGame, importGame } from '../../utils/persistence.js'
import { useThemeStore, themes } from '../../store/themeStore.js'

export default function GameSelector() {
  const navigate = useNavigate()
  const loadGame = useGameStore((s) => s.loadGame)
  const sync = useSyncContext()
  const titles = allTitles()
  const [savedGames, setSavedGames] = useState(() => loadAllGames())

  const savedList = Object.entries(savedGames)
    .map(([key, game]) => ({ key, game }))
    .sort((a, b) => (b.game.createdAt || 0) - (a.game.createdAt || 0))

  function handleLoad(key, game) {
    loadGame(game)
    navigate('/')
  }

  function handleDelete(key) {
    deleteGame(key)
    setSavedGames(loadAllGames())
  }

  const fileRef = useRef(null)
  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = importGame(reader.result)
        loadGame(data)
        navigate('/')
      } catch (err) {
        console.error('Failed to import game:', err)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const themeId = useThemeStore((s) => s.themeId)
  const setTheme = useThemeStore((s) => s.setTheme)

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      {/* Theme switcher */}
      <div className="self-end flex gap-1 mb-2">
        {Object.values(themes).map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              themeId === t.id
                ? 'bg-broker-gold text-broker-bg font-medium'
                : 'bg-broker-surface text-broker-text-muted hover:bg-broker-surface-hover'
            }`}
            title={t.desc}
          >
            {t.label}
          </button>
        ))}
      </div>

      <img src={import.meta.env.BASE_URL + 'logo.png'} alt="18xxBroker" className="w-48 mb-4 mt-2" />

      {/* Room join — join a peer's game */}
      <RoomJoin sync={sync} />

      <p className="text-broker-text-muted mb-8">Choose a game</p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {titles.map((t) => (
          <button
            key={t.titleId}
            onClick={() => { console.log('[GameSelector] selected:', t.titleId, t.title); navigate(`/setup/${t.titleId}`) }}
            className="bg-broker-surface hover:bg-broker-surface-hover border border-broker-border rounded-lg p-4 text-left transition-colors relative overflow-hidden"
          >
            {t.wip && (
              <svg className="absolute -bottom-2 -right-2 w-20 h-20 opacity-[0.07] text-broker-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            )}
            <div className="text-xl font-bold">{t.title}</div>
            <div className="text-sm text-broker-text-muted mt-1">{t.subtitle}</div>
            <div className="text-xs text-broker-text-muted mt-2">
              {t.minPlayers}–{t.maxPlayers} players
            </div>
          </button>
        ))}
      </div>

      {/* Load from file */}
      <div className="w-full max-w-md mt-6">
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full bg-broker-surface hover:bg-broker-surface-hover border border-dashed border-broker-border rounded-lg py-3 text-sm text-broker-text-muted hover:text-white transition-colors"
        >
          Load Game from File
        </button>
        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      </div>

      {savedList.length > 0 && (
        <div className="w-full max-w-md mt-6">
          <h2 className="text-lg font-medium mb-3 text-broker-text">Saved Games</h2>
          <div className="space-y-2">
            {savedList.map(({ key, game }) => {
              const date = game.createdAt
                ? new Date(game.createdAt).toLocaleDateString()
                : '—'
              const players = game.players?.map((p) => p.name).join(', ') || '—'
              const actions = game.actionLog?.length || 0

              return (
                <div
                  key={key}
                  className="bg-broker-surface border border-broker-border rounded-lg p-3 flex items-center justify-between"
                >
                  <button
                    onClick={() => handleLoad(key, game)}
                    className="flex-1 text-left hover:text-broker-gold transition-colors"
                  >
                    <div className="font-medium">
                      {game.title?.title || key}
                      <span className="text-broker-text-muted text-sm ml-2">{date}</span>
                    </div>
                    <div className="text-xs text-broker-text-muted">
                      {players} · {actions} actions
                    </div>
                  </button>
                  <button
                    onClick={() => handleDelete(key)}
                    className="text-broker-gold-dim hover:text-red-400 ml-3 px-2 py-1 text-sm"
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function RoomJoin({ sync }) {
  const [code, setCode] = useState('')
  const [showJoin, setShowJoin] = useState(false)

  if (!sync) return null

  if (sync.roomId) {
    return (
      <div className="w-full max-w-md mb-4 bg-broker-surface rounded-lg px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            sync.status === 'connected' ? 'bg-green-400' : 'bg-amber-400 animate-pulse'
          }`} />
          <span className="text-sm text-broker-text-muted">Room</span>
          <span className="font-mono font-bold text-white tracking-wider">{sync.roomId}</span>
          <span className="text-xs text-broker-text-muted">
            {sync.peerCount > 0 ? `${sync.peerCount + 1} devices` : 'waiting...'}
          </span>
        </div>
        <button onClick={sync.leaveRoom} className="text-xs text-broker-text-muted hover:text-red-300">
          Leave
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mb-4 flex gap-2 justify-center">
      {showJoin ? (
        <>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Room code"
            maxLength={6}
            className="w-28 bg-broker-surface border border-broker-border rounded px-3 py-2 text-sm text-white font-mono tracking-wider placeholder-broker-text-muted text-center"
            autoFocus
          />
          <button
            onClick={() => { if (code.trim().length >= 4) { sync.joinRoom(code); setShowJoin(false) } }}
            disabled={code.trim().length < 4}
            className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-40"
          >
            Join
          </button>
          <button
            onClick={() => setShowJoin(false)}
            className="text-broker-text-muted hover:text-white px-2 text-sm"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setShowJoin(true)}
          className="bg-broker-surface hover:bg-broker-surface-hover border border-broker-border rounded px-4 py-2 text-sm text-broker-text-muted hover:text-white"
        >
          Join Room
        </button>
      )}
    </div>
  )
}
