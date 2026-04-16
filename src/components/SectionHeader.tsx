export function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="section-header-block">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  )
}
