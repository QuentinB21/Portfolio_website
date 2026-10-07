import { useState } from 'react'
import { LuDownload } from 'react-icons/lu'
import type { Theme } from '../types'
import { buildAnalyticsContext, sendAnalyticsEvent } from '../utils/analytics'

type CvDownloadButtonProps = { path: string; theme: Theme }

export function CvDownloadButton({ path, theme }: CvDownloadButtonProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const handleDownloadCv = async () => {
    if (busy) return
    setBusy(true)
    setError(false)
    try {
      const { createCvPdf } = await import('../utils/cvPdf')
      const pdf = createCvPdf()
      pdf.save('CV_Quentin_Bouchot.pdf')
      sendAnalyticsEvent('cv_download_clicked', buildAnalyticsContext(path, theme))
    } catch {
      setError(true)
    } finally {
      setBusy(false)
    }
  }
  return (
    <>
      <button className="primary-button" onClick={handleDownloadCv} type="button" disabled={busy} aria-busy={busy} aria-label={busy ? 'Préparation du PDF' : 'Télécharger le CV en PDF'}>
        <LuDownload size={16} />
        <span className="cta-label">{busy ? 'Préparation…' : 'Télécharger le PDF'}</span>
      </button>
      {error && <p className="cv-download-error" role="alert">Le PDF n’a pas pu être généré. Réessayez le téléchargement.</p>}
    </>
  )
}
