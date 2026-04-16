import { useEffect, useState } from 'react'
import { buildAnalyticsContext, sendAnalyticsEvent } from '../utils/analytics'
import { getInitialTheme, readThemePreference, storeThemePreference } from '../utils/theme'
import type { Theme } from '../types'

type UseThemePreferenceParams = {
  path: string
}

export function useThemePreference({ path }: UseThemePreferenceParams) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light')
    document.documentElement.style.colorScheme = theme
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    if (readThemePreference()) {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
    const handleChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'light' : 'dark')
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      storeThemePreference(next)
      sendAnalyticsEvent('theme_toggled', {
        ...buildAnalyticsContext(path, next),
        theme: next,
      })
      return next
    })
  }

  return { theme, toggleTheme }
}
