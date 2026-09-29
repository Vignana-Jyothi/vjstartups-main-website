'use strict';

// Run with: npm test   (Node's built-in test runner, no extra packages)
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { splitSqlStatements } = require('../scripts/apply-sql');

test('splits plain statements and skips empty ones', () => {
  assert.deepEqual(splitSqlStatements('SELECT 1;;  SELECT 2;\n'), ['SELECT 1', 'SELECT 2']);
});

test('a final statement without a semicolon is kept', () => {
  assert.deepEqual(splitSqlStatements('SELECT 1; SELECT 2'), ['SELECT 1', 'SELECT 2']);
});

test('semicolons inside strings and quoted identifiers do not split', () => {
  const sql = `INSERT INTO t VALUES ('a;b', 'it''s; fine'); SELECT "odd;name" FROM t;`;
  assert.deepEqual(splitSqlStatements(sql), [`INSERT INTO t VALUES ('a;b', 'it''s; fine')`, `SELECT "odd;name" FROM t`]);
});

test('semicolons inside $tag$ and $$ strings do not split', () => {
  const sql = `INSERT INTO t VALUES ($x$one; two$x$, $$three; four$$); SELECT 2;`;
  assert.deepEqual(splitSqlStatements(sql), [`INSERT INTO t VALUES ($x$one; two$x$, $$three; four$$)`, 'SELECT 2']);
});

test('an empty dollar-quoted string is handled', () => {
  assert.deepEqual(splitSqlStatements('SELECT $q$$q$; SELECT 2;'), ['SELECT $q$$q$', 'SELECT 2']);
});

test('$1 parameters and $ inside identifiers are not dollar quotes', () => {
  assert.deepEqual(splitSqlStatements('SELECT $1; SELECT a$b;'), ['SELECT $1', 'SELECT a$b']);
});

test('comments are dropped, including nested block comments and ones containing semicolons', () => {
  const sql = `-- header; not a split\nSELECT 1; /* a; /* nested; */ b; */ SELECT 2; -- trailing;`;
  assert.deepEqual(splitSqlStatements(sql), ['SELECT 1', 'SELECT 2']);
});

test('a comment-only file yields nothing', () => {
  assert.deepEqual(splitSqlStatements('-- nothing here\n/* nor here */\n'), []);
});

test('unterminated strings, identifiers, comments and dollar quotes throw', () => {
  assert.throws(() => splitSqlStatements("SELECT 'abc;"), /Unterminated string/);
  assert.throws(() => splitSqlStatements('SELECT "abc;'), /Unterminated identifier/);
  assert.throws(() => splitSqlStatements('SELECT 1 /* oops'), /Unterminated \/\* comment/);
  assert.throws(() => splitSqlStatements('SELECT $t$ oops;'), /Unterminated dollar-quoted/);
});

test('the real success-stories migration parses into its 4 statements', (t) => {
  const file = path.join(__dirname, '../prisma/migrations/20260929000000_add_success_stories/migration.sql');
  if (!fs.existsSync(file)) return t.skip('migration file not on this branch');
  const statements = splitSqlStatements(fs.readFileSync(file, 'utf8'));
  assert.equal(statements.length, 4);
  assert.match(statements[0], /^CREATE TABLE IF NOT EXISTS "success_stories"/);
  assert.match(statements[1], /^CREATE INDEX IF NOT EXISTS "success_stories_programId_idx"/);
  assert.match(statements[2], /^CREATE INDEX IF NOT EXISTS "success_stories_isPublished_idx"/);
  assert.match(statements[3], /^INSERT INTO "success_stories"/);
  assert.match(statements[3], /ON CONFLICT \("id"\) DO NOTHING$/);
});
