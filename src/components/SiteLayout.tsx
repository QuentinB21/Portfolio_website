import { useRef, type ReactNode } from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'
import logoMark from '../assets/logo.png'
import { SiteNavigation } from './SiteNavigation'
import { SiteFooter } from './SiteFooter'
import type { Theme } from '../types'
import { useScrollReveal } from '../hooks/useScrollReveal'

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
  useScrollReveal(contentRef, currentPath)

  return (
    <div className="app-shell">
      <div className="ambient" aria-hidden="true" />
      <div className="page-shell">
        <div className="site-brand" aria-label="Identite du site">
          <button
            className="brand-button"
            onClick={() => onNavigate('/')}
            type="button"
            aria-label="Retour a l'accueil"
          >
            <img className="brand-logo" src={logoMark} alt="Logo Quentin Bouchot" />
            <span className="brand-text">Quentin Bouchot</span>
          </button>
        </div>

        <div className="site-utilities" aria-label="Actions rapides">
          {action}
          <button
            className="icon-button theme-toggle-button"
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
