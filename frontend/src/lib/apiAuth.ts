import axios from "axios";
import { API_BASE } from "@/config/api";

// Every request to the site's own API carries the signed-in user's session token, so the backend
// knows who is posting, voting or commenting (it no longer trusts an email in the request) and
// which private links and contact details they may see. Requests that already set their own
// Authorization header (admin and verifier actions send the admin token) are left alone, and
// the token is never sent to any other host.

export function sessionToken(): string | undefined {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw)?.sessionToken || undefined : undefined;
  } catch {
    return undefined;
  }
}

const isApiUrl = (url?: string) => !!url && (url === API_BASE || url.startsWith(`${API_BASE}/`));

/** Headers for a fetch() call to the API: the session token when signed in. */
export function authHeaders(): Record<string, string> {
  const token = sessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

axios.interceptors.request.use((config) => {
  const token = sessionToken();
  const url = config.baseURL ? `${config.baseURL}${config.url ?? ""}` : config.url;
  if (token && isApiUrl(url) && !config.headers?.Authorization) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});
