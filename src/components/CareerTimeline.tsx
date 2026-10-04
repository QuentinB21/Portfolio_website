import { timelineItems } from '../data/content'
import { formatTimelinePeriod, getTimelineStartValue, getTimelineVariant } from '../utils/timeline'

const timelineEntries = [...timelineItems].sort((a, b) => getTimelineStartValue(b) - getTimelineStartValue(a))

export function CareerTimeline() {
  return (
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
  )
}
