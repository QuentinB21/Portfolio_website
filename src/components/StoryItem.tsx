export function StoryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="story-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
