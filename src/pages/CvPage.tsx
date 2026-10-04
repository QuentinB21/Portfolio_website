import { PageIntro } from '../components/PageIntro'
import { FiMapPin, FiTrendingUp } from 'react-icons/fi'

type CvPageProps = {
  cvHtml: string
  cvLoading: boolean
  cvError: string | null
}

export function CvPage({ cvHtml, cvLoading, cvError }: CvPageProps) {
  return (
    <>
      <PageIntro
        kicker="CV"
        title="Mon CV, consultable ici et synchronisé avec GitHub."
        variant="cv"
        aside={
          <div className="cv-meta">
            <span className="accent-pill">
              <FiMapPin size={14} /> Lyon, France
            </span>
            <span className="soft-pill">
              <FiTrendingUp size={14} /> Software engineering
            </span>
          </div>
        }
      >
        Cette page présente une version lisible de mon CV. Le contenu est synchronisé avec mon profil GitHub,
        et peut aussi être téléchargé directement depuis cette page.
      </PageIntro>

      <section className="stacked-section">
        <article className="glass-panel cv-document">
          {cvLoading && <p className="body-copy">Chargement du CV...</p>}
          {cvError && !cvLoading && <p className="body-copy">{cvError}</p>}
          {!cvLoading && !cvError && (
            <div className="markdown-body" dangerouslySetInnerHTML={{ __html: cvHtml }} />
          )}
        </article>
      </section>
    </>
  )
}
