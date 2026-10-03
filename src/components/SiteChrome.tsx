import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'
import logoMark from '../assets/1_glass.png'
import { Link } from 'react-router-dom'
import { PrivacyControls } from './PrivacyControls'
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
  const navRef = useRef<HTMLElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const nav = navRef.current
    const indicator = indicatorRef.current
    const activeTab = nav?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!nav || !indicator) return
    if (!activeTab) {
      indicator.style.opacity = '0'
      return
    }

    const updateIndicator = () => {
      // Coordinates stay relative to the scrolling nav, including variable-width tabs.
      indicator.style.transform = `translate(${activeTab.offsetLeft}px, ${activeTab.offsetTop}px)`
      indicator.style.width = `${activeTab.offsetWidth}px`
      indicator.style.height = `${activeTab.offsetHeight}px`
      indicator.style.opacity = '1'
      nav.scrollTo({
        left: activeTab.offsetLeft - (nav.clientWidth - activeTab.offsetWidth) / 2,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      })
    }

    updateIndicator()
    // Position the initial bubble before enabling transitions between tabs.
    const frame = requestAnimationFrame(() => {
      nav.dataset.indicatorReady = 'true'
    })
    const observer = new ResizeObserver(updateIndicator)
    observer.observe(nav)
    nav.querySelectorAll('.nav-tab').forEach((tab) => observer.observe(tab))
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [currentPath])

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
          ref={navRef}
          className="topbar-nav"
          aria-label="Navigation principale"
        >
          <span ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-tab ${currentPath === item.path ? 'is-active' : ''}`}
              aria-current={currentPath === item.path ? 'page' : undefined}
              onClick={() => onNavigate(item.path)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main key={currentPath} className="page-content">{children}</main>
      <footer className="site-footer">
        <span>© 2026 Quentin Bouchot.</span>
        <nav className="footer-links" aria-label="Informations légales">
          <Link className="footer-link" to="/mentions-legales" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>Mentions légales</Link>
          <Link className="footer-link" to="/confidentialite" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>Confidentialité</Link>
          <PrivacyControls />
        </nav>
      </footer>
    </div>
  )
}
