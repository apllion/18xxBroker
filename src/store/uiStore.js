// UI store — tab selection, active player, transient UI state.
// Only truly local view state lives here. Turn tracking is in gameStore (syncs with peers).

import { create } from 'zustand'

export const useUIStore = create((set) => ({
  activeTab: 'market',     // 'market' | 'corps' | 'privates' | 'summary'
  activePlayerId: null,     // which player is "current" (soft, for filtering actions)
  activeCorpSym: null,      // which corp is selected in Corps tab
  showLog: false,
  turnTracking: 'on',       // 'on' | 'off' — local preference for guided/manual

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActivePlayer: (id) => set({ activePlayerId: id }),
  setActiveCorp: (sym) => set({ activeCorpSym: sym }),
  toggleLog: () => set((s) => ({ showLog: !s.showLog })),
  toggleTurnTracking: () => set((s) => ({
    turnTracking: s.turnTracking === 'on' ? 'off' : 'on',
  })),
}))
