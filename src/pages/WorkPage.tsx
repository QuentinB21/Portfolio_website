import { FiExternalLink } from 'react-icons/fi'
import { projects, skills } from '../data/content'
import { SectionHeader } from '../components/SectionHeader'
import { StoryItem } from '../components/StoryItem'
import { formatTimelinePeriod, getTimelineVariant } from '../utils/timeline'
import type { TimelineItem } from '../types'

type WorkPageProps = {
  timelineEntries: TimelineItem[]
}

export function WorkPage({ timelineEntries }: WorkPageProps) {
  return (
    <>
      <section className="stacked-section">
        <div className="glass-panel editorial-hero">
          <div>
            <span className="section-kicker">Travaux & parcours</span>
            <h1>Un parcours chronologique centré sur des expériences concretes.</h1>
            <p className="hero-copy">
              Cette page rassemble les expériences professionnelles, la formation et les compétences techniques qui
              structurent aujourd'hui mon profil d'ingénieur logiciel orienté produit et qualité.
            </p>
          </div>
          <div className="editorial-stats">
            <StoryItem label="Poste actuel" value="Software Engineer Apprentice" />
            <StoryItem label="Entreprise" value="Renault Trucks (Volvo Group)" />
            <StoryItem label="Expériences" value="Deux alternances en développement logiciel" />
          </div>
        </div>
      </section>

      <section className="stacked-section">
        <SectionHeader
          title="Expériences mises en avant"
          subtitle="Deux contextes concrets qui montrent à la fois le développement logiciel, l'ergonomie et les enjeux de qualité."
        />
        <div className="project-stack">
          {projects.map((project) => (
            <article className="glass-panel proof-card project-feature" key={project.title}>
              <div className="project-feature-head">
                <div>
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                </div>
                <a className="secondary-button inline-action" href={project.link} rel="noreferrer" target="_blank">
                  Voir le contexte <FiExternalLink size={15} />
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
            </article>
          ))}
        </div>
      </section>

      <section className="stacked-section split-section">
        <div className="split-main glass-panel">
          <SectionHeader
            title="Chronologie"
            subtitle="Une lecture simple du parcours, des experiences d'alternance jusqu'à la formation d'ingénieur."
          />
          <div className="timeline-list">
            {timelineEntries.map((item, index) => {
              const variant = getTimelineVariant(item)

              return (
                <article
                  className={`timeline-entry timeline-entry-${index % 2 === 0 ? 'left' : 'right'}`}
                  key={`${item.title}-${item.periodStart}`}
                >
                  <div className="timeline-card-shell">
                    <div className={`timeline-card glass-panel timeline-card-${variant.kind}`}>
                      <div className="timeline-card-top">
                        <span className="timeline-badge">{formatTimelinePeriod(item)}</span>
                        <span className={`timeline-kind timeline-kind-${variant.kind}`}>
                          {variant.icon}
                          {variant.label}
                        </span>
                      </div>
                      <div className="timeline-content">
                        <h3>{item.title}</h3>
                        <p className="timeline-place">{item.place}</p>
                        <p>{item.detail}</p>
                      </div>
                    </div>
                  </div>
                  <div className={`timeline-node timeline-node-${variant.kind}`} aria-hidden="true">
                    <span className="timeline-node-core" />
                  </div>
                  <div className="timeline-spacer" aria-hidden="true" />
                </article>
              )
            })}
          </div>
        </div>

        <aside className="split-rail glass-panel">
          <SectionHeader
            title="Compétences"
            subtitle="Les outils et domaines que j'utilise aujourd'hui le plus dans un contexte logiciel professionnel."
          />
          <div className="skill-column">
            {skills.map((group) => (
              <article className="skill-group" key={group.title}>
                <h3>{group.title}</h3>
                <div className="pill-row">
                  {group.items.map((item) => (
                    <span className="soft-pill" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </>
  )
}
