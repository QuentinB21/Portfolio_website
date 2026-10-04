import { FiArrowRight, FiBriefcase, FiMapPin, FiBookOpen } from 'react-icons/fi'
import { ContactLinks } from '../components/ContactLinks'
import { TechnologyTags } from '../components/TechnologyTags'
import { ProfileFact } from '../components/ProfileFact'
import { SectionHeader } from '../components/SectionHeader'
import { useProfileAge } from '../hooks/useProfileAge'
import { professionalProjects } from '../data/content'
import { overviewProofs } from '../config/site'

type OverviewPageProps = { onNavigate: (path: string) => void }

export function OverviewPage({ onNavigate }: OverviewPageProps) {
  const { currentAge } = useProfileAge()
  return (
    <>
      <section className="hero-layout">
        <div className="hero-panel">
          <span className="section-kicker hero-kicker">
            Quentin Bouchot · Élève ingénieur
          </span>
          <h1 className="hero-title">
            <span>Des logiciels</span>
            <span className="title-accent">pensés pour durer.</span>
          </h1>
          <p className="hero-copy">
            Élève ingénieur à CPE Lyon, je développe des outils de diagnostic
            chez Renault Trucks. J'aime concevoir des applications utiles,
            soigner leur expérience et faire grandir un code fiable.
          </p>
          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => onNavigate('/work')}
              type="button"
            >
              Voir mon parcours <FiArrowRight size={18} />
            </button>
            <button
              className="secondary-button"
              onClick={() => onNavigate('/cv')}
              type="button"
            >
              Consulter le CV <FiArrowRight size={18} />
            </button>
          </div>
          <TechnologyTags
            items={['C#', '.NET', 'Blazor', 'Vue.js', 'Azure DevOps', 'Docker']}
          />
        </div>
        <aside className="hero-rail" aria-label="Mon profil en bref">
          <span className="section-kicker">En ce moment</span>
          <h2>
            Du logiciel.
            <br />
            Du concret.
          </h2>
          <div className="profile-detail">
            <FiBriefcase aria-hidden="true" />
            <ProfileFact
              label="Renault Trucks"
              value="Software Engineer Apprentice"
            />
          </div>
          <div className="profile-detail">
            <FiBookOpen aria-hidden="true" />
            <ProfileFact
              label="CPE Lyon · 2024–2027"
              value="Informatique, data & IA"
            />
          </div>
          <div className="profile-detail">
            <FiMapPin aria-hidden="true" />
            <ProfileFact
              label="Lyon, France"
              value={
                currentAge !== null
                  ? `${currentAge} ans · Toujours en apprentissage`
                  : 'Toujours en apprentissage'
              }
            />
          </div>
        </aside>
      </section>
      <section className="stacked-section principles-section">
        <h2 className="section-kicker">Ma façon de travailler</h2>
        <div className="proof-grid">
          {overviewProofs.map((proof, index) => (
            <article className="proof-card" key={proof.title}>
              <span className="principle-index" aria-hidden="true">
                0{index + 1}
              </span>
              <h3>{proof.title}</h3>
              <p>{proof.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="stacked-section">
        <span className="section-kicker">Sur le terrain</span>
        <SectionHeader title="Du terrain au logiciel." />
        <div className="feature-list">
          {professionalProjects.map((project, index) => (
            <article className="feature-item" key={project.title}>
              <div className="experience-label">
                <span className="section-kicker">
                  {index === 0 ? 'Renault Trucks' : 'Biosystèmes'}
                </span>
                <span>
                  {index === 0 ? '2024 — aujourd’hui' : '2023 — 2024'}
                </span>
              </div>
              <div className="experience-description">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <TechnologyTags items={project.stack} />
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="stacked-section contact-section">
        <span className="section-kicker">Restons en contact</span>
        <SectionHeader title="Un échange, une idée ?" />
        <ContactLinks />
      </section>
    </>
  )
}
