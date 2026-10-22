import { useEffect, useState } from "react";
import { API_BASE } from "@/config/api";

// Deployment settings the browser needs, served by the backend (/auth/config) so they're set
// once, on the server, instead of being baked into the build: the Google client id (the same one
// the backend checks sign-ins against), the VJOS admin link and the ecosystem site link. Null until
// loaded; on failure all are null, which hides both links and tells the login page sign-in isn't
// available.
export type SiteConfig = { googleClientId: string | null; planeAdminUrl: string | null; ecosystemUrl: string | null };

const EMPTY: SiteConfig = { googleClientId: null, planeAdminUrl: null, ecosystemUrl: null };
let cached: SiteConfig | null = null;
let pending: Promise<SiteConfig> | null = null;

function loadConfig(): Promise<SiteConfig> {
  pending ??= fetch(`${API_BASE}/auth/config`)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      cached = data?.success
        ? { googleClientId: data.googleClientId || null, planeAdminUrl: data.planeAdminUrl || null, ecosystemUrl: data.ecosystemUrl || null }
        : EMPTY;
      return cached;
    })
    .catch(() => EMPTY)
    .finally(() => {
      pending = null;
    });
  return pending;
}

export function useSiteConfig(): SiteConfig | null {
  const [config, setConfig] = useState<SiteConfig | null>(cached);
  useEffect(() => {
    if (cached) return;
    let live = true;
    loadConfig().then((c) => live && setConfig(c));
    return () => {
      live = false;
    };
  }, []);
  return config;
}
