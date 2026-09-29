import { useEffect, useRef, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import "@/components/design-system/listing.css";
import "./not-found.css";

const NotFound = () => {
  const { pathname } = useLocation();
  const stage = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = "Not built yet — VJ Startups";
  }, [pathname]);

  // The outlined 404 leans toward the pointer (fine pointers only).
  useEffect(() => {
    const el = stage.current;
    if (!el || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const move = (e: PointerEvent) => {
      el.style.setProperty("--nx", String(e.clientX / window.innerWidth - 0.5));
      el.style.setProperty("--ny", String(e.clientY / window.innerHeight - 0.5));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <section ref={stage} className="nf lx" style={{ "--lx-accent": "var(--lime)" } as CSSProperties}>
      <div className="nf-code" aria-hidden="true">404</div>
      <div className="nf-inner">
        <div className="nf-meta">
          <span>Error / 404</span>
          <span className="nf-path">{pathname}</span>
        </div>
        <h1>
          Not built <em>yet.</em>
        </h1>
        <p>
          Every startup on this platform began as something missing. This page is still one of them.
        </p>
        <div className="lx-gate-actions">
          <Link to="/" className="lx-cta">Back home ↗</Link>
          <Link to="/problems" className="lx-textbtn">Browse real problems ↗</Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
