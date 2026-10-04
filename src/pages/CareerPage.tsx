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
        Du développement d'interfaces aux outils de diagnostic : un parcours
        guidé par le produit, la fiabilité et l'envie de comprendre comment les
        choses fonctionnent.
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
          subtitle="Les outils et domaines que j'utilise aujourd'hui le plus dans un contexte logiciel professionnel."
        />
        <SkillsList />
      </section>
    </>
  );
}
