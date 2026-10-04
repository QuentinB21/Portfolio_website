import { skills } from '../data/content'
import { TechnologyTags } from './TechnologyTags'

export function SkillsList() {
  return (
    <div className="skill-column">
      {skills.map((group) => (
        <article className="skill-group" key={group.title}>
          <h3>{group.title}</h3>
          <TechnologyTags items={group.items} />
        </article>
      ))}
    </div>
  )
}
