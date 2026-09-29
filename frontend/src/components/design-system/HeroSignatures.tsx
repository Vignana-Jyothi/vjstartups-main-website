import { Fragment } from "react";
import { Link } from "react-router-dom";
import "./hero-signatures.css";

// Signature bands for the platform page headers. Each is built from that page's own content,
// so the pages share one system without sharing one face.

type MarqueeItem = { title: string; href: string };

/** Problems: two slow counter-moving rows of real problem titles, each one a link. */
export function TitleMarquee({ items }: { items: MarqueeItem[] }) {
  if (items.length < 6) return null;
  const half = Math.ceil(items.length / 2);
  const rows = [items.slice(0, half), items.slice(half)];
  return (
    <div className="hs-marquee" aria-label="Problems posted by students">
      {rows.map((row, r) => (
        <div key={r} className={`hs-marquee-row${r ? " is-reverse" : ""}`} style={{ animationDuration: `${Math.max(row.length * 7, 60)}s` }}>
          {/* Rendered twice so the loop is seamless; the copy is hidden from assistive tech. */}
          {[0, 1].map((copy) => (
            <div key={copy} className="hs-marquee-set" aria-hidden={copy === 1}>
              {row.map((item) => (
                <Fragment key={item.href}>
                  <Link to={item.href} tabIndex={copy === 1 ? -1 : undefined}>{item.title}</Link>
                  <i aria-hidden="true" />
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Ideas: the count itself as the page's figure. */
export function BigCount({ value, label }: { value: number; label: string }) {
  return (
    <div className="hs-count">
      <b>{String(value).padStart(2, "0")}</b>
      <span>{label}</span>
    </div>
  );
}

/** Startups: readiness stages drawn in the logo's bars; each bar's height is how many real
 *  startups sit at that stage. */
export function StageSignal({ counts, activeStage }: { counts: number[]; activeStage?: number }) {
  // An empty chart reads as broken; it appears once there are startups to plot.
  if (!counts.some(Boolean)) return null;
  const max = Math.max(...counts, 1);
  return (
    <div className="hs-signal" role="img" aria-label={`Startups by readiness stage: ${counts.map((c, i) => `stage ${i + 1}: ${c}`).join(", ")}`}>
      {counts.map((count, i) => (
        <div key={i} className={`hs-signal-col${activeStage === i + 1 ? " is-on" : ""}`}>
          <small>{count || ""}</small>
          <i style={{ height: `${12 + (count / max) * 120}px` }} />
          <span>TRL {i + 1}</span>
        </div>
      ))}
    </div>
  );
}

type StripItem = { id: string; title: string; meta: string; status: "active" | "planned" | "completed" };

/** Programs: every program on one line with its status, like a departures board. */
export function ProgramStrip({ items }: { items: StripItem[] }) {
  return (
    <div className="hs-strip">
      {items.map((item) => (
        <Link key={item.id} to={`/programs/${item.id}`} className={`hs-strip-item is-${item.status}`}>
          <span>{item.status}</span>
          <b>{item.title}</b>
          <small>{item.meta}</small>
        </Link>
      ))}
    </div>
  );
}

/** Club: the eight wings as one running line; each name opens that wing. */
export function WordLine({ words, onPick }: { words: { id: string; label: string }[]; onPick: (id: string) => void }) {
  return (
    <div className="hs-words">
      <div className="hs-words-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="hs-words-set" aria-hidden={copy === 1}>
            {words.map((word, i) => (
              <button key={word.id} type="button" className={i % 2 ? "is-outline" : ""} onClick={() => onPick(word.id)} tabIndex={copy === 1 ? -1 : undefined}>
                {word.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
