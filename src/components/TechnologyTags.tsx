import type { CSSProperties } from 'react'
import type { IconType } from 'react-icons'
import { TbBrandCSharp } from 'react-icons/tb'
import { VscAzureDevops } from 'react-icons/vsc'
import {
  SiBlazor,
  SiBootstrap,
  SiDocker,
  SiDotnet,
  SiGit,
  SiJavascript,
  SiKeycloak,
  SiN8N,
  SiPostgresql,
  SiReact,
  SiTypescript,
  SiVuedotjs,
} from 'react-icons/si'

const technologies: Record<string, { icon: IconType; color: string }> = {
  'C#': { icon: TbBrandCSharp, color: '#a88bff' },
  '.NET': { icon: SiDotnet, color: '#a88bff' },
  'ASP.NET': { icon: SiDotnet, color: '#a88bff' },
  'ASP.NET Core': { icon: SiDotnet, color: '#a88bff' },
  Blazor: { icon: SiBlazor, color: '#ac8bff' },
  'Vue.js': { icon: SiVuedotjs, color: '#62dcb2' },
  'Azure DevOps': { icon: VscAzureDevops, color: '#6aa8ff' },
  Docker: { icon: SiDocker, color: '#6aa8ff' },
  'Docker Compose': { icon: SiDocker, color: '#6aa8ff' },
  React: { icon: SiReact, color: '#68d9ee' },
  TypeScript: { icon: SiTypescript, color: '#6aa8ff' },
  JavaScript: { icon: SiJavascript, color: '#ecd565' },
  PostgreSQL: { icon: SiPostgresql, color: '#83b6e0' },
  Keycloak: { icon: SiKeycloak, color: '#80cce0' },
  n8n: { icon: SiN8N, color: '#ed899b' },
  Bootstrap: { icon: SiBootstrap, color: '#ac8bff' },
  Git: { icon: SiGit, color: '#f09980' },
}

type TechnologyTagsProps = { items: string[]; status?: string }

export function TechnologyTags({ items, status }: TechnologyTagsProps) {
  return (
    <div className="technology-list" aria-label="Technologies et compétences">
      {items.map((item) => {
        const technology = technologies[item]
        if (!technology)
          return (
            <span className="technology-label" key={item}>
              {item}
            </span>
          )
        const Icon = technology.icon
        return (
          <span
            className="technology-icon"
            key={item}
            tabIndex={0}
            role="img"
            aria-label={item}
            style={{ '--technology-color': technology.color } as CSSProperties}
          >
            <Icon aria-hidden="true" />
            <span className="technology-tooltip" aria-hidden="true">
              {item}
            </span>
          </span>
        )
      })}
      {status && <span className="project-status">{status}</span>}
    </div>
  )
}
