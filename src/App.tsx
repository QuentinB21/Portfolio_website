import { useEffect, useMemo } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { LuDownload } from 'react-icons/lu'
import './App.css'
import { ChatWidget } from './components/ChatWidget'
import { SiteChrome } from './components/SiteChrome'
import { timelineItems } from './data/content'
import { useChatbot } from './hooks/useChatbot'
import { useCvContent } from './hooks/useCvContent'
import { useProfileAge } from './hooks/useProfileAge'
import { useThemePreference } from './hooks/useThemePreference'
import { CvPage } from './pages/CvPage'
import { OverviewPage } from './pages/OverviewPage'
import { WorkPage } from './pages/WorkPage'
import { buildAnalyticsContext, initializeAnalytics, sendAnalyticsEvent } from './utils/analytics'
import { printHtmlContent } from './utils/printCv'
import { getTimelineStartValue } from './utils/timeline'

function App() {
  const cvPdfUrl = import.meta.env.VITE_CV_PDF_URL || '/cv.pdf'
  const cvMarkdownUrl =
    import.meta.env.VITE_CV_MARKDOWN_URL ||
    'https://raw.githubusercontent.com/QuentinB21/QuentinB21/main/README.md'

  const navigate = useNavigate()
  const location = useLocation()
  const { currentAge } = useProfileAge()
  const { cvLoading, cvError, cvHtml } = useCvContent({ cvMarkdownUrl })
  const { theme, toggleTheme } = useThemePreference({ path: location.pathname })
  const { messages, input, setInput, typingText, isTyping, chatOpen, handleSubmit, toggleChat } = useChatbot({
    path: location.pathname,
    theme,
  })

  useEffect(() => {
    initializeAnalytics()
  }, [])

  const timelineEntries = useMemo(() => [...timelineItems].sort((a, b) => getTimelineStartValue(b) - getTimelineStartValue(a)), [])

  const handleNavigate = (path: string) => {
    if (location.pathname !== path) {
      navigate(path)
    }
  }

  const handleDownloadCv = async () => {
    sendAnalyticsEvent('cv_download_clicked', buildAnalyticsContext(location.pathname, theme))

    if (cvHtml) {
      printHtmlContent(cvHtml, 'CV Quentin Bouchot')
      return
    }

    if (cvPdfUrl) {
      const link = document.createElement('a')
      link.href = cvPdfUrl
      link.download = 'CV_Quentin_Bouchot.pdf'
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  }

  const chromeAction =
    location.pathname === '/cv' ? (
      <button className="primary-button" onClick={() => void handleDownloadCv()} type="button">
        <LuDownload size={16} />
        <span className="cta-label">Télécharger le PDF</span>
      </button>
    ) : undefined

  return (
    <>
      <div className="app-shell">
        <div className="ambient ambient-top" />
        <div className="ambient ambient-left" />
        <div className="grid-overlay" />
        <SiteChrome
          currentPath={location.pathname}
          onNavigate={handleNavigate}
          onToggleTheme={toggleTheme}
          theme={theme}
          action={chromeAction}
        >
          <Routes>
            <Route path="/" element={<OverviewPage onNavigate={handleNavigate} currentAge={currentAge} />} />
            <Route path="/work" element={<WorkPage timelineEntries={timelineEntries} />} />
            <Route path="/cv" element={<CvPage cvHtml={cvHtml} cvLoading={cvLoading} cvError={cvError} />} />
          </Routes>
        </SiteChrome>
      </div>

      <ChatWidget
        open={chatOpen}
        messages={messages}
        isTyping={isTyping}
        typingText={typingText}
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        onNavigate={handleNavigate}
        onToggle={toggleChat}
      />
    </>
  )
}

export default App
