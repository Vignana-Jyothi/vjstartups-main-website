'use strict';

// Run with: npm test   (uses Node's built-in test runner, no extra packages)
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { cleanItem, group } = require('../config/siteContent');
const { splitSqlStatements } = require('../scripts/apply-sql');

test('site content: unknown fields are dropped, strings trimmed, bad values replaced', () => {
  const { data } = cleanItem('program', 'startup-challenge', {
    title: '  Startup Challenge  ',
    status: 'bogus',
    category: 'challenge',
    edition: '3',
    onHomePage: 'yes',
    isAdmin: true,
    howToParticipate: ['  Apply ', '', 42, 'Build'],
    mentors: [{ name: 'Dr. A', email: 'not-an-email', whatsappNumber: '+91 90000-66424', evil: '<script>' }, { designation: 'no name' }],
    resources: [{ title: 'Guide', link: 'javascript:alert(1)' }],
  });
  assert.equal(data.title, 'Startup Challenge');
  assert.equal(data.status, 'active');
  assert.equal(data.edition, 3);
  assert.equal(data.onHomePage, undefined);
  assert.equal(data.isAdmin, undefined);
  assert.deepEqual(data.howToParticipate, ['Apply', 'Build']);
  assert.deepEqual(data.mentors, [{ name: 'Dr. A', whatsappNumber: '+919000066424' }]);
  assert.deepEqual(data.resources, [{ title: 'Guide' }]);
});

test('site content: the required field and a valid id are enforced', () => {
  assert.match(cleanItem('venture', 'x', { sector: 'AI' }).error, /name/);
  assert.match(cleanItem('venture', 'Bad Id!', { name: 'X' }).error, /lowercase/);
  assert.match(cleanItem('club', 'other', { name: 'VJ' }).error, /one entry/);
  assert.match(cleanItem('nonsense', 'x', {}).error, /Unknown kind/);
  assert.ok(cleanItem('club', 'main', { name: 'VJ Startups Club' }).data);
});

test('site content: rows are grouped by kind, hidden state only for editors', () => {
  const rows = [
    { kind: 'club', slug: 'main', data: { name: 'Club' }, isPublished: true, sortOrder: 0 },
    { kind: 'program', slug: 'a', data: { title: 'A' }, isPublished: false, sortOrder: 10 },
    { kind: 'signal', slug: 's', data: { title: 'S', value: '1' }, isPublished: true, sortOrder: 10 },
  ];
  const pub = group(rows);
  assert.equal(pub.club.name, 'Club');
  assert.deepEqual(pub.programs, [{ title: 'A', id: 'a' }]);
  assert.deepEqual(pub.ventures, []);
  assert.equal(group(rows, { withState: true }).programs[0].isPublished, false);
});

test('site content migration: every seed row passes the same cleaning the API applies', () => {
  const file = path.join(__dirname, '../prisma/migrations/20260930000000_add_site_content/migration.sql');
  const statements = splitSqlStatements(fs.readFileSync(file, 'utf8'));
  const inserts = statements.filter((s) => s.startsWith('INSERT'));
  assert.ok(statements[0].startsWith('CREATE TABLE IF NOT EXISTS'));
  assert.ok(inserts.every((s) => s.endsWith('DO NOTHING')), 'seed rows never overwrite edits');
  const rows = inserts.flatMap((s) => [...s.matchAll(/\(\$c\$(\w+)\$c\$,\$c\$([\w-]+)\$c\$,\$c\$(.*?)\$c\$::jsonb/g)]);
  assert.ok(rows.length >= 20);
  for (const [, kind, slug, json] of rows) {
    const { data, error } = cleanItem(kind, slug, JSON.parse(json));
    assert.equal(error, undefined, `${kind}/${slug}`);
    assert.deepEqual(data, JSON.parse(json), `${kind}/${slug} is stored already cleaned`);
  }
});
