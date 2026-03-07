import { FiPlay } from 'react-icons/fi'
import { LuSparkles } from 'react-icons/lu'

type HeroProps = {
  onChatOpen: () => void
}

export function Hero({ onChatOpen }: HeroProps) {
  return (
    <section className="hero">
      <div className="glass-card hero-lead">
        <div className="availability">
          <LuSparkles size={16} /> Disponible pour missions
        </div>
        <h2>Quentin Bouchot</h2>
        <p>Ingénieur Logiciel Full-Stack en Alternance. Je conçois des architectures robustes et des interfaces intuitives.</p>
        <div className="cta-row">
          <button className="btn btn-primary" onClick={onChatOpen} type="button">
            <FiPlay size={16} /> Discuter avec mon IA
          </button>
          <a className="btn btn-ghost" href="#projets">
            Voir mes projets
          </a>
        </div>
        <div className="chip-row">
          <span className="chip">React</span>
          <span className="chip">Node</span>
          <span className="chip">TypeScript</span>
          <span className="chip">CI/CD</span>
          <span className="chip">IA générative</span>
        </div>
      </div>

      <div className="glass-card status-card">
        <div className="status-section">
          <h4>Ma Situation</h4>
          <div className="status-item">
            <span className="icon-circle">🎓</span>
            <div className="status-meta">
              <span>Formation</span>
              <strong>CPE Lyon</strong>
              <span>Promo 2027</span>
            </div>
          </div>
          <div className="status-item">
            <span className="icon-circle">💼</span>
            <div className="status-meta">
              <span>Entreprise</span>
              <strong>Renault Trucks</strong>
              <span>Apprenti Software Engineer</span>
            </div>
          </div>
          <div className="pill">En poste actuellement</div>
        </div>
        <div className="location">
          <span role="img" aria-label="Map">
            📍
          </span>
          Basé à Lyon, France
        </div>
      </div>
    </section>
  )
}
