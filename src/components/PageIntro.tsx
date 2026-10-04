import type { ReactNode } from 'react'

type PageIntroProps = {
  kicker: string
  title: string
  children: ReactNode
  aside?: ReactNode
  variant?: 'editorial' | 'cv'
}

export function PageIntro({ kicker, title, children, aside, variant = 'editorial' }: PageIntroProps) {
  return (
    <section className="stacked-section">
      <div className={`glass-panel ${variant === 'cv' ? 'cv-hero' : 'editorial-hero'}`}>
        <div>
          <span className="section-kicker">{kicker}</span>
          <h1>{title}</h1>
          <p className="hero-copy">{children}</p>
        </div>
        {aside}
      </div>
    </section>
  )
}
