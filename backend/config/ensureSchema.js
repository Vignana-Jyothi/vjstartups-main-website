const fs = require('fs');
const path = require('path');
const prisma = require('./prisma');

// Site tables added after the Postgres merge are created by the server itself on startup. The
// production database has no Prisma migration history, and running the Prisma CLI inside the
// container during deploy was killed for memory (exit 137). The server already holds a
// database connection, so it applies these files here: each is safe to re-run (IF NOT EXISTS,
// ON CONFLICT DO NOTHING), so this is a no-op once they are in place and never touches rows.
const STARTUP_SQL = [
  'prisma/migrations/20260929000000_add_success_stories/migration.sql',
];

// Splits a SQL file into statements, respecting quotes, $tag$ dollar-quoting and comments.
function splitStatements(sql) {
  const out = [];
  let cur = '';
  let i = 0;
  while (i < sql.length) {
    const c = sql[i];
    if (c === '-' && sql[i + 1] === '-') {
      const end = sql.indexOf('\n', i);
      i = end < 0 ? sql.length : end + 1;
      continue;
    }
    if (c === "'") {
      let j = i + 1;
      while (j < sql.length && !(sql[j] === "'" && sql[j + 1] !== "'")) j += sql[j] === "'" ? 2 : 1;
      cur += sql.slice(i, j + 1);
      i = j + 1;
      continue;
    }
    if (c === '$') {
      const tag = /^\$[A-Za-z_]*\$/.exec(sql.slice(i));
      if (tag) {
        const end = sql.indexOf(tag[0], i + tag[0].length);
        const stop = end < 0 ? sql.length : end + tag[0].length;
        cur += sql.slice(i, stop);
        i = stop;
        continue;
      }
    }
    if (c === ';') {
      if (cur.trim()) out.push(cur.trim());
      cur = '';
      i += 1;
      continue;
    }
    cur += c;
    i += 1;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

async function ensureSchema() {
  for (const rel of STARTUP_SQL) {
    const file = path.join(__dirname, '..', rel);
    try {
      const statements = splitStatements(fs.readFileSync(file, 'utf8'));
      for (const statement of statements) await prisma.$executeRawUnsafe(statement);
      console.log(`Schema check: ${path.basename(path.dirname(file))} (${statements.length} statements) ok`);
    } catch (err) {
      // The site keeps serving; the feature that needs the table falls back where it can.
      console.error(`Schema check failed for ${rel}:`, err.message);
    }
  }
}

module.exports = { ensureSchema, splitStatements };
