import type { Skill } from '../types'

type SkillsSectionProps = {
  skills: Skill[]
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section className="section" id="competences">
      <div className="section-header">
        <h3 className="section-title">Compétences</h3>
        <span className="section-subtitle">Techniques et transverses</span>
      </div>
      <div className="cards-grid">
        {skills.map((skill) => (
          <div className="skill-card" key={skill.title}>
            <h4>{skill.title}</h4>
            <div className="skill-badges">
              {skill.items.map((item) => (
                <span className="badge" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
