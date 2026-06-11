import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  align?: "center" | "left";
  children?: ReactNode;
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
  align = "center",
  children,
}: PageHeroProps) {
  const alignmentClass = align === "left" ? "text-left items-start" : "text-center items-center";

  const renderAction = (action?: HeroAction, className?: string) => {
    if (!action) return null;

    const button = (
      <Button size="lg" variant={action.variant || "default"} className={cn("group", className)} onClick={action.onClick}>
        {action.icon && <action.icon className="h-4 w-4" aria-hidden="true" />}
        <span>{action.label}</span>
      </Button>
    );

    return action.to ? <Link to={action.to}>{button}</Link> : button;
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-vj-border bg-[hsl(var(--background-secondary))]",
        backgroundClassName
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_55%)]" />
      <div className="pointer-events-none absolute -left-20 top-16 h-56 w-56 rounded-full bg-vj-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-vj-accent/5 blur-3xl" />

      <div className="section-container relative px-4 py-16 md:py-24">
        <div className={cn("mx-auto flex max-w-4xl flex-col gap-6", alignmentClass)}>
          {backLink && (
            <Link
              to={backLink.to}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-vj-button border border-vj-border bg-vj-surface px-4 text-sm font-medium text-vj-primary shadow-[var(--vj-shadow-subtle)] transition-all duration-200 hover:-translate-y-0.5 hover:border-vj-accent hover:text-vj-accent"
            >
              <span>Back</span>
              <span className="text-vj-muted">/</span>
              <span>{backLink.label}</span>
            </Link>
          )}

          {eyebrow && (
            <div className="inline-flex items-center gap-2 rounded-full border border-vj-accent/15 bg-vj-accent-light px-4 py-2 text-sm font-medium text-vj-accent animate-scale-in">
              <span className="h-2 w-2 rounded-full bg-vj-accent" />
              <span>{eyebrow}</span>
            </div>
          )}

          <div className="space-y-4">
            <h1 className="hero-title">{title}</h1>
            <p className="mx-auto max-w-3xl body-text text-vj-muted">{description}</p>
          </div>

          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col gap-3 sm:flex-row">
              {renderAction(primaryAction)}
              {renderAction(secondaryAction, secondaryAction?.variant === "ghost" ? "px-2" : undefined)}
            </div>
          )}

          {stats && stats.length > 0 && (
            <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="vj-card-minimal p-5 text-left">
                    <div className="flex items-center gap-3">
                      {Icon && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-vj-button bg-vj-accent-light text-vj-accent">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                      )}
                      <div>
                        <p className="text-2xl font-bold text-vj-primary">{stat.value}</p>
                        <p className="text-sm text-vj-muted">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}