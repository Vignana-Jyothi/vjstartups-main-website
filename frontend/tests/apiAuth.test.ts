import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

// The session token lives in localStorage; give Node a minimal one before the module loads.
const store = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: () => null,
  length: 0,
};

const axios = (await import("axios")).default;
const { authHeaders } = await import("@/lib/apiAuth");

// Runs the registered request interceptors on a request without sending it.
async function headersFor(url: string, headers: Record<string, string> = {}) {
  let config = { url, headers: new axios.AxiosHeaders(headers) } as Parameters<
    Parameters<typeof axios.interceptors.request.use>[0]
  >[0];
  const handlers = (axios.interceptors.request as unknown as { handlers: { fulfilled: (c: typeof config) => typeof config }[] }).handlers;
  for (const h of handlers) if (h?.fulfilled) config = await h.fulfilled(config);
  return config.headers.toJSON() as Record<string, string>;
}

beforeEach(() => store.clear());

test("signed-in requests to the site's API carry the session token", async () => {
  store.set("user", JSON.stringify({ email: "a@vnrvjiet.in", sessionToken: "tok123" }));
  const h = await headersFor("https://api.test/be/problem-api/problems");
  assert.equal(h.Authorization, "Bearer tok123");
});

test("the token is never sent to other hosts", async () => {
  store.set("user", JSON.stringify({ sessionToken: "tok123" }));
  assert.equal((await headersFor("https://res.cloudinary.com/x/image.png")).Authorization, undefined);
  assert.equal((await headersFor("https://api.test/be-evil/steal")).Authorization, undefined);
});

test("a request's own Authorization (admin actions) is left alone", async () => {
  store.set("user", JSON.stringify({ sessionToken: "tok123" }));
  const h = await headersFor("https://api.test/be/problem-api/problem/1/verify", { Authorization: "Bearer admin-tok" });
  assert.equal(h.Authorization, "Bearer admin-tok");
});

test("signed-out requests go without a token", async () => {
  assert.equal((await headersFor("https://api.test/be/problem-api/problems")).Authorization, undefined);
  assert.deepEqual(authHeaders(), {});
});
