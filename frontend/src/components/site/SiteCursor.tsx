import { useEffect, useRef } from "react";
import "./cursor.css";

// The landing's cursor language carried onto the platform pages: an exact dot plus a trailing
// ring that grows over interactive elements and becomes an "Open" blob over cards. Mouse and
// trackpad only; the native cursor returns over text fields so editing stays precise.
const TEXT = "input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]),textarea,select,[contenteditable='true'],[role=textbox]";
const CARD = ".lx-card";
const ACTIVE = "a,button,[role=tab],[role=button],label,summary,.lx-tag";

export function SiteCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-site-cursor");

    const target = { x: -100, y: -100 };
    const trail = { x: -100, y: -100 };
    let raf = 0;
    let mode = "";

    const loop = () => {
      trail.x += (target.x - trail.x) * 0.22;
      trail.y += (target.y - trail.y) * 0.22;
      if (ring.current) ring.current.style.transform = `translate3d(${trail.x}px,${trail.y}px,0) translate(-50%,-50%)`;
      const settled = Math.abs(target.x - trail.x) < 0.1 && Math.abs(target.y - trail.y) < 0.1;
      raf = settled ? 0 : requestAnimationFrame(loop);
    };

    const setMode = (next: string) => {
      if (next === mode) return;
      mode = next;
      root.dataset.cursor = next;
    };

    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0) translate(-50%,-50%)`;
      const el = e.target as Element | null;
      const control = el?.closest(ACTIVE);
      const card = el?.closest(CARD);
      // A card's own full-size link overlay reads as "Open"; real controls inside it (upvote,
      // author links) keep the regular interactive state.
      const onCard = card && (!control || control.classList.contains("lx-card-link") || !card.contains(control));
      setMode(el?.closest(TEXT) ? "text" : onCard ? "card" : control ? "active" : "idle");
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const leave = () => setMode("hidden");

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
      root.classList.remove("has-site-cursor");
      delete root.dataset.cursor;
    };
  }, []);

  return (
    <>
      <div ref={ring} className="scu-ring" aria-hidden="true">
        <span>Open</span>
      </div>
      <div ref={dot} className="scu-dot" aria-hidden="true" />
    </>
  );
}
