import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiExternalLink, FiMapPin, FiTrendingUp } from 'react-icons/fi'
import { LuBriefcaseBusiness, LuDownload, LuGraduationCap, LuMoon, LuSparkles, LuSun } from 'react-icons/lu'
import './App.css'
import logoMark from './assets/1_glass.png'
import { fetchAndRenderMarkdown, printHtmlContent } from './utils/printCv'
import { ChatWidget } from './components/ChatWidget'
import { contact, timelineItems, projects, skills, cannedAnswers } from './data/content'
import type { ChatMessage, TimelineItem } from './types'

type Theme = 'dark' | 'light'

type NavItem = {
  label: string
  path: string
}

const navItems: NavItem[] = [
  { label: 'Overview', path: '/' },
  { label: 'Carriere', path: '/work' },
  { label: 'CV', path: '/cv' },
]

const overviewProofs = [
  {
    title: 'Qualite logicielle',
    body: 'Tests, maintenance et reduction des regressions structurent ma maniere de faire evoluer des applications reelles.',
  },
  {
    title: 'Vision produit',
    body: "Je concois des applications utiles, lisibles et robustes, avec une vraie attention portee a l'experience utilisateur.",
  },
  {
    title: 'Industrialisation progressive',
    body: 'CI/CD, qualite logicielle et testabilite ne sont pas accessoires : ils servent a faire grandir un produit proprement.',
  },
]

const CHAT_STORAGE_KEY = 'quentinbot:messages'

const defaultMessages: ChatMessage[] = [
  { from: 'assistant', text: 'Salut, je suis QuentinBot. Je peux presenter le parcours, les competences et les experiences de Quentin.' },
]

const MONTH_LABELS = ['Janv.', 'Fevr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Aout', 'Sept.', 'Oct.', 'Nov.', 'Dec.']
const BIRTH_DATE = { year: 2003, month: 6, day: 7 }

function getCurrentAge() {
  const now = new Date()
  let age = now.getFullYear() - BIRTH_DATE.year
  const hasHadBirthdayThisYear =
    now.getMonth() + 1 > BIRTH_DATE.month ||
    (now.getMonth() + 1 === BIRTH_DATE.month && now.getDate() >= BIRTH_DATE.day)

  if (!hasHadBirthdayThisYear) {
    age -= 1
  }

  return age
}

function parseTimelineDate(value: string | null) {
  if (!value) return null

  const [yearPart, monthPart] = value.split('-')
  const year = Number(yearPart)
  const month = monthPart ? Number(monthPart) : 1

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return null
  }

  return { year, month }
}

function getTimelineStartValue(item: TimelineItem) {
  const parsed = parseTimelineDate(item.periodStart)
  if (!parsed) return Number.NEGATIVE_INFINITY
  return parsed.year * 100 + parsed.month
}

function formatTimelineDate(value: string | null) {
  if (!value) return 'Present'

  const parsed = parseTimelineDate(value)
  if (!parsed) return value

  return `${MONTH_LABELS[parsed.month - 1]} ${parsed.year}`
}

function formatTimelinePeriod(item: TimelineItem) {
  return `${formatTimelineDate(item.periodStart)} - ${formatTimelineDate(item.periodEnd)}`
}

function readStoredMessages(): ChatMessage[] {
  if (typeof window === 'undefined') {
    return defaultMessages
  }

  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY)
    if (!raw) {
      return defaultMessages
    }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return defaultMessages

    const sanitized = parsed.filter(
      (message): message is ChatMessage =>
        typeof message === 'object' &&
        message !== null &&
        (message.from === 'user' || message.from === 'assistant') &&
        typeof message.text === 'string',
    )

    return sanitized.length > 0 ? sanitized : defaultMessages
  } catch {
    return defaultMessages
  }
}

