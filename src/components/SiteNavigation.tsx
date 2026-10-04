import { useLayoutEffect, useRef } from 'react'
import { navItems } from '../config/site'

type SiteNavigationProps = {
  currentPath: string
  onNavigate: (path: string) => void
}

export function SiteNavigation({ currentPath, onNavigate }: SiteNavigationProps) {
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
    <header className="site-navigation">
      <nav ref={navRef} className="navigation-tabs" aria-label="Navigation principale">
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
  )
}
