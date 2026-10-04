import { useEffect, useLayoutEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { CvDownloadButton } from './components/CvDownloadButton'
import { SiteLayout } from './components/SiteLayout'
import { useCvContent } from './hooks/useCvContent'
import { useThemePreference } from './hooks/useThemePreference'
import { CareerPage } from './pages/CareerPage'
import { CvPage } from './pages/CvPage'
import { LegalPage } from './pages/LegalPage'
import { OverviewPage } from './pages/OverviewPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { initializeAnalytics } from './utils/analytics'

const cvPdfUrl = import.meta.env.VITE_CV_PDF_URL || '/cv.pdf'
const cvMarkdownUrl =
  import.meta.env.VITE_CV_MARKDOWN_URL ||
  'https://raw.githubusercontent.com/QuentinB21/QuentinB21/main/README.md'

function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { cvLoading, cvError, cvHtml } = useCvContent({ cvMarkdownUrl })
  const { theme, toggleTheme } = useThemePreference({ path: pathname })

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  useEffect(() => {
    initializeAnalytics()
  }, [])

  const handleNavigate = (path: string) => {
    if (pathname !== path) navigate(path)
  }

  return (
    <SiteLayout
      currentPath={pathname}
      onNavigate={handleNavigate}
      onToggleTheme={toggleTheme}
      theme={theme}
      action={
        pathname === '/cv' ? (
          <CvDownloadButton html={cvHtml} pdfUrl={cvPdfUrl} path={pathname} theme={theme} />
        ) : undefined
      }
    >
      <Routes>
        <Route path="/" element={<OverviewPage onNavigate={handleNavigate} />} />
        <Route path="/work" element={<CareerPage />} />
        <Route path="/projets" element={<ProjectsPage />} />
        <Route path="/cv" element={<CvPage cvHtml={cvHtml} cvLoading={cvLoading} cvError={cvError} />} />
        <Route path="/mentions-legales" element={<LegalPage />} />
        <Route path="/confidentialite" element={<PrivacyPage />} />
      </Routes>
    </SiteLayout>
  )
}

export default App
