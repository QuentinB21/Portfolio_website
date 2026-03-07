import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { LuDownload, LuMoon, LuSun } from 'react-icons/lu'
import './App.css'
import { fetchAndRenderMarkdown, printHtmlContent } from './utils/printCv'
import { NavBar } from './components/NavBar'
import { Hero } from './components/Hero'
import { Stats } from './components/Stats'
import { SkillsSection } from './components/SkillsSection'
import { ProjectsSection } from './components/ProjectsSection'
import { TimelineSection } from './components/TimelineSection'
import { ContactSection } from './components/ContactSection'
import { ChatWidget } from './components/ChatWidget'
import { CvSection } from './components/CvSection'
import { contact, educations, experiences, projects, skills, cannedAnswers } from './data/content'
import type { ChatMessage } from './types'

function App() {
  const cvPdfUrl = import.meta.env.VITE_CV_PDF_URL || '/cv.pdf'
  const cvMarkdownUrl =
    import.meta.env.VITE_CV_MARKDOWN_URL ||
    'https://raw.githubusercontent.com/QuentinB21/QuentinB21/main/README.md'

  const [cvLoading, setCvLoading] = useState<boolean>(true)
  const [cvError, setCvError] = useState<string | null>(null)
  const [cvHtml, setCvHtml] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: 'assistant', text: 'Salut, je suis QuentinBot. Je peux parler de mes projets, de mon parcours ou de ma stack.' },
    { from: 'assistant', text: 'Pose-moi une question ou clique sur “Discuter avec mon IA” pour démarrer.' },
  ])
  const [input, setInput] = useState('')
  const [typingText, setTypingText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typingRef = useRef<number | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchCv = async () => {
      try {
        const { html } = await fetchAndRenderMarkdown(cvMarkdownUrl)
        setCvHtml(html)
      } catch (error) {
        setCvError("Le CV n'a pas pu être chargé depuis GitHub.")
      } finally {
        setCvLoading(false)
      }
    }

    fetchCv()

    return () => {
      if (typingRef.current) {
        window.clearInterval(typingRef.current)
      }
    }
  }, [cvMarkdownUrl])

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light')
  }, [theme])

  const navTo = (path: string) => {
    if (location.pathname !== path) {
      navigate(path)
    }
  }

  const pickAnswer = (question: string) => {
    const normalized = question.toLowerCase()
    const found = cannedAnswers.find((entry) => entry.keywords.some((k) => normalized.includes(k)))
    if (found) return found.answer
    return "Je note ta question. L’API distante n’est pas branchée ici, mais je peux te parler de mes projets, de mon parcours et de mon stack."
  }

  const streamAnswer = (answer: string) => {
    if (typingRef.current) {
      window.clearInterval(typingRef.current)
    }
    setIsTyping(true)
    setTypingText('')

    let index = 0
    typingRef.current = window.setInterval(() => {
      index += 1
      setTypingText(answer.slice(0, index))
      if (index >= answer.length) {
        if (typingRef.current) {
          window.clearInterval(typingRef.current)
        }
        setIsTyping(false)
        setTypingText('')
        setMessages((prev) => [...prev, { from: 'assistant', text: answer }])
      }
    }, 12)
  }

  const handleDownloadCv = async () => {
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

  const fetchAiAnswer = async (question: string): Promise<string> => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      })

      if (!res.ok) {
        const errText = await res.text()
        console.error('Chat API error', errText)
        return 'Le service IA ne répond pas. Réessaie plus tard.'
      }

      const data = await res.json()
      const content = data?.answer
      if (!content) return 'Pas de réponse reçue. Réessaie plus tard.'
      return content.trim()
    } catch (error) {
      console.error('Chat API request failed', error)
      return 'Une erreur est survenue avec l’IA. Réessaie plus tard.'
    }
  }

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const value = input.trim()
    if (!value) return
    setMessages((prev) => [...prev, { from: 'user', text: value }])
    setInput('')

    setIsTyping(true)
    setTypingText('')

    fetchAiAnswer(value).then((response) => {
      streamAnswer(response || pickAnswer(value))
    })
  }

  const HomePage = () => (
    <div className="page">
      <div className="grid-overlay" />
      <div className="container">
        <NavBar
          brandLabel="Quentin.Dev"
          onBrandClick={() => navTo('/')}
          links={[
            { label: 'Projets', href: '#projets' },
            { label: 'Parcours', href: '#parcours' },
            { label: 'Compétences', href: '#competences' },
            { label: 'Contact', href: '#contact' },
          ]}
          actions={
            <>
              <button className="btn btn-ghost" onClick={() => navTo('/cv')} type="button">
                CV
              </button>
              <button
                className="btn btn-ghost theme-toggle"
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
                title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
              >
                {theme === 'dark' ? <LuSun size={18} /> : <LuMoon size={18} />}
              </button>
            </>
          }
        />

        <Hero onChatOpen={() => setChatOpen(true)} />
        <Stats />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <TimelineSection experiences={experiences} educations={educations} />
        <ContactSection contact={contact} />

        <div className="footer">© 2026 Quentin Bouchot.</div>
      </div>
    </div>
  )

  const CVPage = () => (
    <div className="page">
      <div className="grid-overlay" />
      <div className="container">
        <NavBar
          brandLabel="Quentin.Dev"
          onBrandClick={() => navTo('/')}
          links={[]}
          actions={
            <>
              <button className="btn btn-primary" onClick={handleDownloadCv} type="button">
                <LuDownload size={16} /> Télécharger le PDF
              </button>
              <button
                className="btn btn-ghost theme-toggle"
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
                title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
              >
                {theme === 'dark' ? <LuSun size={18} /> : <LuMoon size={18} />}
              </button>
            </>
          }
        />
        <CvSection loading={cvLoading} error={cvError} html={cvHtml} />
        <div className="footer">© 2026 Quentin Bouchot.</div>
      </div>
    </div>
  )

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cv" element={<CVPage />} />
      </Routes>

      <ChatWidget
        open={chatOpen}
        messages={messages}
        isTyping={isTyping}
        typingText={typingText}
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        onToggle={() => setChatOpen((v) => !v)}
      />
    </>
  )
}

export default App
