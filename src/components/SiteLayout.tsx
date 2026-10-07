import { useRef, type ReactNode } from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'
import logoMark from '../assets/logo.svg'
import { SiteNavigation } from './SiteNavigation'
import { SiteFooter } from './SiteFooter'
import type { Theme } from '../types'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useGlassLighting } from '../hooks/useGlassLighting'
import { useGlassRefraction } from '../hooks/useGlassRefraction'
import { useSwipeNavigation } from '../hooks/useSwipeNavigation'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'

type SiteLayoutProps = {
  currentPath: string
  onNavigate: (path: string) => void
  onToggleTheme: () => void
  theme: Theme
  children: ReactNode
  action?: ReactNode
}

export function SiteLayout({
  currentPath,
  onNavigate,
  onToggleTheme,
  theme,
  children,
  action,
}: SiteLayoutProps) {
  const contentRef = useRef<HTMLElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  useScrollReveal(contentRef, currentPath)
  useGlassLighting(shellRef, currentPath)
  useGlassRefraction(shellRef, currentPath)
  useSwipeNavigation(contentRef, currentPath, onNavigate)
  useKeyboardNavigation(currentPath, onNavigate)

  return (
    <div className="app-shell" ref={shellRef}>
      <div className="ambient" aria-hidden="true" />
      <div className="page-shell">
        <div className="site-brand" aria-label="Identité du site">
          <button
            className="brand-button"
            data-liquid-glass
            onClick={() => onNavigate('/')}
            type="button"
            aria-label="Retour à l'accueil"
          >
            <img className="brand-logo" src={logoMark} alt="Logo Quentin Bouchot" />
            <span className="brand-text">Quentin Bouchot</span>
          </button>
        </div>

        <div className="site-utilities" aria-label="Actions rapides">
          {action}
          <button
            className="icon-button theme-toggle-button"
            data-liquid-glass
            onClick={onToggleTheme}
            type="button"
            aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
            title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {theme === 'dark' ? <LuSun size={16} /> : <LuMoon size={16} />}
          </button>
        </div>

        <SiteNavigation currentPath={currentPath} onNavigate={onNavigate} />

        <main ref={contentRef} key={currentPath} className="page-content">
          {children}
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}
