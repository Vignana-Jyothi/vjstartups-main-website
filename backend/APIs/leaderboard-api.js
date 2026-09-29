const express = require('express');
const router = express.Router();

// The members leaderboard lives in VJOS (Plane). The site's pages can't read it straight from the
// browser (VJOS sends no CORS headers for the site), so this route fetches it server-to-server
// and passes on only what the page shows. Cached briefly so page views don't each hit VJOS.
const CACHE_MS = 60 * 1000;
let cache = { at: 0, members: null };

async function loadMembers() {
  const base = process.env.PLANE_API_URL || 'https://vjos.vjstartup.com';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${base}/api/vj-startups/leaderboards/members/`, { signal: controller.signal });
    if (!res.ok) throw new Error(`VJOS responded ${res.status}`);
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data?.results || [];
    return rows
      .map((p) => ({
        id: String(p.id),
        name: [p.user?.first_name, p.user?.last_name].filter(Boolean).join(' ').trim() || p.user?.display_name || '',
        avatar: p.user?.avatar || null,
        wing: p.wing?.name || (typeof p.wing === 'string' ? p.wing : null),
        reputationScore: Number(p.reputation_score) || 0,
        updatedAt: p.updated_at || null,
      }))
      // Only people who have earned points: an all-zero list (placeholder and admin accounts
      // included) isn't a ranking.
      .filter((m) => m.name && m.reputationScore > 0)
      .sort((a, b) => b.reputationScore - a.reputationScore);
  } finally {
    clearTimeout(timer);
  }
}

// GET /leaderboard-api/members
router.get('/members', async (req, res) => {
  try {
    if (!cache.members || Date.now() - cache.at > CACHE_MS) {
      cache = { at: Date.now(), members: await loadMembers() };
    }
    res.json({ success: true, members: cache.members });
  } catch (error) {
    console.error('Error loading leaderboard from VJOS:', error.message);
    if (cache.members) return res.json({ success: true, members: cache.members, stale: true });
    res.status(502).json({ success: false, message: 'Leaderboard unavailable' });
  }
});

module.exports = router;
