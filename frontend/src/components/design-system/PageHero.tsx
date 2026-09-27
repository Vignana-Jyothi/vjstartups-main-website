import { Fragment, ReactNode, useEffect, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "./page-hero.css";

type HeroAction = {
  label: string;
  to?: string;
  onClick?: () => void;
  variant?: "default" | "secondary" | "outline" | "ghost";
  icon?: LucideIcon;
};

type HeroStat = {
  value: string;
  label: string;
  icon?: LucideIcon;
};

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  stats?: HeroStat[];
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  backLink?: { label: string; to: string };
  backgroundClassName?: string;
  children?: ReactNode;
  /** Each page gets its own composition: left (default), centred, split (with `side`) or stack. */
  layout?: "left" | "center" | "split" | "stack";
  accent?: "lime" | "pink" | "violet";
  /** Left column for the split layout. */
  side?: ReactNode;
  /** Full-bleed band under the header, built from the page's own content. */
  signature?: ReactNode;
  /**
   * poster: the big uppercase statement for the main listing pages (default).
   * document: detail pages whose title is a sentence (a problem, an idea); set readable, in
   * sentence case, without the ghost word, so it reads as a record rather than a slogan.
   * tool: forms and utility pages; a compact header so the work starts on the first screen.
   */
  kind?: "poster" | "document" | "tool";
}

function splitTitle(title: string) {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return { lead: title, accent: "" };
  return { lead: words.slice(0, -1).join(" "), accent: words[words.length - 1] };
}

export function PageHero({
  eyebrow,
  title,
  description,
  stats,
  primaryAction,
  secondaryAction,
  backLink,
  backgroundClassName,
  children,
  layout = "left",
  accent: accentColor = "lime",
  side,
  signature,
  kind = "poster",
}: PageHeroProps) {
  const { lead, accent } = kind === "document" ? { lead: title, accent: "" } : splitTitle(title);

  useEffect(() => {
    document.title = `${title} — VJ Startups`;
  }, [title]);

  const renderAction = (action?: HeroAction) => {
    if (!action) return null;
    const button = (
      <Button size="lg" variant={action.variant || "default"} className="min-h-[44px]" onClick={action.onClick}>
        {action.icon && <action.icon className="h-4 w-4" aria-hidden="true" />}
        <span>{action.label}</span>
      </Button>
    );
    return action.to ? <Link to={action.to}>{button}</Link> : button;
  };

  return (
    <section className={cn("ph", `ph--${layout}`, `ph--${kind}`, backgroundClassName)} data-accent={accentColor}>
      {kind === "poster" && <div className="ph-ghost" aria-hidden="true">{title.split(/\s+/)[0]}</div>}

      <div className="ph-inner">
        <div className="ph-meta">
          {backLink ? (
            <Link to={backLink.to} className="ph-back">← Back / {backLink.label}</Link>
          ) : (
            <span className="ph-eyebrow">{eyebrow || "VJ Startups"}</span>
          )}
          <span>{backLink && eyebrow ? eyebrow : "VJ Startups / Hyderabad"}</span>
        </div>

        <div className="ph-split">
        {layout === "split" && <div className="ph-side">{side}</div>}
        <div className="ph-main">
        <h1 className="ph-title">
          <span className="sr-only">{title}</span>
          {lead.split(" ").map((word, i) => (
            <Fragment key={i}>
              <span className="ph-w" aria-hidden="true">
                <span style={{ "--i": i } as CSSProperties}>{word}</span>
              </span>{" "}
            </Fragment>
          ))}
          {accent && (
            <span className="ph-w" aria-hidden="true">
              <em style={{ "--i": lead.split(" ").length } as CSSProperties}>{accent}</em>
            </span>
          )}
        </h1>

        <div className="ph-foot">
          <p className="ph-desc">{description}</p>
          {(primaryAction || secondaryAction) && (
            <div className="ph-actions">
              {renderAction(primaryAction)}
              {renderAction(secondaryAction)}
            </div>
          )}
        </div>
        </div>
        </div>

        {stats && stats.length > 0 && (
          <dl className="ph-stats">
            {stats.map((stat, i) => (
              <div key={stat.label}>
                <dt><span>{String(i + 1).padStart(2, "0")}</span>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {children && <div className="ph-extra">{children}</div>}
      </div>
      {signature && <div className="ph-signature">{signature}</div>}
    </section>
  );
}