function App() {
  const cvPdfUrl = import.meta.env.VITE_CV_PDF_URL || '/cv.pdf'
  const cvMarkdownUrl =
    import.meta.env.VITE_CV_MARKDOWN_URL ||
    'https://raw.githubusercontent.com/QuentinB21/QuentinB21/main/README.md'

  const [cvLoading, setCvLoading] = useState(true)
  const [cvError, setCvError] = useState<string | null>(null)
  const [cvHtml, setCvHtml] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(() => readStoredMessages())
  const [input, setInput] = useState('')
  const [typingText, setTypingText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>('dark')
  const typingRef = useRef<number | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const timelineEntries = useMemo<TimelineItem[]>(
    () => [...timelineItems].sort((a, b) => getTimelineStartValue(b) - getTimelineStartValue(a)),
    [],
  )

  useEffect(() => {
    const fetchCv = async () => {
      try {
        const { html } = await fetchAndRenderMarkdown(cvMarkdownUrl)
        setCvHtml(html)
      } catch {
        setCvError("Le CV n'a pas pu etre charge depuis GitHub.")
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

  useEffect(() => {
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  const navTo = (path: string) => {
    if (location.pathname !== path) {
      navigate(path)
    }
  }

  const pickAnswer = (question: string) => {
    const normalized = question.toLowerCase()
    const found = cannedAnswers.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)))
    if (found) return found.answer
    return "Je note ta question. L'API distante n'est pas branchee ici, mais je peux te parler du parcours, des competences et des experiences de Quentin."
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
        return 'Le service IA ne repond pas. Reessaie plus tard.'
      }

      const data = await res.json()
      const content = data?.answer
      if (!content) return 'Pas de reponse recue. Reessaie plus tard.'
      return content.trim()
    } catch (error) {
      console.error('Chat API request failed', error)
      return "Une erreur est survenue avec l'IA. Reessaie plus tard."
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

  const chromeAction =
    location.pathname === '/cv' ? (
      <button className="primary-button" onClick={() => void handleDownloadCv()} type="button">
        <LuDownload size={16} />
        <span className="cta-label">Telecharger le PDF</span>
      </button>
    ) : undefined

  return (
    <>
      <div className="app-shell">
        <div className="ambient ambient-top" />
        <div className="ambient ambient-left" />
        <div className="grid-overlay" />
        <SiteChrome {...shellProps} action={chromeAction}>
          <Routes>
            <Route path="/" element={<OverviewPage onNavigate={navTo} />} />
            <Route path="/work" element={<WorkPage timelineEntries={timelineEntries} />} />
            <Route
              path="/cv"
              element={
                <CvPage
                  cvHtml={cvHtml}
                  cvLoading={cvLoading}
                  cvError={cvError}
                />
              }
            />
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
  const activeNavIndex = Math.max(
    navItems.findIndex((item) => item.path === currentPath),
    0,
  )

  return (
    <div className="page-shell">
      <div className="chrome-brand" aria-label="Identite du site">
        <button className="brand-button" onClick={() => onNavigate('/')} type="button" aria-label="Retour a l'accueil">
          <img className="brand-logo" src={logoMark} alt="Logo Quentin Bouchot" />
          <span className="brand-text">Quentin.Dev</span>
        </button>
      </div>

      <div className="chrome-utilities" aria-label="Actions rapides">
        {action}
        <button
          className="icon-button theme-toggle-button"
          onClick={onToggleTheme}
          type="button"
          aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          {theme === 'dark' ? <LuSun size={16} /> : <LuMoon size={16} />}
        </button>
      </div>

      <header className="topbar glass-panel">
        <nav
          className="topbar-nav"
          aria-label="Navigation principale"
          style={
            {
              '--active-index': activeNavIndex,
              '--nav-count': navItems.length,
            } as CSSProperties
          }
        >
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
      </header>

      <main className="page-content">{children}</main>
      <footer className="site-footer">© 2026 Quentin Bouchot.</footer>
    </div>
  )
}

function OverviewPage({ onNavigate }: Pick<SharedPageProps, 'onNavigate'>) {
  const currentAge = getCurrentAge()

  return (
    <>
      <section className="hero-layout">
        <article className="glass-panel hero-panel">
          <span className="eyebrow-pill">
            <LuSparkles size={14} /> Eleve ingenieur · logiciel, data & IA
          </span>
          <h1>Ingenierie logicielle orientee produit, qualite et robustesse.</h1>
          <p className="hero-copy">
            Eleve ingenieur en informatique et reseaux a CPE Lyon, je developpe aujourd'hui des outils de diagnostic
            chez Renault Trucks. Mon approche met l'accent sur la maintenabilite du code, la fiabilite des applications,
            l'experience utilisateur et l'industrialisation logicielle.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => onNavigate('/work')} type="button">
              Voir la carriere <FiArrowRight size={16} />
            </button>
            <button className="secondary-button" onClick={() => onNavigate('/cv')} type="button">
              Consulter le CV
            </button>
          </div>
          <div className="pill-row">
            {['C#', '.NET', 'Blazor', 'Vue.js', 'Azure DevOps', 'Docker'].map((item) => (
              <span className="soft-pill" key={item}>
                {item}
              </span>
            ))}
          </div>
        </article>

        <aside className="hero-rail">
          <article className="glass-panel side-panel proof-card">
            <span className="section-kicker">Profil</span>
            <h2>
              Quentin Bouchot <span className="inline-muted">· {currentAge} ans</span>
            </h2>
            <p>
              Eleve ingenieur en informatique et reseaux a CPE Lyon, specialise en developpement logiciel, data et IA.
            </p>
            <div className="story-list">
              <StoryItem label="Role actuel" value="Software Engineer Apprentice chez Renault Trucks" />
              <StoryItem label="Positionnement" value="Produit, qualite logicielle, robustesse" />
              <StoryItem label="Localisation" value="Lyon, France" />
            </div>
          </article>
        </aside>
      </section>

      <section className="stacked-section">
        <SectionHeader
          title="Trois axes qui structurent mon profil"
          subtitle="Une lecture rapide du positionnement avant d'entrer dans les experiences, les projets et les competences."
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
            title="Apercu des experiences"
            subtitle="L'accueil ne garde qu'un extrait. La page carriere detaille ensuite le parcours, la chronologie et les competences."
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
          subtitle="Des points d'entree directs pour consulter mon profil, mes travaux et mes coordonnees."
        />
        <div className="contact-strip">
          {contact.map((item) => (
            <a
              className={`glass-panel contact-pill ${getContactToneClass(item.href)}`}
              href={item.href}
              key={item.label}
              rel="noreferrer"
              target="_blank"
            >
              <span className="contact-icon">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}

function WorkPage({ timelineEntries }: { timelineEntries: TimelineItem[] }) {
  return (
    <>
      <section className="stacked-section">
        <div className="glass-panel editorial-hero">
          <div>
            <span className="section-kicker">Travaux & parcours</span>
            <h1>Un parcours chronologique centré sur des experiences concretes.</h1>
            <p className="hero-copy">
              Cette page rassemble les experiences professionnelles, la formation et les competences techniques qui
              structurent aujourd'hui mon profil d'ingenieur logiciel oriente produit et qualite.
            </p>
          </div>
          <div className="editorial-stats">
            <StoryItem label="Poste actuel" value="Software Engineer Apprentice" />
            <StoryItem label="Entreprise" value="Renault Trucks (Volvo Group)" />
            <StoryItem label="Experiences" value="Deux alternances en developpement logiciel" />
          </div>
        </div>
      </section>

      <section className="stacked-section">
        <SectionHeader
          title="Experiences mises en avant"
          subtitle="Deux contextes concrets qui montrent a la fois le developpement logiciel, l'ergonomie et les enjeux de qualite."
        />
        <div className="project-stack">
          {projects.map((project) => (
            <article className="glass-panel proof-card project-feature" key={project.title}>
              <div className="project-feature-head">
                <div>
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                </div>
                <a className="secondary-button inline-action" href={project.link} rel="noreferrer" target="_blank">
                  Voir le contexte <FiExternalLink size={15} />
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
            subtitle="Une lecture simple du parcours, des experiences d'alternance jusqu'a la formation d'ingenieur."
          />
          <div className="timeline-list">
            {timelineEntries.map((item, index) => {
              const variant = getTimelineVariant(item)

              return (
                <article
                  className={`timeline-entry timeline-entry-${index % 2 === 0 ? 'left' : 'right'}`}
                  key={`${item.title}-${item.periodStart}`}
                >
                  <div className="timeline-card-shell">
                    <div className={`timeline-card glass-panel timeline-card-${variant.kind}`}>
                      <div className="timeline-card-top">
                        <span className="timeline-badge">{formatTimelinePeriod(item)}</span>
                        <span className={`timeline-kind timeline-kind-${variant.kind}`}>
                          {variant.icon}
                          {variant.label}
                        </span>
                      </div>
                      <div className="timeline-content">
                        <h3>{item.title}</h3>
                        <p className="timeline-place">{item.place}</p>
                        <p>{item.detail}</p>
                      </div>
                    </div>
                  </div>
                  <div className={`timeline-node timeline-node-${variant.kind}`} aria-hidden="true">
                    <span className="timeline-node-core" />
                  </div>
                  <div className="timeline-spacer" aria-hidden="true" />
                </article>
              )
            })}
          </div>
        </div>

        <aside className="split-rail glass-panel">
          <SectionHeader
            title="Competences"
            subtitle="Les outils et domaines que j'utilise aujourd'hui le plus dans un contexte logiciel professionnel."
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
    </>
  )
}

function CvPage({
  cvHtml,
  cvLoading,
  cvError,
}: {
  cvHtml: string
  cvLoading: boolean
  cvError: string | null
}) {
  return (
    <>
      <section className="stacked-section">
        <div className="glass-panel cv-hero">
          <div>
            <span className="section-kicker">CV</span>
            <h1>Version document, structuree et exploitable.</h1>
            <p className="hero-copy">
              Une lecture plus dense et plus documentaire du meme profil, avec le meme niveau d'exigence sur la clarte et
              la hierarchie.
            </p>
          </div>
          <div className="cv-meta">
            <span className="accent-pill">
              <FiMapPin size={14} /> Lyon, France
            </span>
            <span className="soft-pill">
              <FiTrendingUp size={14} /> Software engineering
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
    </>
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

function getTimelineVariant(item: TimelineItem) {
  if (item.kind === 'education') {
    return {
      kind: 'education' as const,
      label: 'Formation',
      icon: <LuGraduationCap size={14} />,
    }
  }

  return {
    kind: 'experience' as const,
    label: 'Experience',
    icon: <LuBriefcaseBusiness size={14} />,
  }
}

function getContactToneClass(href: string) {
  if (href.startsWith('mailto:')) {
    return 'contact-pill-mail'
  }

  if (href.includes('linkedin.com')) {
    return 'contact-pill-linkedin'
  }

  if (href.includes('github.com')) {
    return 'contact-pill-github'
  }

  return ''
}

export default App
