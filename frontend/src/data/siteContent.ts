import { useSyncExternalStore } from "react";
import { API_BASE } from "@/config/api";
import builtInJson from "./builtInContent.json";
import type { StartupProgram } from "./startupPrograms";

// The site's editable content: programs, funded ventures, the club's wings, text and numbers,
// and the home page's Signals. It lives in the database (/content-api) and is edited at /manage
// by admins and wing masters.
//
// Pages render straight away from the last copy this browser saw, or on a first visit from
// builtInContent.json (the content as it was seeded), then switch to the live copy when it
// arrives, which is normally identical. If the API can't be reached they keep the copy they have.

export type Venture = { id: string; name: string; sector: string; description: string; imageUrl?: string; website?: string };

export type SubWing = {
  id: string;
  name: string;
  description: string;
  status: "active" | "planned" | "completed";
  edition?: number;
  currentActivity?: string;
  achievements?: string[];
};

export type Wing = {
  id: string;
  name: string;
  description: string;
  purpose?: string;
  focusAreas?: string[];
  achievements?: string[];
  currentProjects?: string[];
  subWings?: SubWing[];
};

export type ClubStat = { value: string; label: string };
export type Club = { id: string; name: string; tagline: string; description: string; mission: string; vision: string; stats: ClubStat[] };
export type Signal = { id: string; value: string; title: string; note?: string };

export type SiteContent = {
  programs: StartupProgram[];
  ventures: Venture[];
  wings: Wing[];
  signals: Signal[];
  club: Club;
};

export type ContentKind = "program" | "venture" | "wing" | "club" | "signal";

/** What editors get back from /manage: every item, hidden ones too, with its state. */
export type Managed<T> = T & { isPublished: boolean; sortOrder: number; updatedByName?: string; updatedAt?: string };

export const builtInContent = builtInJson as unknown as SiteContent;

const STORAGE_KEY = "vj-site-content";

const isContent = (v: any): v is SiteContent =>
  !!v && Array.isArray(v.programs) && Array.isArray(v.ventures) && Array.isArray(v.wings) && Array.isArray(v.signals) && !!v.club;

function stored(): SiteContent | null {
  try {
    const v = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return isContent(v) ? v : null;
  } catch {
    return null;
  }
}

let current: SiteContent = stored() ?? builtInContent;
let loading: Promise<void> | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function load(force = false) {
  if ((loaded && !force) || loading) return loading;
  loading = fetch(`${API_BASE}/content-api`, { cache: force ? "no-store" : "default" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!isContent(data)) return;
      const { programs, ventures, wings, signals, club } = data;
      current = { programs, ventures, wings, signals, club };
      loaded = true;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      } catch {
        // Private mode or storage full: the next visit starts from the built-in copy.
      }
      listeners.forEach((fn) => fn());
    })
    .catch(() => undefined)
    .finally(() => {
      loading = null;
    });
  return loading;
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  load();
  return () => listeners.delete(fn);
}

export function useSiteContent(): SiteContent {
  return useSyncExternalStore(subscribe, () => current, () => current);
}

/** The content as it stands, for code outside components (it doesn't re-render on changes). */
export const siteContentNow = () => current;

// ---- Editing (admins and wing masters; the backend checks the role again) ------------------------

export const canEditContent = (role?: string) => role === "admin" || role === "wing_master";

async function send<T>(token: string, method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}/content-api${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) throw new Error(data.message || `Request failed (${res.status})`);
  if (method !== "GET") load(true);
  return data;
}

export type ManagedContent = {
  programs: Managed<StartupProgram>[];
  ventures: Managed<Venture>[];
  wings: Managed<Wing>[];
  signals: Managed<Signal>[];
  club: Managed<Club> | null;
};

export const fetchManagedContent = (token: string) => send<ManagedContent>(token, "GET", "/manage");

export const saveContent = (token: string, kind: ContentKind, id: string, item: object) =>
  send(token, "PUT", `/${kind}/${encodeURIComponent(id)}`, item);

export const setContentPublished = (token: string, kind: ContentKind, id: string, isPublished: boolean) =>
  send(token, "PATCH", `/${kind}/${encodeURIComponent(id)}`, { isPublished });

export const reorderContent = (token: string, kind: ContentKind, ids: string[]) => send(token, "POST", `/${kind}/order`, { slugs: ids });

export async function uploadContentImage(token: string, file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`${API_BASE}/content-api/upload`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.message || "Image upload failed");
  return data.url;
}

/** A readable id from a title: "Startup Challenge" -> "startup-challenge". */
export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_-]+/g, "-").slice(0, 70).replace(/-+$/, "");
