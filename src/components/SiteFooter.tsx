import { Link } from 'react-router-dom'
import { PrivacyControls } from './PrivacyControls'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>© 2026 Quentin Bouchot.</span>
      <nav className="footer-links" aria-label="Informations légales">
        <Link
          className="footer-link"
          to="/mentions-legales"
          onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
        >
          Mentions légales
        </Link>
        <Link
          className="footer-link"
          to="/confidentialite"
          onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
        >
          Confidentialité
        </Link>
        <PrivacyControls />
      </nav>
    </footer>
  )
}
