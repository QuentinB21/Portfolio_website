import type { ReactNode } from 'react'

type NavLink = {
  label: string
  href?: string
  onClick?: () => void
}

type NavBarProps = {
  brandLabel: string
  onBrandClick: () => void
  links?: NavLink[]
  actions?: ReactNode
}

export function NavBar({ brandLabel, onBrandClick, links = [], actions }: NavBarProps) {
  return (
    <header className="navbar">
      <div className="brand">
        <button className="brand-button" onClick={onBrandClick}>
          <span className="brand-mark">Q</span>
          <h1>{brandLabel}</h1>
        </button>
      </div>
      <nav className="nav-links">
        {links.map((link) =>
          link.onClick ? (
            <button className="nav-link" key={link.label} onClick={link.onClick} type="button">
              {link.label}
            </button>
          ) : (
            <a className="nav-link" key={link.label} href={link.href}>
              {link.label}
            </a>
          ),
        )}
      </nav>
      <div className="nav-actions">{actions}</div>
    </header>
  )
}
