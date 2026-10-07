import { FiArrowUpRight, FiMail, FiMapPin } from 'react-icons/fi'
import { cv } from '../data/cv'
import { formatTimelinePeriod } from '../utils/timeline'

export function CvPage() {
  return (
    <article className="resume" aria-labelledby="resume-name">
      <header className="resume-header">
        <div>
          <span className="section-kicker">Curriculum vitæ</span>
          <h1 id="resume-name">{cv.name}</h1>
          <p className="resume-title">{cv.title}</p>
          <p className="resume-subtitle">{cv.subtitle}</p>
        </div>
        <div className="resume-contact">
          <span className="resume-graduation">{cv.graduation}</span>
          <span><FiMapPin aria-hidden="true" /> {cv.location}</span>
          <a href={`mailto:${cv.email}`}><FiMail aria-hidden="true" /> {cv.email}</a>
          <div className="resume-links">
            {cv.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} <FiArrowUpRight aria-hidden="true" /></a>)}
          </div>
        </div>
      </header>
      <p className="resume-summary">{cv.summary}</p>
      <div className="resume-columns">
        <div className="resume-main">
          <section className="resume-section" aria-labelledby="resume-experiences">
            <h2 id="resume-experiences">Expériences professionnelles</h2>
            {cv.experiences.map(item => (
              <section className="resume-experience" key={`${item.place}-${item.periodStart}`}>
                <div className="resume-entry-heading"><h3>{item.place}</h3><span>{formatTimelinePeriod(item)}</span></div>
                <p className="resume-role">{item.title}</p>
                <ul>{item.highlights.map(text => <li key={text}>{text}</li>)}</ul>
                {item.stack && <p className="resume-stack">{item.stack.join(' · ')}</p>}
              </section>
            ))}
          </section>
          <section className="resume-section" aria-labelledby="resume-projects">
            <h2 id="resume-projects">Projets personnels</h2>
            {cv.projects.map(project => <section className="resume-project" key={project.name}>
              <h3>{project.name}</h3><p>{project.description}</p><p className="resume-stack">{project.stack}</p>
            </section>)}
          </section>
        </div>
        <aside className="resume-sidebar" aria-label="Formation et compétences">
          <section className="resume-section" aria-labelledby="resume-education">
            <h2 id="resume-education">Formation</h2>
            {cv.education.map(item => <section className="resume-education" key={item.title}>
              <span className="resume-date">{formatTimelinePeriod(item)}</span>
              <h3>{item.title}</h3><p>{item.place}</p><p className="resume-muted">{item.detail}</p>
            </section>)}
          </section>
          <section className="resume-section" aria-labelledby="resume-skills">
            <h2 id="resume-skills">Compétences</h2>
            {cv.skills.map(skill => <div className="resume-skill" key={skill.title}><h3>{skill.title}</h3><p>{skill.items.join(' · ')}</p></div>)}
          </section>
          <section className="resume-section" aria-labelledby="resume-languages">
            <h2 id="resume-languages">Langues</h2>
            <dl className="resume-languages">{cv.languages.map(language => <div key={language.name}><dt>{language.name}</dt><dd>{language.level}</dd></div>)}</dl>
          </section>
          <section className="resume-section" aria-labelledby="resume-interests">
            <h2 id="resume-interests">Centres d’intérêt</h2><p>{cv.interests}</p>
          </section>
        </aside>
      </div>
    </article>
  )
}
