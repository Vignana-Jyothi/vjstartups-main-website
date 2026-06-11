const FUNDING_STATUS_LABELS: Record<string, string> = {
  bootstrapped: "Bootstrapped",
  "seeking-funding": "Seeking Funding",
  "pre-seed": "Pre-Seed",
  seed: "Seed",
  "series-a": "Series A",
  "later-stage": "Later Stage",
};

export function formatFundingStatus(status?: string): string {
  if (!status) return "Not specified";
  return FUNDING_STATUS_LABELS[status] ?? status.replace(/-/g, " ");
}

export function truncateText(text: string, maxLength = 160): string {
  if (!text || text.length <= maxLength) return text || "";
  return `${text.slice(0, maxLength).trim()}…`;
}

export function getStartupImageUrl(path?: string): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${import.meta.env.VITE_API_BASE_URL}${path}`;
}

export const FUNDING_FILTER_OPTIONS = [
  { value: "all", label: "All funding stages" },
  { value: "bootstrapped", label: "Bootstrapped" },
  { value: "seeking-funding", label: "Seeking Funding" },
  { value: "pre-seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "series-a", label: "Series A" },
  { value: "later-stage", label: "Later Stage" },
] as const;

export const STAGE_FILTER_OPTIONS = [
  { value: "4", label: "Prototype and above" },
  { value: "1", label: "All stages" },
  { value: "5", label: "MVP and above" },
  { value: "7", label: "Launch and above" },
] as const;
