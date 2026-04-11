import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  FiArrowRight,
  FiExternalLink,
  FiMapPin,
  FiMessageSquare,
  FiTrendingUp,
} from 'react-icons/fi'
import { LuDownload, LuMoon, LuSparkles, LuSun } from 'react-icons/lu'
import './App.css'
import { fetchAndRenderMarkdown, printHtmlContent } from './utils/printCv'
import { ChatWidget } from './components/ChatWidget'
import { contact, educations, experiences, projects, skills, cannedAnswers } from './data/content'
import type { ChatMessage, TimelineItem } from './types'

type Theme = 'dark' | 'light'

type NavItem = {
  label: string
  path: string
}

const navItems: NavItem[] = [
  { label: 'Overview', path: '/' },
  { label: 'Travaux', path: '/work' },
  { label: 'CV', path: '/cv' },
]

const overviewProofs = [
  {
    title: 'Expérience industrialisée',
    body: "Desktop, web, maintenance, CI/CD: le spectre est assez large pour rassurer sans transformer l'accueil en catalogue.",
  },
  {
    title: 'Stack utile',
    body: 'React, TypeScript, .NET, Node et intégration IA servent des cas concrets plutôt que de faire vitrine technique.',
  },
  {
    title: 'Posture produit',
    body: 'Lisibilité, structure, accessibilité et sens de la livraison priment sur la démonstration visuelle gratuite.',
  },
]

