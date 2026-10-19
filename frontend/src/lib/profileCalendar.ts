// Lays a member's contribution calendar out as a GitHub-style grid: weeks as columns (Sunday
// first), days as rows. VJOS sends only the days that had activity plus the date range, so the
// empty days are filled in here. All date maths is done on calendar dates in UTC so the result
// never depends on the viewer's time zone.

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: number; // 0-4, relative to the member's busiest day
  completed?: number;
  created?: number;
  comments?: number;
  pages?: number;
}

export interface CalendarCell {
  date: string;
  count: number;
  level: number;
  inRange: boolean;
  day?: CalendarDay;
}

export interface MonthLabel {
  label: string;
  week: number; // column index
}

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parse(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function format(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** Weeks (columns) of 7 cells each, from the Sunday on or before `from` to the Saturday on or after `to`. */
export function buildWeeks(range: { from: string; to: string }, days: CalendarDay[]) {
  const start = parse(range.from);
  const end = parse(range.to);
  const byDate = new Map(days.map((d) => [d.date, d]));

  const firstSunday = start - new Date(start).getUTCDay() * DAY_MS;
  const lastSaturday = end + (6 - new Date(end).getUTCDay()) * DAY_MS;

  const weeks: CalendarCell[][] = [];
  for (let weekStart = firstSunday; weekStart <= lastSaturday; weekStart += 7 * DAY_MS) {
    const week: CalendarCell[] = [];
    for (let i = 0; i < 7; i++) {
      const ms = weekStart + i * DAY_MS;
      const date = format(ms);
      const inRange = ms >= start && ms <= end;
      const day = inRange ? byDate.get(date) : undefined;
      week.push({ date, count: day?.count ?? 0, level: day?.level ?? 0, inRange, day });
    }
    weeks.push(week);
  }
  return { weeks, months: monthLabels(weeks) };
}

/** A label above the first week of each month, skipping one that would sit on top of the next. */
export function monthLabels(weeks: CalendarCell[][]): MonthLabel[] {
  const labels: MonthLabel[] = [];
  let lastMonth = -1;
  weeks.forEach((week, index) => {
    const first = week.find((c) => c.inRange);
    if (!first) return;
    const month = new Date(parse(first.date)).getUTCMonth();
    if (month !== lastMonth) {
      labels.push({ label: MONTHS[month], week: index });
      lastMonth = month;
    }
  });
  // The calendar rarely starts on the 1st: drop a first label that would crowd the second.
  if (labels.length > 1 && labels[1].week - labels[0].week < 3) labels.shift();
  return labels;
}

/** "3 contributions on 18 Oct 2026" / "No contributions on 18 Oct 2026" */
export function describeCell(cell: CalendarCell): string {
  const [y, m, d] = cell.date.split("-").map(Number);
  const when = `${d} ${MONTHS[m - 1]} ${y}`;
  if (!cell.count) return `No contributions on ${when}`;
  const parts: string[] = [];
  const day = cell.day;
  if (day?.completed) parts.push(`${day.completed} completed`);
  if (day?.created) parts.push(`${day.created} created`);
  if (day?.comments) parts.push(`${day.comments} comment${day.comments === 1 ? "" : "s"}`);
  if (day?.pages) parts.push(`${day.pages} page${day.pages === 1 ? "" : "s"}`);
  const detail = parts.length ? ` (${parts.join(", ")})` : "";
  return `${cell.count} contribution${cell.count === 1 ? "" : "s"} on ${when}${detail}`;
}

/** Only web addresses are linked from a profile; anything else (javascript:, data:) is dropped. */
export function safeUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}
