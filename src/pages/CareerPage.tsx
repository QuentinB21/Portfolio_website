import { PageIntro } from '../components/PageIntro'
import { ProjectCard } from '../components/ProjectCard'
import { TechnologyTags } from '../components/TechnologyTags'
import { FiExternalLink } from 'react-icons/fi'
import { professionalProjects } from '../data/content'
import { SectionHeader } from '../components/SectionHeader'
import { ProfileFact } from '../components/ProfileFact'
import { CareerTimeline } from '../components/CareerTimeline'
import { SkillsList } from '../components/SkillsList'
export function CareerPage() {
  return (
    <>
      <PageIntro
        kicker="Travaux & parcours"
        title="Un parcours chronologique centré sur des expériences concretes."
        aside={
          <div className="editorial-stats">
            <ProfileFact label="Poste actuel" value="Software Engineer Apprentice" />
            <ProfileFact label="Entreprise" value="Renault Trucks (Volvo Group)" />
            <ProfileFact label="Expériences" value="Deux alternances en développement logiciel" />
          </div>
        }
      >
        Cette page rassemble les expériences professionnelles, la formation et les compétences techniques qui
        structurent aujourd'hui mon profil d'ingénieur logiciel orienté produit et qualité.
      </PageIntro>

      <section className="stacked-section">
        <SectionHeader
          title="Expériences mises en avant"
          subtitle="Deux contextes concrets qui montrent à la fois le développement logiciel, l'ergonomie et les enjeux de qualité."
        />
        <div className="project-stack">
          {professionalProjects.map((project) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              action={
                <a
                  className="secondary-button inline-action"
                  href={project.link}
                  rel="noreferrer"
                  target="_blank"
                >
                  Voir le contexte <FiExternalLink size={15} />
                </a>
              }
            >
              <TechnologyTags items={project.stack} status={project.status} />
            </ProjectCard>
          ))}
        </div>
      </section>

      <section className="stacked-section split-section">
        <div className="split-main glass-panel">
          <SectionHeader
            title="Chronologie"
            subtitle="Une lecture simple du parcours, des experiences d'alternance jusqu'à la formation d'ingénieur."
          />
          <CareerTimeline />
        </div>

        <aside className="split-rail glass-panel">
          <SectionHeader
            title="Compétences"
            subtitle="Les outils et domaines que j'utilise aujourd'hui le plus dans un contexte logiciel professionnel."
          />
          <SkillsList />
        </aside>
      </section>
    </>
  )
}
