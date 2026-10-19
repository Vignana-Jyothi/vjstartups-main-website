import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE } from "@/config/api";
import { buildWeeks, describeCell, initials, safeUrl, type CalendarDay } from "@/lib/profileCalendar";

interface Badge {
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  awarded_at: string;
}

interface PublicProfile {
  handle: string;
  name: string;
  headline: string;
  bio: string;
  photo_url: string;
  role: string;
  member_stage: string;
  is_club_member: boolean;
  wing: { name: string; slug: string } | null;
  joined_at: string;
  skills: string[];
  links: { github: string; linkedin: string; portfolio: string };
  reputation: {
    score: number;
    rank: number;
    execution: number;
    impact: number;
    leadership: number;
    learning: number;
    reliability: number;
  };
  badges: Badge[];
  startups: { name: string; slug: string; role: string }[];
  recent_work: { title: string; project: string; completed_at: string }[];
  activity: {
    range: { from: string; to: string };
    timezone: string;
    total: number;
    active_days: number;
    max_daily: number;
    current_streak: number;
    longest_streak: number;
    breakdown: { completed: number; created: number; comments: number; pages: number };
    days: CalendarDay[];
  };
}

type State =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "error" }
  | { kind: "ready"; profile: PublicProfile };

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT = 28; // room for the weekday labels
const TOP = 18; // room for the month labels

// Level 0 is the card's own muted colour; 1-4 are the brand colour at rising strength.
const levelFill = (level: number) =>
  level <= 0 ? "hsl(var(--muted-foreground) / 0.14)" : `hsl(var(--primary) / ${[0, 0.28, 0.5, 0.75, 1][Math.min(level, 4)]})`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const stage = (value: string) => value.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-2xl font-semibold text-foreground">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}

function Heatmap({ activity }: { activity: PublicProfile["activity"] }) {
  const { weeks, months } = useMemo(() => buildWeeks(activity.range, activity.days), [activity]);
  const width = LEFT + weeks.length * STEP;
  const height = TOP + 7 * STEP;

  return (
    <div className="overflow-x-auto pb-2">
      <svg width={width} height={height} role="img" aria-label={`${activity.total} contributions in the last year`}>
        {months.map((m) => (
          <text key={`${m.label}-${m.week}`} x={LEFT + m.week * STEP} y={11} fontSize={10} fill="hsl(var(--muted-foreground))">
            {m.label}
          </text>
        ))}
        {["Mon", "Wed", "Fri"].map((d, i) => (
          <text key={d} x={0} y={TOP + (i * 2 + 1) * STEP + 9} fontSize={10} fill="hsl(var(--muted-foreground))">
            {d}
          </text>
        ))}
        {weeks.map((week, w) =>
          week.map((cell, d) =>
            cell.inRange ? (
              <rect
                key={cell.date}
                x={LEFT + w * STEP}
                y={TOP + d * STEP}
                width={CELL}
                height={CELL}
                rx={2}
                fill={levelFill(cell.level)}
              >
                <title>{describeCell(cell)}</title>
              </rect>
            ) : null,
          ),
        )}
      </svg>
      <div className="mt-2 flex items-center justify-end gap-1 text-xs text-muted-foreground">
        Less
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className="inline-block h-[11px] w-[11px] rounded-sm" style={{ background: levelFill(l) }} />
        ))}
        More
      </div>
    </div>
  );
}

