import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./transition.css";

// Route-level curtain: an ink panel carrying the brand mark and the destination's name covers
// the page, the route changes underneath, and the panel lifts once the new page has rendered.
// Only same-origin link clicks get the curtain; back/forward and programmatic navigation stay
// instant, as do links marked data-no-transition (e.g. ones carrying router state).
// Skipped entirely for people who prefer reduced motion.

const LABELS: [RegExp, string][] = [
  [/^\/$/, "Home"],
  [/^\/problems\/[^/]+/, "Problem"],
  [/^\/problems/, "Problems"],
  [/^\/submit-problem/, "New problem"],
  [/^\/ideas\/[^/]+/, "Idea"],
  [/^\/ideas/, "Ideas"],
  [/^\/submit-idea/, "New idea"],
  [/^\/idea-validation/, "Validate"],
  [/^\/stories/, "Stories"],
  [/^\/programs\/[^/]+\/success-stories\/[^/]+/, "Story"],
  [/^\/programs\/[^/]+\/success-stories/, "Stories"],
  [/^\/programs\/[^/]+/, "Program"],
  [/^\/programs/, "Programs"],
  [/^\/startups\/[^/]+/, "Startup"],
  [/^\/startups/, "Startups"],
  [/^\/startup-form/, "New startup"],
  [/^\/club/, "Club"],
  [/^\/journey/, "Journey"],
  [/^\/leaderboard/, "Leaders"],
  [/^\/changes/, "Progress"],
  [/^\/login/, "Welcome"],
  [/^\/privacy/, "Privacy"],
  [/^\/terms/, "Terms"],
];

const labelFor = (path: string) => LABELS.find(([re]) => re.test(path))?.[1] ?? "VJ Startups";

const COVER_MS = 420;
const MAX_WAIT_MS = 2500;

type Phase = "idle" | "cover" | "hold" | "reveal";

export function PageTransition() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");
  const pending = useRef<string | null>(null);
  const busy = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onClick = (e: MouseEvent) => {
      if (reduced.matches || busy.current || e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download") || anchor.hasAttribute("data-no-transition")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page (incl. #hash jumps)

      e.preventDefault();
      busy.current = true;
      pending.current = url.pathname + url.search + url.hash;
      setLabel(labelFor(url.pathname));
      setPhase("cover");
      window.setTimeout(() => {
        setPhase("hold");
        navigate(pending.current!);
      }, COVER_MS);
    };

    // Capture phase so this runs before react-router's Link handler, which then sees
    // defaultPrevented and leaves the navigation to us.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigate]);

  // While the curtain is down, entrance animations on the new page wait (see page-hero.css
  // and motion.css) so they play as it lifts rather than behind it.
  useEffect(() => {
    document.documentElement.classList.toggle("pt-busy", phase === "cover" || phase === "hold");
  }, [phase]);

  // Lift the curtain once the destination has rendered (lazy routes show an aria-busy
  // fallback until their chunk arrives).
  useEffect(() => {
    if (phase !== "hold") return;
    const started = performance.now();
    let raf = 0;
    const check = () => {
      const loading = document.querySelector('main [aria-busy="true"]');
      if (!loading || performance.now() - started > MAX_WAIT_MS) {
        setPhase("reveal");
        window.setTimeout(() => {
          setPhase("idle");
          busy.current = false;
        }, 700);
        return;
      }
      raf = requestAnimationFrame(check);
    };
    raf = requestAnimationFrame(() => requestAnimationFrame(check));
    return () => cancelAnimationFrame(raf);
  }, [phase, pathname]);

  if (phase === "idle") return null;

  return (
    <div className={`pt pt-${phase}`} aria-hidden="true">
      <div className="pt-panel">
        <div className="pt-mark">
          <i /><i /><i /><i /><i /><i />
        </div>
        <div className="pt-label">{label}</div>
        <div className="pt-meta">
          <span>VJ Startups</span>
          <span>Loading</span>
        </div>
      </div>
    </div>
  );
}
