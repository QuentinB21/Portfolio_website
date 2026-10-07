import { PageIntro } from "../components/PageIntro";
import { ProjectCard } from "../components/ProjectCard";
import { TechnologyTags } from "../components/TechnologyTags";
import { FiExternalLink } from "react-icons/fi";
import { professionalProjects } from "../data/content";
import { SectionHeader } from "../components/SectionHeader";
import { ProfileFact } from "../components/ProfileFact";
import { CareerTimeline } from "../components/CareerTimeline";
import { SkillsList } from "../components/SkillsList";
export function CareerPage() {
  return (
    <>
      <PageIntro
        kicker="Travaux & parcours"
        title="Apprendre. Construire. Améliorer."
        aside={
          <div className="editorial-stats">
            <ProfileFact
              label="Poste actuel"
              value="Software Engineer Apprentice"
            />
            <ProfileFact
              label="Entreprise"
              value="Renault Trucks (Volvo Group)"
            />
            <ProfileFact
              label="Expériences"
              value="Deux alternances et un stage international"
            />
          </div>
        }
      >
        Du développement d'interfaces aux outils de diagnostic, mes expériences
        m'ont permis d'aborder plusieurs aspects du développement logiciel.
      </PageIntro>

      <section className="stacked-section">
        <SectionHeader
          title="Expériences mises en avant"
          subtitle="Deux expériences qui associent développement logiciel, ergonomie et qualité."
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

      <section className="stacked-section">
        <SectionHeader
          title="Un parcours, deux regards."
          subtitle="Mes expériences professionnelles et mes études, chacune avec sa propre chronologie."
        />
        <CareerTimeline />
      </section>

      <section className="stacked-section career-skills">
        <SectionHeader
          title="Compétences"
          subtitle="Les technologies et domaines que j'utilise dans mon travail."
        />
        <SkillsList />
      </section>
    </>
  );
}
