import type { Plugin } from "vite";
import builtInContent from "./src/data/builtInContent.json";

// Generates sitemap.xml and robots.txt at build time, so search engines find every public page.
// Program pages come from the built-in copy of the site content; programs added later at /manage
// are found through the links on /programs.
// The site's address comes from VITE_SITE_URL (default: the live site).
const PUBLIC_PAGES = [
  "/",
  "/problems",
  "/ideas",
  "/startups",
  "/programs",
  "/stories",
  "/club",
  "/journey",
  "/leaderboard",
  "/changes",
  "/privacy",
  "/terms",
];

const escapeXml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function seoFiles(siteUrl = process.env.VITE_SITE_URL || "https://www.vjstartup.com"): Plugin {
  const base = siteUrl.replace(/\/+$/, "");
  return {
    name: "vj-seo-files",
    apply: "build",
    generateBundle() {
      const paths = [...PUBLIC_PAGES, ...builtInContent.programs.map((p) => `/programs/${p.id}`)];
      const today = new Date().toISOString().slice(0, 10);
      const urls = paths
        .map((p) => `  <url><loc>${escapeXml(base + p)}</loc><lastmod>${today}</lastmod></url>`)
        .join("\n");
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\nDisallow: /submit-problem\nDisallow: /submit-idea\nDisallow: /startup-form\nDisallow: /update-problem/\nDisallow: /stories/new\nDisallow: /announcements/new\nDisallow: /manage\n\nSitemap: ${base}/sitemap.xml\n`,
      });
    },
  };
}
