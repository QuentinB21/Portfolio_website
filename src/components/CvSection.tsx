type CvSectionProps = {
  loading: boolean
  error: string | null
  html: string
}

export function CvSection({ loading, error, html }: CvSectionProps) {
  return (
    <section className="section">
      <div className="section-header">
        <h3 className="section-title">CV</h3>
        <span className="section-subtitle">Synchronisé depuis GitHub</span>
      </div>
      <div className="glass-card cv-card">
        {loading && <p className="project-description">Chargement du CV...</p>}
        {error && !loading && <p className="project-description">{error}</p>}
        {!loading && !error && <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />}
      </div>
    </section>
  )
}
