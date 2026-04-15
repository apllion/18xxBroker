// Persistence — localStorage save/load, JSON export/import.
// Only persist what's needed to replay: titleId, player names, action log, createdAt.

const STORAGE_KEY = '18xxBroker_games'

export function saveGame(game) {
  try {
    const saved = loadAllGames()
    const key = `${game.title.titleId}_${game.createdAt}`
    saved[key] = {
      titleId: game.title.titleId,
      title: { titleId: game.title.titleId, title: game.title.title, activeVariant: game.title.activeVariant },
      userVariant: game.title.activeVariant?.id || null,
      playerNames: game.originalPlayerNames || game.players.map((p) => p.name),
      players: game.players.map((p) => ({ name: p.name })),
      actionLog: game.actionLog,
      createdAt: game.createdAt,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    return key
  } catch (e) {
    console.error('Failed to save game:', e)
    return null
  }
}

export function loadGame(key) {
  try {
    const saved = loadAllGames()
    return saved[key] || null
  } catch (e) {
    console.error('Failed to load game:', e)
    return null
  }
}

export function loadAllGames() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    return {}
  }
}

export function deleteGame(key) {
  try {
    const saved = loadAllGames()
    delete saved[key]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  } catch (e) {
    console.error('Failed to delete game:', e)
  }
}

export function exportGame(game) {
  return JSON.stringify({
    titleId: game.title.titleId,
    playerNames: game.originalPlayerNames || game.players.map((p) => p.name),
    actionLog: game.actionLog,
    createdAt: game.createdAt,
  }, null, 2)
}

export function importGame(jsonStr) {
  return JSON.parse(jsonStr)
}
