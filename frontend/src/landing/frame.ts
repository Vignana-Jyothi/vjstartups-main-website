import { RefObject, useEffect, useRef } from "react";

// Scroll-linked sections used to call getBoundingClientRect/offsetHeight inside their own
// always-on rAF loops. Each read landed after another loop's style writes, forcing a full
// layout several times per frame (~6s of main-thread work on a throttled phone). Geometry is
// now measured only when something resizes, and a section's loop runs only near the viewport.

type Geo = { top: number; height: number };

const tracked = new Map<HTMLElement, Geo>();
const listeners = new Set<() => void>();
let viewport = typeof window === "undefined" ? 0 : window.innerHeight;
let scrollMax = 0;
let observing = false;

function measure() {
  viewport = window.innerHeight;
  scrollMax = document.documentElement.scrollHeight - viewport;
  tracked.forEach((geo, el) => {
    geo.top = el.getBoundingClientRect().top + window.scrollY;
    geo.height = el.offsetHeight;
  });
  listeners.forEach((fn) => fn());
}

// Every trigger (a section mounting, the body resizing as images load, fonts arriving) is
// coalesced into one measure at the start of the next frame, before any scroll-linked loop
// writes styles, so the geometry reads hit an up-to-date layout instead of forcing a new one
// per trigger during load.
let pendingMeasure = 0;
function scheduleMeasure() {
  if (pendingMeasure) return;
  pendingMeasure = requestAnimationFrame(() => {
    pendingMeasure = 0;
    measure();
  });
}

function observe() {
  if (observing) return;
  observing = true;
  new ResizeObserver(scheduleMeasure).observe(document.body);
  window.addEventListener("resize", scheduleMeasure);
  document.fonts?.ready.then(scheduleMeasure);
}

/** Cached page geometry, refreshed after any resize. Safe to read every frame. */
export const pageMetrics = () => ({ viewport, scrollMax });

/** Subscribe to geometry refreshes. Listeners run inside the measure pass, so layout reads
 *  there are cheap; don't write styles from them. */
export function onMeasure(fn: () => void) {
  observe();
  listeners.add(fn);
  scheduleMeasure();
  return () => listeners.delete(fn);
}

export type SectionFrame = {
  /** Same value getBoundingClientRect().top would return, without the layout read. */
  top: number;
  height: number;
  viewport: number;
  now: number;
};

/**
 * Calls `frame` every animation frame while the section is within one viewport of the
 * screen, plus one final frame after it leaves so its end state is applied.
 */
export function useSectionFrame(ref: RefObject<HTMLElement>, frame: (s: SectionFrame) => void) {
  const latest = useRef(frame);
  latest.current = frame;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const geo: Geo = { top: 0, height: 0 };
    tracked.set(el, geo);
    observe();
    scheduleMeasure();

    let visible = false;
    let raf = 0;
    const tick = (now: number) => {
      latest.current({ top: geo.top - window.scrollY, height: geo.height, viewport, now });
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!raf) raf = requestAnimationFrame(tick);
      },
      { rootMargin: "100% 0px" }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      tracked.delete(el);
    };
  }, [ref]);
}

export const progressOf = ({ top, height, viewport: vh }: SectionFrame) =>
  Math.min(Math.max(-top / Math.max(height - vh, 1), 0), 1);
