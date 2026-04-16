import type { CSSProperties, ReactNode } from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'
import logoMark from '../assets/1_glass.png'
import { navItems } from '../config/site'
import type { Theme } from '../types'

type SiteChromeProps = {
  currentPath: string
  onNavigate: (path: string) => void
  onToggleTheme: () => void
  theme: Theme
  children: ReactNode
  action?: ReactNode
}

export function SiteChrome({
  currentPath,
  onNavigate,
  onToggleTheme,
  theme,
  children,
  action,
}: SiteChromeProps) {
  const activeNavIndex = Math.max(
    navItems.findIndex((item) => item.path === currentPath),
    0,
  )

  return (
    <div className="page-shell">
      <div className="chrome-brand" aria-label="Identite du site">
        <button className="brand-button" onClick={() => onNavigate('/')} type="button" aria-label="Retour a l'accueil">
          <img className="brand-logo" src={logoMark} alt="Logo Quentin Bouchot" />
          <span className="brand-text">Quentin.Dev</span>
        </button>
      </div>

      <div className="chrome-utilities" aria-label="Actions rapides">
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

      <header className="topbar glass-panel">
        <nav
          className="topbar-nav"
          aria-label="Navigation principale"
          style={
            {
              '--active-index': activeNavIndex,
              '--nav-count': navItems.length,
            } as CSSProperties
          }
        >
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-tab ${currentPath === item.path ? 'is-active' : ''}`}
              onClick={() => onNavigate(item.path)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="page-content">{children}</main>
      <footer className="site-footer">© 2026 Quentin Bouchot.</footer>
    </div>
  )
}
