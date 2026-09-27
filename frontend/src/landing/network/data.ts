import { getIdeaNavigationSlug } from "@/utils/slugUtils";
import { isReadableTitle } from "@/utils/readableTitle";

// Real records for the network scene. Every point the scene draws for a problem or idea is one
// of these; decorative dust is drawn separately and is never hoverable or counted.

export type NetKind = "problem" | "idea" | "venture";

export type NetItem = {
  kind: NetKind;
  title: string;
  /** Route or in-page anchor the node opens; null when there is nothing to open. */
  href: string | null;
  /** Only readable titles are hoverable; the rest still render as points. */
  readable: boolean;
  /** For problems: index of the idea that answers it. For ideas: their problem's index. */
  link: number | null;
};

export type NetData = { items: NetItem[]; problems: number; ideas: number };

// Titles like "dsa" stay as unlabelled points.
const isReadable = isReadableTitle;

const withTimeout = <T,>(p: Promise<T>, ms: number) =>
  Promise.race([p, new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);

const getJson = async (url: string) => {
  const res = await withTimeout(fetch(url), 6000);
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
};

type RawProblem = { problemId?: string | number; title?: string; upvotedBy?: unknown };
type RawIdea = { ideaId?: string; title?: string; relatedProblemId?: string | number | null };

/**
 * `ventures`: the funded ventures from the landing's Proof section (06). The live API has no
 * startup records yet, so those are the startup nodes, and they open that section.
 */
// The network scene and the work collage both read these records; one request serves both.
const cache = new Map<string, Promise<NetData | null>>();
export function loadNetworkData(apiBase: string, ventures: readonly string[]): Promise<NetData | null> {
  const key = `${apiBase}|${ventures.join(",")}`;
  if (!cache.has(key)) cache.set(key, fetchNetworkData(apiBase, ventures).catch(() => null));
  return cache.get(key)!;
}

async function fetchNetworkData(apiBase: string, ventures: readonly string[]): Promise<NetData | null> {
  const [problemsRes, ideasRes] = await Promise.allSettled([
    getJson(`${apiBase}/problem-api/problems?limit=1000`),
    getJson(`${apiBase}/idea-api/ideas`),
  ]);
  if (problemsRes.status !== "fulfilled") return null;

  const rawProblems: RawProblem[] = problemsRes.value?.problems ?? problemsRes.value ?? [];
  // With an empty database the API answers with sample problems, which have no upvotedBy
  // relation. Those are not real submissions, so they are dropped.
  const problems = rawProblems.filter((p) => Array.isArray(p.upvotedBy) && p.problemId != null && p.title);
  const rawIdeas: RawIdea[] = ideasRes.status === "fulfilled" && Array.isArray(ideasRes.value) ? ideasRes.value : [];
  const ideas = rawIdeas.filter((i) => i.ideaId && i.title);
  if (!problems.length) return null;

  const items: NetItem[] = problems.slice(0, 900).map((p) => ({
    kind: "problem",
    title: String(p.title).trim(),
    href: `/problems/${p.problemId}`,
    readable: isReadable(String(p.title)),
    link: null,
  }));
  const problemIndex = new Map(problems.slice(0, 900).map((p, i) => [String(p.problemId), i]));

  ideas.forEach((idea) => {
    const index = items.length;
    const parent = idea.relatedProblemId != null ? problemIndex.get(String(idea.relatedProblemId)) : undefined;
    items.push({
      kind: "idea",
      title: String(idea.title).trim(),
      href: `/ideas/${getIdeaNavigationSlug({ title: String(idea.title), ideaId: String(idea.ideaId) })}`,
      readable: isReadable(String(idea.title)),
      link: parent ?? null,
    });
    if (parent != null && items[parent].link == null) items[parent].link = index;
  });

  ventures.forEach((name) =>
    items.push({ kind: "venture", title: name, href: "#ventures", readable: true, link: null })
  );

  return { items, problems: problems.length, ideas: ideas.length };
}
