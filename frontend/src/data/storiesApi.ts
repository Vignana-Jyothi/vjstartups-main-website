import { useEffect, useState } from "react";
import { API_BASE } from "@/config/api";
import { successStories as builtIn, type SuccessStory } from "./successStories";

// Success stories come from the backend (/story-api), written up by admins and wing masters at
// /stories/new. If the API can't be reached, the pages fall back to the built-in record in
// successStories.ts (Veda's story, which is also the first row in the database) instead of
// showing nothing. The landing page's story section reads that built-in record directly.

export type StoryDraft = Omit<SuccessStory, "id" | "contentType" | "pdfUrl" | "pdfDescription">;

type Status = "loading" | "ready" | "fallback";

const cache = new Map<string, SuccessStory[]>();

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/story-api${path}`);
  if (!res.ok) {
    // The stories API answers "not found" in JSON; a backend without the API gives Express's
    // HTML 404 instead. Only the first means the story really isn't there.
    const fromApi = (res.headers.get("content-type") || "").includes("application/json");
    throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status, fromApi });
  }
  return res.json();
}

export function useStories(programId?: string) {
  const key = programId || "*";
  const [state, setState] = useState<{ stories: SuccessStory[]; status: Status }>(() =>
    cache.has(key) ? { stories: cache.get(key)!, status: "ready" } : { stories: [], status: "loading" },
  );
  useEffect(() => {
    let live = true;
    getJSON<{ stories: SuccessStory[] }>(`/stories${programId ? `?programId=${encodeURIComponent(programId)}` : ""}`)
      .then(({ stories }) => {
        cache.set(key, stories);
        if (live) setState({ stories, status: "ready" });
      })
      .catch(() => {
        if (live) setState({ stories: builtIn.filter((s) => !programId || s.programId === programId), status: "fallback" });
      });
    return () => {
      live = false;
    };
  }, [key, programId]);
  return state;
}

export function useStory(id?: string) {
  const [state, setState] = useState<{ story?: SuccessStory; status: Status | "missing" }>({ status: "loading" });
  useEffect(() => {
    if (!id) return;
    let live = true;
    setState({ status: "loading" });
    getJSON<{ story: SuccessStory }>(`/stories/${encodeURIComponent(id)}`)
      .then(({ story }) => live && setState({ story, status: "ready" }))
      .catch((err) => {
        if (!live) return;
        // Hidden or unknown story (the API said so): missing. The API unreachable or not there
        // yet: fall back to the built-in copy if there is one.
        if (err.status === 404 && err.fromApi) return setState({ status: "missing" });
        const story = builtIn.find((s) => s.id === id);
        setState(story ? { story, status: "fallback" } : { status: "missing" });
      });
    return () => {
      live = false;
    };
  }, [id]);
  return state;
}

// ---- Writing (admins and wing masters; the backend checks the role again) ------------------------

export const canWriteStories = (role?: string) => role === "admin" || role === "wing_master";

async function send<T>(token: string, method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}/story-api${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) throw new Error(data.message || `Request failed (${res.status})`);
  cache.clear();
  return data;
}

export const createStory = (token: string, draft: StoryDraft) =>
  send<{ story: SuccessStory }>(token, "POST", "/stories", draft).then((d) => d.story);

export const updateStory = (token: string, id: string, draft: Partial<StoryDraft> & { isPublished?: boolean }) =>
  send<{ story: SuccessStory }>(token, "PATCH", `/stories/${encodeURIComponent(id)}`, draft).then((d) => d.story);

export const hideStory = (token: string, id: string) => send(token, "DELETE", `/stories/${encodeURIComponent(id)}`);

export async function uploadStoryImage(token: string, file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`${API_BASE}/story-api/upload`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.message || "Image upload failed");
  return data.url;
}
