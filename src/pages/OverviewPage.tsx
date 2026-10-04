import { ContactLinks } from '../components/ContactLinks'
import { TechnologyTags } from '../components/TechnologyTags'
import { useProfileAge } from '../hooks/useProfileAge'
import { FiArrowRight } from 'react-icons/fi'
import { LuSparkles } from 'react-icons/lu'
import { professionalProjects } from '../data/content'
import { overviewProofs } from '../config/site'
import { SectionHeader } from '../components/SectionHeader'
import { ProfileFact } from '../components/ProfileFact'

type OverviewPageProps = {
  onNavigate: (path: string) => void
}

export function OverviewPage({ onNavigate }: OverviewPageProps) {
  const { currentAge } = useProfileAge()

  return (
    <>
      <section className="hero-layout">
        <article className="glass-panel hero-panel">
          <span className="eyebrow-pill">
            <LuSparkles size={14} /> Elève ingénieur · logiciel, data & IA
          </span>
          <h1>Ingénierie logiciel orientée produit, qualité et robustesse.</h1>
          <p className="hero-copy">
            Elève ingénieur en informatique et réseaux à CPE Lyon, je développe aujourd'hui des outils de
            diagnostic chez Renault Trucks. Mon approche met l'accent sur la maintenabilité du code, la
            fiabilité des applications, l'expérience utilisateur et l'industrialisation logiciel.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => onNavigate('/work')} type="button">
              Voir la carrière <FiArrowRight size={16} />
            </button>
            <button className="secondary-button" onClick={() => onNavigate('/cv')} type="button">
              Consulter le CV
            </button>
          </div>
          <TechnologyTags items={['C#', '.NET', 'Blazor', 'Vue.js', 'Azure DevOps', 'Docker']} />
        </article>

        <aside className="hero-rail">
          <article className="glass-panel side-panel proof-card">
            <span className="section-kicker">Profil</span>
            <h2>
              {currentAge !== null ? (
                <>
                  Quentin Bouchot <span className="inline-muted">· {currentAge} ans</span>
                </>
              ) : (
                'Quentin Bouchot'
              )}
            </h2>
            <p>
              Elève ingénieur en informatique et réseaux à CPE Lyon, spécialisé en développement logiciel,
              data et IA.
            </p>
            <div className="story-list">
              <ProfileFact label="Rôle actuel" value="Software Engineer Apprentice chez Renault Trucks" />
              <ProfileFact label="Positionnement" value="Produit, qualité logiciel, robustesse" />
              <ProfileFact label="Localisation" value="Lyon, France" />
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
            {professionalProjects.map((project) => (
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
        <ContactLinks />
      </section>
    </>
  )
}
