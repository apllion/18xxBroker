// Game store — Zustand + Immer.
// Action log is source of truth. Undo = rebuild state from log minus last action.

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createGame } from '../engine/setup.js'
import { applyAction } from '../engine/actions.js'
import { getTitle } from '../titles/index.js'
import { saveGame } from '../utils/persistence.js'

export const useGameStore = create(
  immer((set, get) => ({
    game: null,
    saveKey: null,

    // Start a new game (with optional variant)
    startGame: (titleId, playerNames, userVariant = null) => {
      const title = getTitle(titleId)
      const game = createGame(title, playerNames, userVariant)
      const saveKey = `${titleId}_${game.createdAt}`
      set({ game, saveKey })
      saveGame(game)
    },

    // Load an existing game by rebuilding from action log
    loadGame: (savedGame) => {
      const titleId = savedGame.titleId || savedGame.title?.titleId
      const title = getTitle(titleId)
      const playerNames = savedGame.playerNames || savedGame.players?.map((p) => p.name)
      const userVariant = savedGame.userVariant || savedGame.title?.activeVariant?.id || null
      const freshGame = createGame(title, playerNames, userVariant)
      freshGame.createdAt = savedGame.createdAt

      const actions = (savedGame.actionLog || []).map((entry) => entry.action)
      for (const action of actions) {
        applyAction(freshGame, action)
      }

      const saveKey = `${titleId}_${savedGame.createdAt}`
      set({ game: freshGame, saveKey })
    },

    dispatch: (action) => {
      set((state) => {
        if (!state.game) return
        applyAction(state.game, action)
      })
      const { game } = get()
      if (game) saveGame(game)
    },

    undo: () => {
      const { game } = get()
      if (!game || game.actionLog.length === 0) return

      const title = getTitle(game.title.titleId)
      const playerNames = game.originalPlayerNames || game.players.map((p) => p.name)
      const userVariant = game.title.activeVariant?.id || null
      const freshGame = createGame(title, playerNames, userVariant)
      freshGame.createdAt = game.createdAt

      const actions = game.actionLog.slice(0, -1).map((entry) => entry.action)
      for (const action of actions) {
        applyAction(freshGame, action)
      }

      set({ game: freshGame })
      saveGame(freshGame)
    },

    canUndo: () => {
      const { game } = get()
      return game && game.actionLog.length > 0
    },

    endGame: () => {
      set({ game: null, saveKey: null })
    },

    // Replay — rebuild game at a specific action index
    fullLog: null, // stored when entering replay mode

    enterReplay: () => {
      const { game } = get()
      if (!game) return
      set({ fullLog: game.actionLog.map((e) => e.action) })
    },

    exitReplay: () => {
      const { game, fullLog } = get()
      if (!game || !fullLog) { set({ fullLog: null }); return }
      // Rebuild to full state
      const title = getTitle(game.title.titleId)
      const playerNames = game.originalPlayerNames || game.players.map((p) => p.name)
      const userVariant = game.title.activeVariant?.id || null
      const freshGame = createGame(title, playerNames, userVariant)
      freshGame.createdAt = game.createdAt
      for (const action of fullLog) {
        applyAction(freshGame, action)
      }
      set({ game: freshGame, fullLog: null })
    },

    replayTo: (index) => {
      const { game, fullLog } = get()
      if (!game || !fullLog) return
      const title = getTitle(game.title.titleId)
      const playerNames = game.originalPlayerNames || game.players.map((p) => p.name)
      const userVariant = game.title.activeVariant?.id || null
      const freshGame = createGame(title, playerNames, userVariant)
      freshGame.createdAt = game.createdAt
      const actions = fullLog.slice(0, index + 1)
      for (const action of actions) {
        applyAction(freshGame, action)
      }
      set({ game: freshGame })
    },
  }))
)
