type TechnologyTagsProps = {
  items: string[]
  status?: string
}

export function TechnologyTags({ items, status }: TechnologyTagsProps) {
  return (
    <div className="pill-row">
      {items.map((item) => (
        <span className="soft-pill" key={item}>
          {item}
        </span>
      ))}
      {status && <span className="accent-pill">{status}</span>}
    </div>
  )
}
