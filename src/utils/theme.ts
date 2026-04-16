import { THEME_STORAGE_KEY } from '../config/site'
import type { Theme } from '../types'

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'dark'
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function readThemePreference(): Theme | null {
  if (typeof window === 'undefined') return null

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

export function getInitialTheme(): Theme {
  return readThemePreference() ?? getSystemTheme()
}

export function storeThemePreference(theme: Theme) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}
