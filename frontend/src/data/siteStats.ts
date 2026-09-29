import { useEffect, useState } from "react";

// The site's headline numbers, counted by the backend from the database (/stats-api). They used
// to be typed into the code ("36 startups / 88 future builders / 9 funded"). Until they arrive,
// or if the API can't be reached, the hook returns null and the numbers simply aren't shown.
export type SiteStats = {
  problems: number;
  ideas: number;
  startups: number;
  fundedStartups: number;
  builders: number;
};

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:6220";
let cached: SiteStats | null = null;
let pending: Promise<SiteStats | null> | null = null;

function loadStats(): Promise<SiteStats | null> {
  pending ??= fetch(`${API}/stats-api`)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!data?.success) return null;
      const { problems, ideas, startups, fundedStartups, builders } = data;
      cached = { problems, ideas, startups, fundedStartups, builders };
      return cached;
    })
    .catch(() => null)
    .finally(() => {
      pending = null;
    });
  return pending;
}

export function useSiteStats(): SiteStats | null {
  const [stats, setStats] = useState<SiteStats | null>(cached);
  useEffect(() => {
    if (cached) return;
    let live = true;
    loadStats().then((s) => live && setStats(s));
    return () => {
      live = false;
    };
  }, []);
  return stats;
}
