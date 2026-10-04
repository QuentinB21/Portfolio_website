import { PageIntro } from '../components/PageIntro'
import { ProjectCard } from '../components/ProjectCard'
import { TechnologyTags } from '../components/TechnologyTags'
import { FiArrowUpRight, FiGithub } from 'react-icons/fi'
import { ProjectPresentationPreview } from '../components/ProjectPresentationPreview'
import { SectionHeader } from '../components/SectionHeader'
import { personalProjects } from '../data/content'

export function ProjectsPage() {
  return (
    <>
      <PageIntro kicker="Projets personnels" title="Des idées, du code, des usages.">
        Des applications que je construis pour explorer, apprendre et répondre à des besoins concrets.
        Le code et les présentations sont accessibles pour aller plus loin.
      </PageIntro>

      <section className="stacked-section">
        <SectionHeader
          title="Ce que je construis."
        />
        <div className="project-stack">
          {personalProjects.map((project) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              action={
                project.available === false ? (
                  <button
                    className="secondary-button inline-action project-action-unavailable"
                    disabled
                    type="button"
                  >
                    {project.ctaLabel}
                  </button>
                ) : (
                  <a className="primary-button inline-action" href={project.href}>
                    {project.ctaLabel} <FiArrowUpRight size={15} />
                  </a>
                )
              }
            >
              <ProjectPresentationPreview
                projectTitle={project.title}
                fallbackDescription={project.description}
                presentationUrl={project.presentationUrl}
              />

              <TechnologyTags items={project.stack} status={project.status} />

              <div className="project-feature-footer">
                {project.note ? <p className="project-note">{project.note}</p> : <span />}
                {project.repoUrl ? (
                  <a className="project-repo-link" href={project.repoUrl} rel="noreferrer" target="_blank">
                    Accéder au repo <FiGithub size={15} />
                  </a>
                ) : null}
              </div>
            </ProjectCard>
          ))}
        </div>
      </section>
    </>
  )
}
