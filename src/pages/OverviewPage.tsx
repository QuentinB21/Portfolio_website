import { FiArrowRight, FiDownload } from 'react-icons/fi'
import { ContactLinks } from '../components/ContactLinks'
import { ScratchMaze } from '../components/ScratchMaze'
import { SectionHeader } from '../components/SectionHeader'
import { RefScopeExample } from '../components/RefScopeExample'
import { refScopeRelease } from '../data/content'
import portrait from '../assets/quentin-portrait.webp'

type OverviewPageProps = { onNavigate: (path: string) => void }

export function OverviewPage({ onNavigate }: OverviewPageProps) {
  return (
    <>
      <section className="personal-intro">
        <div className="personal-intro-copy hero-panel">
          <h1 className="hero-title">
            <span className="personal-name">Quentin Bouchot.</span>
          </h1>
          <p className="hero-copy">
            Je suis en troisième année du cycle ingénieur en informatique et réseaux
            de communication à CPE Lyon, et alternant chez Renault Trucks.
            J’y développe et maintiens les outils de diagnostic des véhicules
            utilitaires de la marque.
          </p>
          <p className="personal-next-step">
            Ma formation se termine en 2027. J’aimerais ensuite continuer comme
            Software Engineer.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => onNavigate('/work')} type="button">
              Mon parcours <FiArrowRight size={18} aria-hidden="true" />
            </button>
            <button className="secondary-button" onClick={() => onNavigate('/projets')} type="button">
              Mes projets <FiArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <figure className="personal-portrait">
          <img src={portrait} alt="Quentin Bouchot" width="1600" height="901" fetchPriority="high" />
          <figcaption>Jardin botanique, Montreal, Canada</figcaption>
        </figure>
      </section>

      <section className="refscope-feature" aria-labelledby="refscope-title">
        <div className="personal-copy">
          <span className="section-kicker">Un projet personnel · Visual Studio</span>
          <h2 id="refscope-title">RefScope</h2>
          <p>
            Avec l’ajout de tests, le compteur de références de CodeLens ne
            permettait plus de voir facilement si une méthode était appelée
            par l’application ou seulement par les tests. Un collègue m’a
            fait part de sa frustration face à ce problème.
          </p>
          <p>
            J’ai développé une extension Visual Studio qui affiche ces deux
            nombres séparément, directement au-dessus des méthodes C#.
          </p>
          <a className="primary-button refscope-download" href={refScopeRelease.href} download>
            Télécharger RefScope <FiDownload size={18} aria-hidden="true" />
          </a>
          <p className="refscope-release">
            VSIX · Version {refScopeRelease.version} · Windows x64
          </p>
          <button className="refscope-details" type="button" onClick={() => onNavigate('/projets')}>
            Détails et installation <FiArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
        <RefScopeExample />
      </section>

      <section className="scratch-story" aria-labelledby="scratch-story-title">
        <div className="personal-copy">
          <h2 id="scratch-story-title">Pourquoi le développement ?</h2>
          <p>
            J’aime chercher une solution à un problème. Un de mes premiers
            souvenirs de programmation, c’est un labyrinthe sur Scratch au
            collège : il fallait trouver comment en faire sortir la mascotte,
            et l’exercice m’avait beaucoup plu.
          </p>
          <p>
            Au fil des cours, cet intérêt s’est confirmé, jusqu’à devenir
            le domaine dans lequel je voulais poursuivre mes études.
          </p>
        </div>
        <ScratchMaze />
      </section>

      <section className="stacked-section contact-section">
        <SectionHeader title="Un échange, une idée ?" />
        <ContactLinks />
      </section>
    </>
  )
}
