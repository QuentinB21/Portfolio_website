import { LuDownload } from 'react-icons/lu'
import type { Theme } from '../types'
import { buildAnalyticsContext, sendAnalyticsEvent } from '../utils/analytics'
import { printHtmlContent } from '../utils/printCv'

type CvDownloadButtonProps = { html: string; pdfUrl: string; path: string; theme: Theme }

export function CvDownloadButton({ html, pdfUrl, path, theme }: CvDownloadButtonProps) {
  const handleDownloadCv = () => {
    sendAnalyticsEvent('cv_download_clicked', buildAnalyticsContext(path, theme))

    if (html) {
      printHtmlContent(html, 'CV Quentin Bouchot')
      return
    }

    if (pdfUrl) {
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = 'CV_Quentin_Bouchot.pdf'
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  }

  return (
    <button className="primary-button" onClick={handleDownloadCv} type="button">
      <LuDownload size={16} />
      <span className="cta-label">Télécharger le PDF</span>
    </button>
  )
}
