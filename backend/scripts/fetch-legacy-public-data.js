#!/usr/bin/env node
'use strict';

/**
 * Downloads every problem and idea from the legacy site's public list API into
 * two JSON files that import-legacy-mongo.js can read. Use this when a raw
 * MongoDB export is not available. Read-only against the live site.
 *
 *   node scripts/fetch-legacy-public-data.js --out /tmp/legacy
 *   node scripts/fetch-legacy-public-data.js --out /tmp/legacy --base https://www.vjstartup.com/be
 */

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { base: 'https://www.vjstartup.com/be', out: '.' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--base') args.base = argv[++i].replace(/\/$/, '');
    else if (argv[i] === '--out') args.out = argv[++i];
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  return args;
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

async function fetchProblems(base) {
  const byId = new Map();
  let page = 1;
  let totalPages = 1;
  let reportedTotal = null;
  do {
    const body = await getJson(`${base}/problem-api/problems?page=${page}`);
    totalPages = body.pagination ? body.pagination.totalPages : 1;
    reportedTotal = body.pagination ? body.pagination.totalItems : null;
    for (const p of body.problems || []) byId.set(String(p.problemId), p);
    page++;
  } while (page <= totalPages);
  if (reportedTotal !== null && byId.size !== reportedTotal) {
    console.warn(`WARNING: site reports ${reportedTotal} problems but ${byId.size} were downloaded.`);
  }
  return [...byId.values()];
}

async function fetchIdeas(base) {
  const body = await getJson(`${base}/idea-api/ideas`);
  const list = Array.isArray(body) ? body : body.ideas || [];
  return [...new Map(list.map((i) => [String(i.ideaId), i])).values()];
}

(async () => {
  const args = parseArgs(process.argv.slice(2));
  fs.mkdirSync(args.out, { recursive: true });

  const problems = await fetchProblems(args.base);
  const ideas = await fetchIdeas(args.base);
  fs.writeFileSync(path.join(args.out, 'problems.json'), JSON.stringify(problems));
  fs.writeFileSync(path.join(args.out, 'ideas.json'), JSON.stringify(ideas));
  console.log(`Saved ${problems.length} problems and ${ideas.length} ideas to ${path.resolve(args.out)}`);
})().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
