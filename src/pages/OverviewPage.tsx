import { FiArrowRight } from 'react-icons/fi'
import { LuSparkles } from 'react-icons/lu'
import { contact, projects } from '../data/content'
import { overviewProofs } from '../config/site'
import { SectionHeader } from '../components/SectionHeader'
import { StoryItem } from '../components/StoryItem'

type OverviewPageProps = {
  currentAge: number | null
  onNavigate: (path: string) => void
}

export function OverviewPage({ currentAge, onNavigate }: OverviewPageProps) {
  return (
    <>
      <section className="hero-layout">
        <article className="glass-panel hero-panel">
          <span className="eyebrow-pill">
            <LuSparkles size={14} /> Elève ingénieur · logiciel, data & IA
          </span>
          <h1>Ingénierie logiciel orientée produit, qualité et robustesse.</h1>
          <p className="hero-copy">
            Elève ingénieur en informatique et réseaux à CPE Lyon, je développe aujourd'hui des outils de diagnostic
            chez Renault Trucks. Mon approche met l'accent sur la maintenabilité du code, la fiabilité des applications,
            l'expérience utilisateur et l'industrialisation logiciel.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => onNavigate('/work')} type="button">
              Voir la carrière <FiArrowRight size={16} />
            </button>
            <button className="secondary-button" onClick={() => onNavigate('/cv')} type="button">
              Consulter le CV
            </button>
          </div>
          <div className="pill-row">
            {['C#', '.NET', 'Blazor', 'Vue.js', 'Azure DevOps', 'Docker'].map((item) => (
              <span className="soft-pill" key={item}>
                {item}
              </span>
            ))}
          </div>
        </article>

        <aside className="hero-rail">
          <article className="glass-panel side-panel proof-card">
            <span className="section-kicker">Profil</span>
            <h2>{currentAge !== null ? <>Quentin Bouchot <span className="inline-muted">· {currentAge} ans</span></> : 'Quentin Bouchot'}</h2>
            <p>
              Elève ingénieur en informatique et réseaux à CPE Lyon, spécialisé en développement logiciel, data et IA.
            </p>
            <div className="story-list">
              <StoryItem label="Rôle actuel" value="Software Engineer Apprentice chez Renault Trucks" />
              <StoryItem label="Positionnement" value="Produit, qualité logiciel, robustesse" />
              <StoryItem label="Localisation" value="Lyon, France" />
            </div>
          </article>
        </aside>
      </section>

      <section className="stacked-section">
        <SectionHeader
          title="Trois axes qui structurent mon profil"
          subtitle="Une lecture rapide du positionnement avant d'entrer dans les expériences, les projets et les compétences."
        />
        <div className="proof-grid">
          {overviewProofs.map((proof) => (
            <article className="glass-panel proof-card" key={proof.title}>
              <h3>{proof.title}</h3>
              <p>{proof.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="stacked-section split-section">
        <div className="split-main glass-panel">
          <SectionHeader
            title="Aperçu des expériences"
            subtitle="L'accueil ne garde qu'un extrait. La page carrière détaille ensuite le parcours, la chronologie et les compétences."
          />
          <div className="feature-list">
            {projects.map((project) => (
              <article className="feature-item" key={project.title}>
                <div className="feature-meta">
                  <h3>{project.title}</h3>
                  <span className="accent-pill">{project.stack.slice(0, 3).join(' · ')}</span>
                </div>
                <p>{project.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="stacked-section">
        <SectionHeader
          title="Contact"
          subtitle="Des points d'entrée directs pour consulter mon profil, mes travaux et mes coordonnées."
        />
        <div className="contact-strip">
          {contact.map((item) => (
            <a
              className={`glass-panel contact-pill ${getContactToneClass(item.href)}`}
              href={item.href}
              key={item.label}
              rel="noreferrer"
              target="_blank"
            >
              <span className="contact-icon">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}

function getContactToneClass(href: string) {
  if (href.startsWith('mailto:')) {
    return 'contact-pill-mail'
  }

  if (href.includes('linkedin.com')) {
    return 'contact-pill-linkedin'
  }

  if (href.includes('github.com')) {
    return 'contact-pill-github'
  }

  return ''
}
