'use strict';

// Run with: npm test   (uses Node's built-in test runner, no extra packages)
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

test('stats: startups that were soft-deleted are not counted', async () => {
  const startupCalls = [];
  const fakePrisma = {
    problem: { count: async () => 352 },
    idea: { count: async () => 8 },
    startup: {
      count: async (args) => {
        startupCalls.push(args);
        return 0;
      },
    },
    $queryRawUnsafe: async () => [{ n: 293 }],
  };
  const prismaPath = require.resolve('../config/prisma');
  require.cache[prismaPath] = { id: prismaPath, filename: prismaPath, loaded: true, exports: fakePrisma };
  const { countStats } = require(path.join('..', 'APIs', 'stats-api'));

  const stats = await countStats();

  assert.equal(startupCalls.length, 2);
  for (const args of startupCalls) assert.equal(args.where.deletedAt, null);
  assert.deepEqual(stats, { problems: 352, ideas: 8, startups: 0, fundedStartups: 0, builders: 293 });
});
