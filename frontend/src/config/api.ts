// The one place the site's API address is read. Every request builds on API_BASE.
//
// Set VITE_API_BASE_URL at build time (production: https://www.vjstartup.com/be). Without it,
// local development talks to a backend on localhost:6220, and a production build falls back to
// /be on its own domain, which is where production serves the API.
const configured = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

export const API_BASE = (configured || (import.meta.env.DEV ? "http://localhost:6220" : "/be")).replace(/\/+$/, "");
