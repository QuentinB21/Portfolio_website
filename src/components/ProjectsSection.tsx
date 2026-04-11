import type { Project } from '../types'
import { FiExternalLink, FiGithub } from 'react-icons/fi'

type ProjectsSectionProps = {
  projects: Project[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section className="section" id="projets">
      <div className="section-header">
        <h3 className="section-title">Projets</h3>
        <span className="section-subtitle">Sélection de travaux</span>
      </div>
      <div className="projects-grid">
        {projects.map((project) => (
          <article className="project-card glass-panel proof-card" key={project.title}>
            <div className="project-top">
              <h4 className="project-title">{project.title}</h4>
              <span className="badge">{project.status}</span>
            </div>
            <p className="project-description">{project.description}</p>
            <div className="stack-row">
              {project.stack.map((tech) => (
                <span className="badge" key={tech}>
                  {tech}
                </span>
              ))}
            </div>
            <div className="link-row">
              <a href={project.link} target="_blank" rel="noreferrer">
                <FiExternalLink /> Voir le lien
              </a>
              <FiGithub />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
