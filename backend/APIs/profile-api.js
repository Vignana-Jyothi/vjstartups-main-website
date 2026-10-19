const express = require('express');
const router = express.Router();
const { planeApiUrl } = require('../config/appConfig');

// Public member profiles live in VJOS (Plane). The site's pages can't read VJOS from the browser
// (it sends no CORS headers for the site), so this route fetches the profile server-to-server and
// passes it on. VJOS has already decided what is public - a member's profile is only returned
// once they have published it, and only the fields meant for the public - so nothing is added or
// filtered here. Cached briefly so page views don't each hit VJOS.

// Same rules as VJOS: 3-30 lower-case letters, digits and single hyphens, no hyphen at either end.
const HANDLE_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$/;
const FOUND_CACHE_MS = 5 * 60 * 1000;
// A missing profile is remembered only briefly, so publishing one shows up almost at once.
const MISSING_CACHE_MS = 30 * 1000;
const MAX_CACHED = 500;
const TIMEOUT_MS = 8000;

function normalizeHandle(raw) {
  return String(raw || '').trim().toLowerCase();
}

function isValidHandle(handle) {
  return HANDLE_PATTERN.test(handle) && !handle.includes('--');
}

function createProfileLoader({ fetchImpl = fetch, baseUrl = planeApiUrl, now = Date.now } = {}) {
  const cache = new Map();

  function remember(handle, entry) {
    if (cache.size >= MAX_CACHED) cache.delete(cache.keys().next().value);
    cache.set(handle, entry);
  }

  // Resolves to { profile } or { notFound: true }; throws if VJOS can't be reached or misbehaves.
  async function load(handle) {
    const hit = cache.get(handle);
    if (hit && now() < hit.until) return hit.result;

    const base = baseUrl();
    if (!base) throw new Error('PLANE_API_URL is not set');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetchImpl(`${base}/api/vj-startups/public/profiles/${encodeURIComponent(handle)}/`, {
        signal: controller.signal,
      });
      if (res.status === 404) {
        const result = { notFound: true };
        remember(handle, { result, until: now() + MISSING_CACHE_MS });
        return result;
      }
      if (!res.ok) throw new Error(`VJOS responded ${res.status}`);
      const result = { profile: await res.json() };
      remember(handle, { result, until: now() + FOUND_CACHE_MS });
      return result;
    } finally {
      clearTimeout(timer);
    }
  }

  return { load, cache };
}

const loader = createProfileLoader();

// GET /profile-api/:handle
router.get('/:handle', async (req, res) => {
  const handle = normalizeHandle(req.params.handle);
  if (!isValidHandle(handle)) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }
  try {
    const result = await loader.load(handle);
    if (result.notFound) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.set('Cache-Control', 'public, max-age=60');
    res.json({ success: true, profile: result.profile });
  } catch (error) {
    console.error('Error loading profile from VJOS:', error.message);
    res.status(502).json({ success: false, message: 'Profile unavailable' });
  }
});

module.exports = router;
module.exports.isValidHandle = isValidHandle;
module.exports.normalizeHandle = normalizeHandle;
module.exports.createProfileLoader = createProfileLoader;
