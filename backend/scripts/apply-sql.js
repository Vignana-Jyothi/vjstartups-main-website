#!/usr/bin/env node
'use strict';

/**
 * Applies one or more .sql files through the Prisma *client*, in a single
 * transaction per file.
 *
 *   node scripts/apply-sql.js prisma/migrations/<name>/migration.sql [more.sql] [--dry-run]
 *
 * Why this exists: the deploy used to run `npx prisma db execute` inside the
 * backend container. That starts the Prisma CLI plus its schema engine on top of
 * the running server and was being killed (exit 137) on the production host.
 * The client is already what the server runs on, so this is far lighter.
 *
 * The files must be safe to re-run (CREATE ... IF NOT EXISTS, ON CONFLICT DO
 * NOTHING, ...) - the deploy applies them every time.
 */

const fs = require('fs');

/**
 * Splits SQL text into statements on `;`, ignoring semicolons inside single-
 * quoted strings, double-quoted identifiers, comments and $tag$ ... $tag$
 * (dollar-quoted) strings. Comments are dropped; empty statements are skipped.
 */
function splitSqlStatements(sql) {
  const statements = [];
  let current = '';
  let i = 0;
  const n = sql.length;

  while (i < n) {
    const ch = sql[i];
    const next = sql[i + 1];

    // -- line comment
    if (ch === '-' && next === '-') {
      const end = sql.indexOf('\n', i);
      i = end === -1 ? n : end;
      continue;
    }

    // /* block comment */ (PostgreSQL allows nesting)
    if (ch === '/' && next === '*') {
      let depth = 1;
      i += 2;
      while (i < n && depth > 0) {
        if (sql[i] === '/' && sql[i + 1] === '*') {
          depth++;
          i += 2;
        } else if (sql[i] === '*' && sql[i + 1] === '/') {
          depth--;
          i += 2;
        } else {
          i++;
        }
      }
      if (depth > 0) throw new Error('Unterminated /* comment');
      continue;
    }

    // 'string' or "identifier", with doubled quotes as the escape
    if (ch === "'" || ch === '"') {
      let j = i + 1;
      while (j < n) {
        if (sql[j] === ch) {
          if (sql[j + 1] === ch) {
            j += 2;
            continue;
          }
          break;
        }
        j++;
      }
      if (j >= n) throw new Error(`Unterminated ${ch === "'" ? 'string' : 'identifier'} starting at offset ${i}`);
      current += sql.slice(i, j + 1);
      i = j + 1;
      continue;
    }

    // $tag$ ... $tag$ - but not $1 parameters or the $ inside an identifier
    if (ch === '$') {
      const opener = /^\$([A-Za-z_][A-Za-z0-9_]*)?\$/.exec(sql.slice(i, i + 64));
      const prev = i > 0 ? sql[i - 1] : '';
      if (opener && !/[A-Za-z0-9_]/.test(prev)) {
        const tag = opener[0];
        const close = sql.indexOf(tag, i + tag.length);
        if (close === -1) throw new Error(`Unterminated dollar-quoted string ${tag}`);
        current += sql.slice(i, close + tag.length);
        i = close + tag.length;
        continue;
      }
    }

    if (ch === ';') {
      if (current.trim()) statements.push(current.trim());
      current = '';
      i++;
      continue;
    }

    current += ch;
    i++;
  }

  if (current.trim()) statements.push(current.trim());
  return statements;
}

async function main(argv) {
  const dryRun = argv.includes('--dry-run');
  const files = argv.filter((a) => !a.startsWith('--'));
  if (!files.length) throw new Error('Usage: node scripts/apply-sql.js <file.sql> [more.sql ...] [--dry-run]');

  // Loaded here so that requiring this file (the tests do) never opens a database connection.
  const prisma = require('../config/prisma');
  try {
    for (const file of files) {
      const statements = splitSqlStatements(fs.readFileSync(file, 'utf8'));
      if (!statements.length) throw new Error(`${file}: no SQL statements found`);
      if (dryRun) {
        console.log(`${file}: ${statements.length} statement(s) parsed (dry run, nothing executed)`);
        continue;
      }
      await prisma.$transaction(statements.map((statement) => prisma.$executeRawUnsafe(statement)));
      console.log(`${file}: applied ${statements.length} statement(s)`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = { splitSqlStatements };

if (require.main === module) {
  main(process.argv.slice(2)).then(
    () => process.exit(0),
    (err) => {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  );
}
