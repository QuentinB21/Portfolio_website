import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { timelineItems } from "../data/content";
import { useTimelineMotion } from "../hooks/useTimelineMotion";
import {
  formatTimelinePeriod,
  getTimelineStartValue,
  getTimelineVariant,
} from "../utils/timeline";
import type { TimelineItem } from "../types";

const timelineEntries = [...timelineItems].sort(
  (a, b) => getTimelineStartValue(b) - getTimelineStartValue(a),
);
const tracks = [
  { kind: "experience", label: "Expériences" },
  { kind: "education", label: "Études" },
] as const;

function isOngoing(item: TimelineItem, month: string) {
  return (
    item.periodStart.slice(0, 7) <= month &&
    (!item.periodEnd || item.periodEnd.slice(0, 7) >= month)
  );
}

export function CareerTimeline() {
  const [active, setActive] = useState<TimelineItem["kind"]>("experience");
  const id = useId();
  const panelsRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = panelsRef.current;
    const panel = container?.querySelector<HTMLElement>('[data-active="true"]');
    if (!container || !panel) return;
    const measure = () => {
      container.style.height = `${panel.getBoundingClientRect().height}px`;
      container.dataset.sized = "true";
    };
    measure();
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measure);
    observer?.observe(panel);
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tracks.length;
    else if (event.key === "ArrowLeft")
      next = (index + tracks.length - 1) % tracks.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tracks.length - 1;
    else return;
    event.preventDefault();
    setActive(tracks[next].kind);
    const tabs =
      tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[next].focus();
  };

  return (
    <div className="career-timeline-switcher" data-track={active}>
      <div
        className="timeline-tabs"
        ref={tabsRef}
        role="tablist"
        aria-label="Choisir une chronologie"
      >
        {tracks.map((track, index) => (
          <button
            key={track.kind}
            type="button"
            role="tab"
            id={`${id}-tab-${track.kind}`}
            aria-controls={`${id}-panel-${track.kind}`}
            aria-selected={active === track.kind}
            tabIndex={active === track.kind ? 0 : -1}
            onClick={() => setActive(track.kind)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span aria-hidden="true">{getTimelineVariant(track).icon}</span>
            {track.label}
          </button>
        ))}
      </div>
      <div className="timeline-panels" ref={panelsRef}>
        {tracks.map((track) => (
          <div
            className="timeline-panel"
            key={track.kind}
            data-kind={track.kind}
            data-active={active === track.kind}
            id={`${id}-panel-${track.kind}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${track.kind}`}
            aria-hidden={active !== track.kind}
            inert={active !== track.kind}
            tabIndex={active === track.kind ? 0 : -1}
          >
            <TimelineTrack kind={track.kind} active={active === track.kind} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineTrack({
  kind,
  active,
}: {
  kind: TimelineItem["kind"];
  active: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useTimelineMotion(ref, active);
  const entries = timelineEntries.filter((item) => item.kind === kind);
  const years = [
    ...new Set(entries.map((item) => item.periodStart.slice(0, 4))),
  ];
  const today = new Date();
  const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className={`career-timeline career-timeline-${kind}`} ref={ref}>
      <div className="timeline-journey">
        <div className="timeline-line" aria-hidden="true">
          <span />
        </div>
        <ol
          className="timeline-years"
          aria-label={`${kind === "experience" ? "Expériences professionnelles" : "Études"}, du plus récent au plus ancien`}
        >
          {years.map((year) => {
            const yearEntries = entries.filter((item) =>
              item.periodStart.startsWith(year),
            );
            const ongoing = yearEntries.some((item) => isOngoing(item, month));
            return (
              <li
                className={`timeline-year-group${ongoing ? " timeline-year-current" : ""}`}
                key={year}
              >
                <div className="timeline-year-marker">
                  <span className="timeline-year">{year}</span>
                  {ongoing && (
                    <span className="timeline-year-caption">
                      Le chapitre actuel
                    </span>
                  )}
                </div>
                <span className="timeline-node" aria-hidden="true">
                  <span />
                </span>
                <div className="timeline-events">
                  {yearEntries.map((item) => {
                    const variant = getTimelineVariant(item);
                    return (
                      <article
                        className={`timeline-event timeline-event-${item.kind}`}
                        key={`${item.title}-${item.periodStart}`}
                      >
                        <div className="timeline-event-heading">
                          <span
                            className="timeline-event-icon"
                            aria-hidden="true"
                          >
                            {variant.icon}
                          </span>
                          <span className="timeline-kind">{variant.label}</span>
                          {isOngoing(item, month) && (
                            <span className="timeline-ongoing">En cours</span>
                          )}
                        </div>
                        <h3>{item.title}</h3>
                        <p className="timeline-place">{item.place}</p>
                        <p className="timeline-period">
                          {formatTimelinePeriod(item)}
                        </p>
                        <p className="timeline-detail">{item.detail}</p>
                      </article>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
