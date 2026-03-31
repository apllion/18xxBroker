import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { allTitles } from '../../titles/index.js'
import { useGameStore } from '../../store/gameStore.js'
import { loadAllGames, deleteGame } from '../../utils/persistence.js'
import { useThemeStore, themes } from '../../store/themeStore.js'

export default function GameSelector() {
  const navigate = useNavigate()
  const loadGame = useGameStore((s) => s.loadGame)
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

      <img src="/logo.png" alt="18xxBroker" className="w-48 mb-4 mt-2" />
      <p className="text-broker-text-muted mb-8">Choose a game</p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {titles.map((t) => (
          <button
            key={t.titleId}
            onClick={() => navigate(`/setup/${t.titleId}`)}
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

      {savedList.length > 0 && (
        <div className="w-full max-w-md mt-8">
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
