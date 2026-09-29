const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// The site's headline numbers, counted from the database instead of typed into the code (the
// landing used to say "36 startups / 88 future builders / 9 funded" while the database held no
// startups at all). Only counts are returned, never who they are. Cached briefly.
const CACHE_MS = 5 * 60 * 1000;
const FUNDED = ['pre-seed', 'seed', 'series-a', 'later-stage'];
let cache = { at: 0, stats: null };

async function countStats() {
  const [problems, ideas, startups, fundedStartups, people] = await Promise.all([
    prisma.problem.count(),
    prisma.idea.count(),
    prisma.startup.count(),
    prisma.startup.count({ where: { fundingStatus: { in: FUNDED, mode: 'insensitive' } } }),
    // Builders: everyone who has posted a problem or idea, or is on an idea's team or a
    // problem's / idea's collaborator list. Emails are only used to de-duplicate, here.
    prisma.$queryRawUnsafe(`
      SELECT COUNT(DISTINCT LOWER(TRIM(email)))::int AS n FROM (
        SELECT "addedByEmail" AS email FROM problems
        UNION ALL SELECT "addedByEmail" FROM ideas
        UNION ALL SELECT email FROM idea_team_members
        UNION ALL SELECT email FROM problem_collaborators
        UNION ALL SELECT email FROM idea_collaborators
      ) people WHERE email IS NOT NULL AND TRIM(email) <> ''`),
  ]);
  return { problems, ideas, startups, fundedStartups, builders: people[0]?.n ?? 0 };
}

// GET /stats-api
router.get('/', async (req, res) => {
  try {
    if (!cache.stats || Date.now() - cache.at > CACHE_MS) {
      cache = { at: Date.now(), stats: await countStats() };
    }
    res.json({ success: true, ...cache.stats });
  } catch (error) {
    console.error('Error counting site stats:', error.message);
    if (cache.stats) return res.json({ success: true, ...cache.stats, stale: true });
    res.status(500).json({ success: false, message: 'Stats unavailable' });
  }
});

module.exports = router;
