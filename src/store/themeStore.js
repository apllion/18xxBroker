// Theme store — manages active theme, persists to localStorage.
// Themes are just CSS class names applied to <html>.
// Each theme defines CSS custom properties via @theme in index.css.

import { create } from 'zustand'

const STORAGE_KEY = '18xxBroker_theme'

const savedTheme = (() => {
  try { return localStorage.getItem(STORAGE_KEY) || 'broker' } catch { return 'broker' }
})()

export const themes = {
  broker: { id: 'broker', label: 'Broker', desc: 'Dark green & gold' },
  dark:   { id: 'dark',   label: 'Dark',   desc: 'Classic dark mode' },
  light:  { id: 'light',  label: 'Light',  desc: 'Light mode' },
}

export const useThemeStore = create((set) => ({
  themeId: savedTheme,

  setTheme: (id) => {
    if (!themes[id]) return
    localStorage.setItem(STORAGE_KEY, id)
    document.documentElement.className = `theme-${id}`
    set({ themeId: id })
  },

  initTheme: () => {
    document.documentElement.className = `theme-${savedTheme}`
  },
}))
