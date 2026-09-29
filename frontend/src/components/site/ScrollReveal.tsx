import { useEffect } from "react";
import "./motion.css";

// Content blocks on platform pages rise in as they enter the viewport, a few at a time.
// Works for content rendered later (API data, filters) through a MutationObserver. If React
// rewrites an element's className the reveal classes drop and the element simply shows,
// so the failure mode is "visible", never "stuck hidden".
const SELECTOR = [
  ".lx-card",
  ".lx-sec-head",
  ".lx-toolbar",
  ".lx-lead",
  ".lx-pair > .lx-field",
  ".lx-gate",
  ".lx-empty",
  ".lb-row",
  ".cl-wing",
  ".cl-team-title",
  ".cl-member",
  ".st-outcome",
  ".st-quote",
  ".st-side > *",
].join(",");

export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.querySelector("main");
    if (!main) return;

    const io = new IntersectionObserver(
      (entries) => {
        let order = 0;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.style.setProperty("--rv-delay", `${Math.min(order++, 6) * 70}ms`);
          el.classList.add("rv-in");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -6% 0px" }
    );

    const track = (el: Element) => {
      if (el.classList.contains("rv")) return;
      el.classList.add("rv");
      io.observe(el);
    };
    const scan = (root: Element) => {
      if (root.matches(SELECTOR)) track(root);
      root.querySelectorAll(SELECTOR).forEach(track);
    };

    scan(main);
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) => m.addedNodes.forEach((n) => n instanceof Element && scan(n)));
    });
    mo.observe(main, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
