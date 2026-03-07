import type { TimelineItem } from '../types'

type TimelineSectionProps = {
  experiences: TimelineItem[]
  educations: TimelineItem[]
}

export function TimelineSection({ experiences, educations }: TimelineSectionProps) {
  return (
    <section className="section" id="parcours">
      <div className="section-header">
        <h3 className="section-title">Parcours</h3>
        <span className="section-subtitle">Expériences & formation</span>
      </div>
      <div className="timeline">
        {experiences.map((exp) => (
          <div className="timeline-card" key={exp.title}>
            <h4 className="timeline-title">{exp.title}</h4>
            <p className="timeline-sub">{exp.place}</p>
            <p className="timeline-period">{exp.period}</p>
            <p className="project-description">{exp.detail}</p>
          </div>
        ))}
        {educations.map((edu) => (
          <div className="timeline-card" key={edu.title}>
            <h4 className="timeline-title">{edu.title}</h4>
            <p className="timeline-sub">{edu.place}</p>
            <p className="timeline-period">{edu.period}</p>
            <p className="project-description">{edu.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