function App() {
  const cvPdfUrl = import.meta.env.VITE_CV_PDF_URL || '/cv.pdf'
  const cvMarkdownUrl =
    import.meta.env.VITE_CV_MARKDOWN_URL ||
    'https://raw.githubusercontent.com/QuentinB21/QuentinB21/main/README.md'

  const [cvLoading, setCvLoading] = useState(true)
  const [cvError, setCvError] = useState<string | null>(null)
  const [cvHtml, setCvHtml] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: 'assistant', text: 'Salut, je suis QuentinBot. Je peux parler de mes projets, de mon parcours ou de ma stack.' },
    { from: 'assistant', text: 'Pose-moi une question ou clique sur “Parler avec mon IA” pour démarrer.' },
  ])
  const [input, setInput] = useState('')
  const [typingText, setTypingText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>('dark')
  const typingRef = useRef<number | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const timelineEntries = useMemo<TimelineItem[]>(
    () => [...experiences, ...educations].sort((a, b) => b.period.localeCompare(a.period)),
    [],
  )

  useEffect(() => {
    const fetchCv = async () => {
      try {
        const { html } = await fetchAndRenderMarkdown(cvMarkdownUrl)
        setCvHtml(html)
      } catch {
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
    const found = cannedAnswers.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)))
    if (found) return found.answer
    return "Je note ta question. L'API distante n'est pas branchée ici, mais je peux te parler de mes projets, de mon parcours et de mon stack."
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
      return "Une erreur est survenue avec l'IA. Réessaie plus tard."
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

  const shellProps = {
    onNavigate: navTo,
    onToggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    onOpenChat: () => setChatOpen(true),
    currentPath: location.pathname,
    theme,
  }

  return (
    <>
      <div className="app-shell">
        <div className="ambient ambient-top" />
        <div className="ambient ambient-left" />
        <div className="grid-overlay" />
        <Routes>
          <Route path="/" element={<OverviewPage {...shellProps} />} />
          <Route path="/work" element={<WorkPage {...shellProps} timelineEntries={timelineEntries} />} />
          <Route
            path="/cv"
            element={
              <CvPage
                {...shellProps}
                cvHtml={cvHtml}
                cvLoading={cvLoading}
                cvError={cvError}
                onDownloadCv={handleDownloadCv}
              />
            }
          />
        </Routes>
      </div>

      <ChatWidget
        open={chatOpen}
        messages={messages}
        isTyping={isTyping}
        typingText={typingText}
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        onToggle={() => setChatOpen((current) => !current)}
      />
    </>
  )
}

type SharedPageProps = {
  currentPath: string
  onNavigate: (path: string) => void
  onToggleTheme: () => void
  onOpenChat: () => void
  theme: Theme
}

function SiteChrome({
  currentPath,
  onNavigate,
  onToggleTheme,
  theme,
  children,
  action,
}: SharedPageProps & { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="page-shell">
      <header className="topbar glass-panel">
        <button className="brand-button" onClick={() => onNavigate('/')} type="button">
          <span className="brand-orb" />
          <span className="brand-text">Quentin.Dev</span>
        </button>

        <nav className="topbar-nav" aria-label="Navigation principale">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-tab ${currentPath === item.path ? 'is-active' : ''}`}
              onClick={() => onNavigate(item.path)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="topbar-actions">
          {action}
          <button
            className="icon-button"
            onClick={onToggleTheme}
            type="button"
            aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
            title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {theme === 'dark' ? <LuSun size={16} /> : <LuMoon size={16} />}
          </button>
        </div>
      </header>

      <main className="page-content">{children}</main>
      <footer className="site-footer">© 2026 Quentin Bouchot.</footer>
    </div>
  )
}

function OverviewPage(props: SharedPageProps) {
  return (
    <SiteChrome
      {...props}
      action={
        <button className="primary-button" onClick={() => props.onOpenChat()} type="button">
          <FiMessageSquare size={16} /> Parler avec mon IA
        </button>
      }
    >
      <section className="hero-layout">
        <article className="glass-panel hero-panel">
          <span className="eyebrow-pill">
            <LuSparkles size={14} /> Disponible pour missions ciblées
          </span>
          <h1>Une page d’accueil plus éditoriale, plus claire et plus désirable.</h1>
          <p className="hero-copy">
            Au lieu d’un assemblage de blocs concurrents, l’accueil pose un message fort, quelques preuves crédibles
            puis oriente vers une page dédiée aux travaux et au parcours.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => props.onNavigate('/work')} type="button">
              Voir les travaux <FiArrowRight size={16} />
            </button>
            <button className="secondary-button" onClick={() => props.onNavigate('/cv')} type="button">
              Consulter le CV
            </button>
          </div>
          <div className="pill-row">
            {['React', 'TypeScript', '.NET / Blazor', 'Node.js', 'Docker', 'IA appliquée'].map((item) => (
              <span className="soft-pill" key={item}>
                {item}
              </span>
            ))}
          </div>
        </article>

        <aside className="hero-rail">
          <article className="glass-panel side-panel proof-card">
            <span className="section-kicker">Identité</span>
            <h2>Quentin Bouchot</h2>
            <p>
              Ingénieur logiciel full-stack en alternance. J’aime concevoir des interfaces sobres, solides et
              compréhensibles.
            </p>
            <div className="story-list">
              <StoryItem label="Rôle actuel" value="Apprenti software engineer chez Renault Trucks" />
              <StoryItem label="Focus" value="Produits techniques lisibles, fiables, industrialisés" />
              <StoryItem label="Localisation" value="Lyon, France" />
            </div>
          </article>
        </aside>
      </section>

      <section className="stacked-section">
        <SectionHeader
          title="Trois preuves fortes, au lieu de dix blocs concurrents"
          subtitle="La page d’accueil rassure vite. Le détail des projets et du parcours passe sur une page dédiée."
        />
        <div className="proof-grid">
          {overviewProofs.map((proof) => (
            <article className="glass-panel proof-card" key={proof.title}>
              <h3>{proof.title}</h3>
              <p>{proof.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="stacked-section split-section">
        <div className="split-main glass-panel">
          <SectionHeader
            title="Aperçu des travaux"
            subtitle="L’accueil ne garde qu’un extrait. Le catalogue complet et le parcours détaillé vivent sur une page distincte."
          />
          <div className="feature-list">
            {projects.map((project) => (
              <article className="feature-item" key={project.title}>
                <div className="feature-meta">
                  <h3>{project.title}</h3>
                  <span className="accent-pill">{project.stack.slice(0, 3).join(' · ')}</span>
                </div>
                <p>{project.description}</p>
              </article>
            ))}
          </div>
        </div>
     </section>

      <section className="stacked-section">
        <SectionHeader
          title="Contact"
          subtitle="Des points d’entrée simples, visibles, sans transformer l’accueil en page de directory."
        />
        <div className="contact-strip">
          {contact.map((item) => (
            <a className="glass-panel contact-pill" href={item.href} key={item.label} rel="noreferrer" target="_blank">
              <span className="contact-icon">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </section>
    </SiteChrome>
  )
}

function WorkPage(props: SharedPageProps & { timelineEntries: TimelineItem[] }) {
  return (
    <SiteChrome
      {...props}
      action={
        <button className="primary-button" onClick={() => props.onNavigate('/cv')} type="button">
          <LuDownload size={16} /> Ouvrir le CV
        </button>
      }
    >
      <section className="stacked-section">
        <div className="glass-panel editorial-hero">
          <div>
            <span className="section-kicker">Travaux & parcours</span>
            <h1>Les détails vivent ici, avec une lecture plus linéaire.</h1>
            <p className="hero-copy">
              Cette page concentre ce qui était auparavant dispersé sur l’accueil : projets, chronologie, compétences
              et contexte de livraison. Le contenu devient plus dense, mais aussi mieux organisé.
            </p>
          </div>
          <div className="editorial-stats">
            <StoryItem label="Projets clés" value="3 cas mis en avant" />
            <StoryItem label="Expériences" value="2 expériences pro + 2 formations" />
            <StoryItem label="Lecture" value="Plus progressive, moins fragmentée" />
          </div>
        </div>
      </section>

      <section className="stacked-section">
        <SectionHeader
          title="Projets sélectionnés"
          subtitle="Des cartes plus larges, moins nombreuses, avec une vraie respiration. On privilégie le sens avant la densité."
        />
        <div className="project-stack">
          {projects.map((project) => (
            <article className="glass-panel project-feature" key={project.title}>
              <div className="project-feature-head">
                <div>
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                </div>
                <a className="secondary-button inline-action" href={project.link} rel="noreferrer" target="_blank">
                  Voir le cas <FiExternalLink size={15} />
                </a>
              </div>
              <div className="pill-row">
                {project.stack.map((item) => (
                  <span className="soft-pill" key={item}>
                    {item}
                  </span>
                ))}
                <span className="accent-pill">{project.status}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="stacked-section split-section">
        <div className="split-main glass-panel">
          <SectionHeader
            title="Chronologie"
            subtitle="Une timeline verticale simple est plus lisible qu’un damier de cartes quand l’information est chronologique."
          />
          <div className="timeline-list">
            {props.timelineEntries.map((item) => (
              <article className="timeline-entry" key={`${item.title}-${item.period}`}>
                <div className="timeline-period">{item.period}</div>
                <div className="timeline-content">
                  <h3>{item.title}</h3>
                  <p className="timeline-place">{item.place}</p>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="split-rail glass-panel">
          <SectionHeader
            title="Compétences"
            subtitle="La stack reste présente, mais sous forme de groupes cohérents plutôt que de badges partout."
          />
          <div className="skill-column">
            {skills.map((group) => (
              <article className="skill-group" key={group.title}>
                <h3>{group.title}</h3>
                <div className="pill-row">
                  {group.items.map((item) => (
                    <span className="soft-pill" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </SiteChrome>
  )
}

function CvPage({
  cvHtml,
  cvLoading,
  cvError,
  onDownloadCv,
  ...props
}: SharedPageProps & {
  cvHtml: string
  cvLoading: boolean
  cvError: string | null
  onDownloadCv: () => Promise<void>
}) {
  return (
    <SiteChrome
      {...props}
      action={
        <button className="primary-button" onClick={() => void onDownloadCv()} type="button">
          <LuDownload size={16} /> Télécharger le PDF
        </button>
      }
    >
      <section className="stacked-section">
        <div className="glass-panel cv-hero">
          <div>
            <span className="section-kicker">CV</span>
            <h1>Version document, lisible et imprimable.</h1>
            <p className="hero-copy">
              Le langage liquid glass reste présent, mais la hiérarchie se rapproche d’une page premium plus dense et
              professionnelle.
            </p>
          </div>
          <div className="cv-meta">
            <span className="accent-pill">
              <FiMapPin size={14} /> Lyon, France
            </span>
            <span className="soft-pill">
              <FiTrendingUp size={14} /> Alternance full-stack
            </span>
          </div>
        </div>
      </section>

      <section className="stacked-section">
        <article className="glass-panel cv-document">
          {cvLoading && <p className="body-copy">Chargement du CV...</p>}
          {cvError && !cvLoading && <p className="body-copy">{cvError}</p>}
          {!cvLoading && !cvError && <div className="markdown-body" dangerouslySetInnerHTML={{ __html: cvHtml }} />}
        </article>
      </section>
    </SiteChrome>
  )
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="section-header-block">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  )
}

function StoryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="story-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export default App
