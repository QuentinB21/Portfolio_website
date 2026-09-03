import { FiArrowUpRight, FiGithub } from 'react-icons/fi'
import { ProjectPresentationPreview } from '../components/ProjectPresentationPreview'
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
              Cette page regroupe les projets personnels que je souhaite partager. Chaque carte donne un point d’entrée
              rapide, puis permet d’ouvrir soit l’application, soit son dépôt si tu veux creuser davantage.
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
                </div>
                {project.available === false ? (
                  <button className="secondary-button inline-action project-action-unavailable" disabled type="button">
                    {project.ctaLabel}
                  </button>
                ) : (
                  <a className="primary-button inline-action" href={project.href}>
                    {project.ctaLabel} <FiArrowUpRight size={15} />
                  </a>
                )}
              </div>

              <ProjectPresentationPreview
                projectTitle={project.title}
                fallbackDescription={project.description}
                presentationUrl={project.presentationUrl}
              />

              <div className="pill-row">
                {project.stack.map((item) => (
                  <span className="soft-pill" key={item}>
                    {item}
                  </span>
                ))}
                <span className="accent-pill">{project.status}</span>
              </div>

              <div className="project-feature-footer">
                {project.note ? <p className="project-note">{project.note}</p> : <span />}
                {project.repoUrl ? (
                  <a className="project-repo-link" href={project.repoUrl} rel="noreferrer" target="_blank">
                    Accéder au repo <FiGithub size={15} />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
