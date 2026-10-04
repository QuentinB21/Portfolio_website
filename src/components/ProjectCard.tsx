import type { ReactNode } from 'react'

type ProjectCardProps = {
  title: string
  description?: string
  action: ReactNode
  children: ReactNode
}

export function ProjectCard({ title, description, action, children }: ProjectCardProps) {
  return (
    <article className="glass-panel proof-card project-feature">
      <div className="project-feature-head">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </article>
  )
}