const MemberProfile = () => {
  const { handle = "" } = useParams();
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ kind: "loading" });
    // Read through the site's backend, which fetches the profile from VJOS server-to-server.
    fetch(`${API_BASE}/profile-api/${encodeURIComponent(handle)}`)
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 404) return setState({ kind: "missing" });
        if (!res.ok) return setState({ kind: "error" });
        const data = await res.json();
        setState(data?.profile ? { kind: "ready", profile: data.profile as PublicProfile } : { kind: "error" });
      })
      .catch(() => !cancelled && setState({ kind: "error" }));
    return () => {
      cancelled = true;
    };
  }, [handle]);

  useEffect(() => {
    const previous = document.title;
    document.title =
      state.kind === "ready" ? `${state.profile.name} (@${state.profile.handle}) — VJ Startups` : "Member profile — VJ Startups";
    return () => {
      document.title = previous;
    };
  }, [state]);

  if (state.kind === "loading") {
    return <div className="page-shell mx-auto max-w-5xl px-4 py-16 text-muted-foreground">Loading profile…</div>;
  }

  if (state.kind === "missing" || state.kind === "error") {
    return (
      <div className="page-shell mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          {state.kind === "missing" ? "This profile isn't available" : "Couldn't load this profile"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {state.kind === "missing"
            ? "It doesn't exist, or its owner hasn't made it public."
            : "Please try again in a moment."}
        </p>
        <Link to="/leaderboard" className="mt-6 inline-block text-primary hover:underline">
          Back to the leaderboard
        </Link>
      </div>
    );
  }

  const p = state.profile;
  const a = p.activity;
  const links = [
    ["GitHub", safeUrl(p.links.github)],
    ["LinkedIn", safeUrl(p.links.linkedin)],
    ["Portfolio", safeUrl(p.links.portfolio)],
  ].filter((l): l is [string, string] => !!l[1]);
  const photo = safeUrl(p.photo_url);

  return (
    <div className="page-shell mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6">
          <div>
            {photo ? (
              <img src={photo} alt={p.name} className="h-40 w-40 rounded-full border border-border object-cover" />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-full border border-border bg-muted text-4xl font-semibold text-muted-foreground">
                {initials(p.name)}
              </div>
            )}
            <h1 className="mt-4 text-2xl font-semibold text-foreground">{p.name}</h1>
            <div className="text-muted-foreground">@{p.handle}</div>
            {p.headline && <p className="mt-2 text-sm text-foreground">{p.headline}</p>}
          </div>

          {p.bio && <p className="whitespace-pre-line text-sm text-foreground">{p.bio}</p>}

          <ul className="space-y-1 text-sm text-muted-foreground">
            {p.wing && <li>Wing: <span className="text-foreground">{p.wing.name}</span></li>}
            {p.role && <li>Role: <span className="text-foreground">{p.role}</span></li>}
            <li>Stage: <span className="text-foreground">{stage(p.member_stage)}</span></li>
            <li>Joined {formatDate(p.joined_at)}</li>
          </ul>

          {links.length > 0 && (
            <ul className="space-y-1 text-sm">
              {links.map(([label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {p.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {p.skills.map((s) => (
                <span key={s} className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground">
                  {s}
                </span>
              ))}
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Reputation</div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-foreground">{p.reputation.score}</span>
              <span className="text-sm text-muted-foreground">Rank #{p.reputation.rank}</span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {(
                [
                  ["Execution", p.reputation.execution],
                  ["Impact", p.reputation.impact],
                  ["Leadership", p.reputation.leadership],
                  ["Learning", p.reputation.learning],
                  ["Reliability", p.reputation.reliability],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <dt>{label}</dt>
                  <dd className="text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>

        <main className="min-w-0 space-y-8">
          <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat label="Contributions (1 yr)" value={a.total} />
            <Stat label="Active days" value={a.active_days} />
            <Stat label="Current streak" value={`${a.current_streak}d`} />
            <Stat label="Longest streak" value={`${a.longest_streak}d`} />
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-medium text-foreground">
              {a.total} contribution{a.total === 1 ? "" : "s"} in the last year
            </h2>
            <Heatmap activity={a} />
            <p className="mt-3 text-xs text-muted-foreground">
              {a.breakdown.completed} tasks completed · {a.breakdown.created} created · {a.breakdown.comments} comments ·{" "}
              {a.breakdown.pages} pages. Counted on VJOS, in {a.timezone.replace("_", " ")} time.
            </p>
          </section>

          {p.badges.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-medium text-foreground">Badges</h2>
              <div className="flex flex-wrap gap-3">
                {p.badges.map((b) => (
                  <div key={b.slug} title={b.description} className="rounded-lg border border-border bg-card px-4 py-2 text-sm">
                    <div className="font-medium text-foreground">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(b.awarded_at)}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {p.startups.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-medium text-foreground">Startups</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {p.startups.map((s) => (
                  <li key={s.slug} className="rounded-lg border border-border bg-card px-4 py-3">
                    <div className="font-medium text-foreground">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.role}</div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {p.recent_work.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-medium text-foreground">Recent work</h2>
              <ul className="divide-y divide-border rounded-xl border border-border bg-card">
                {p.recent_work.map((w, i) => (
                  <li key={`${w.completed_at}-${i}`} className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm">
                    <span className="text-foreground">
                      {w.title} <span className="text-muted-foreground">· {w.project}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatDate(w.completed_at)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default MemberProfile;
