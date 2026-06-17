import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { useProjectPresentation } from '../hooks/useProjectPresentation'

type ProjectPresentationPreviewProps = {
  projectTitle: string
  fallbackDescription: string
  presentationUrl?: string
}

export function ProjectPresentationPreview({
  projectTitle,
  fallbackDescription,
  presentationUrl,
}: ProjectPresentationPreviewProps) {
  const [expanded, setExpanded] = useState(false)
  const { markdown, summaryText, hasFullContent, loading, error } = useProjectPresentation({
    projectTitle,
    fallbackDescription,
    presentationUrl,
  })

  return (
    <div className="project-presentation-flow">
      <p className="project-presentation-summary">
        {loading ? 'Chargement de la présentation du projet…' : error ? fallbackDescription : summaryText}
      </p>

      {!loading && !error && hasFullContent ? (
        <div className="project-presentation-disclosure">
          <button className="project-presentation-toggle" onClick={() => setExpanded((current) => !current)} type="button">
            <span>{expanded ? 'Réduire la présentation' : 'Lire la présentation complète'}</span>
            {expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>
        </div>
      ) : null}

      {!loading && !error && expanded ? (
        <div className="markdown-body project-presentation-markdown">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      ) : null}
    </div>
  )
}
