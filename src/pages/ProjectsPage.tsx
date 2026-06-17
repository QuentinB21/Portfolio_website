import { FiArrowUpRight } from 'react-icons/fi'
import { SectionHeader } from '../components/SectionHeader'
import { showcaseProjects } from '../data/content'

export function ProjectsPage() {
  return (
    <>
      <section className="stacked-section">
        <div className="glass-panel editorial-hero">
          <div>
            <span className="section-kicker">Projets</span>
            <h1>Mes projets personnels</h1>
            <p className="hero-copy">
              Cette page regroupe mes projets personnels que je souhaite partager avec vous. Chacun de ces projets sont experimental et sont en constante évolution. Je vous invite à les explorer et à me faire part de vos retours. 
            </p>
          </div>
        </div>
      </section>

      <section className="stacked-section">
        <SectionHeader
          title="Projets personnels"
          subtitle="Chaque carte peut ouvrir un projet autonome hébergé sur le même VPS, tout en gardant son propre dépôt, sa propre base de données et sa propre chaîne de déploiement."
        />
        <div className="project-stack">
          {showcaseProjects.map((project) => (
            <article className="glass-panel proof-card project-feature" key={project.title}>
              <div className="project-feature-head">
                <div>
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                </div>
                <a className="primary-button inline-action" href={project.href}>
                  {project.ctaLabel} <FiArrowUpRight size={15} />
                </a>
              </div>
              <div className="pill-row">
                {project.stack.map((item) => (
                  <span className="soft-pill" key={item}>
                    {item}
                  </span>
                ))}
                <span className="accent-pill">{project.status}</span>
              </div>
              {project.note ? <p className="project-note">{project.note}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
