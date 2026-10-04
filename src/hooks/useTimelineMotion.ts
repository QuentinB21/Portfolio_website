import { useEffect, type RefObject } from "react";

/** Enhance the timeline without making its content depend on animation support. */
export function useTimelineMotion(
  ref: RefObject<HTMLDivElement | null>,
  active = true,
) {
  useEffect(() => {
    if (!active) return;
    const root = ref.current;
    const journey = root?.querySelector<HTMLElement>(".timeline-journey");
    if (!root || !journey) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const groups = [
      ...root.querySelectorAll<HTMLElement>(".timeline-year-group"),
    ];
    let frame = 0;
    let observer: IntersectionObserver | undefined;

    const update = () => {
      frame = 0;
      const rect = journey.getBoundingClientRect();
      const progress = motion.matches
        ? 1
        : Math.min(
            1,
            Math.max(
              0,
              (window.innerHeight * 0.7 - rect.top) / Math.max(1, rect.height),
            ),
          );
      root.style.setProperty("--timeline-progress", String(progress));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const setup = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      observer?.disconnect();
      groups.forEach((group) =>
        group.classList.remove("timeline-reveal-pending", "timeline-animated"),
      );
      if (!motion.matches && "IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(({ target, isIntersecting }) => {
              if (!isIntersecting) return;
              target.classList.remove("timeline-reveal-pending");
              observer?.unobserve(target);
            });
          },
          { rootMargin: "0px 0px -32px 0px" },
        );
        groups.forEach((group) => {
          if (group.getBoundingClientRect().top < window.innerHeight) return;
          group.classList.add("timeline-animated", "timeline-reveal-pending");
          observer?.observe(group);
        });
      }
      update();
    };

    setup();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", setup);
      groups.forEach((group) =>
        group.classList.remove("timeline-reveal-pending", "timeline-animated"),
      );
    };
  }, [ref, active]);
}
