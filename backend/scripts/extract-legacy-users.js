#!/usr/bin/env node
'use strict';

/**
 * Builds the account list needed before import-legacy-mongo.js can run: every
 * person who authored, collaborated on, upvoted or commented on a legacy
 * problem/idea. Output is a JSON array of { email, name } - the shape Plane's
 * `migrate_mongo_users --json-file` reads - so no MongoDB access is needed.
 *
 *   node scripts/extract-legacy-users.js --problems problems.json --ideas ideas.json --out users.json
 */

const fs = require('fs');

function parseArgs(argv) {
  const args = { problems: null, ideas: null, out: 'users.json' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--problems') args.problems = argv[++i];
    else if (argv[i] === '--ideas') args.ideas = argv[++i];
    else if (argv[i] === '--out') args.out = argv[++i];
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!args.problems && !args.ideas) throw new Error('Pass --problems and/or --ideas.');
  return args;
}

const emailOf = (v) => {
  if (v && typeof v === 'object') v = v.email ?? v.userEmail;
  return typeof v === 'string' ? v.trim().toLowerCase() : '';
};

const load = (file, key) => {
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
  return Array.isArray(parsed) ? parsed : parsed[key] || [];
};

const args = parseArgs(process.argv.slice(2));
const docs = [
  ...(args.problems ? load(args.problems, 'problems') : []),
  ...(args.ideas ? load(args.ideas, 'ideas') : []),
];

const people = new Map(); // email -> best-known name
const note = (email, name) => {
  if (!email) return;
  if (!people.has(email) || (!people.get(email) && name)) people.set(email, (name || '').trim());
};

// Only people the database links to by foreign key need an account: authors,
// upvoters and comment authors. Collaborators, team members, likers and
// repliers are stored as plain emails, so they are not created here.
for (const d of docs) {
  note(emailOf(d.addedByEmail), d.addedByName);
  (d.upvotedBy || []).forEach((u) => note(emailOf(u), u && u.name));
  for (const c of d.comments || []) note(emailOf(c.email), c.name || c.author);
}

const users = [...people].map(([email, name]) => ({ email, name: name || email.split('@')[0], role: 'user' }));
fs.writeFileSync(args.out, JSON.stringify(users, null, 2));
console.log(`Wrote ${users.length} people to ${args.out}`);
