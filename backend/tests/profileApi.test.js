'use strict';

// Run with: npm test   (uses Node's built-in test runner, no extra packages)
const test = require('node:test');
const assert = require('node:assert/strict');
const { isValidHandle, normalizeHandle, createProfileLoader } = require('../APIs/profile-api');

const ok = (body) => ({ ok: true, status: 200, json: async () => body });
const status = (code) => ({ ok: code >= 200 && code < 300, status: code, json: async () => ({}) });

function loaderWith(responses, clock = { t: 0 }) {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    const next = responses.shift();
    if (next instanceof Error) throw next;
    return next;
  };
  const loader = createProfileLoader({ fetchImpl, baseUrl: () => 'https://vjos.test', now: () => clock.t });
  return { loader, calls, clock };
}

test('handles follow the same rules as VJOS', () => {
  for (const good of ['asha', 'asha-rao', 'a1b', 'a'.repeat(30)]) assert.equal(isValidHandle(good), true, good);
  for (const bad of ['', 'ab', 'a'.repeat(31), '-abc', 'abc-', 'a--b', 'Asha', 'has space', 'a/b', '../x', 'a_b']) {
    assert.equal(isValidHandle(bad), false, bad);
  }
});

test('handles are trimmed and lower-cased before they are checked', () => {
  assert.equal(normalizeHandle('  Asha-Rao '), 'asha-rao');
  assert.equal(normalizeHandle(undefined), '');
});

test('a found profile is returned as VJOS sent it and asked for by handle', async () => {
  const { loader, calls } = loaderWith([ok({ handle: 'asha', name: 'Asha Rao' })]);
  const result = await loader.load('asha');
  assert.deepEqual(result, { profile: { handle: 'asha', name: 'Asha Rao' } });
  assert.deepEqual(calls, ['https://vjos.test/api/vj-startups/public/profiles/asha/']);
});

test('a profile that is not published is reported as not found', async () => {
  const { loader } = loaderWith([status(404)]);
  assert.deepEqual(await loader.load('ghost'), { notFound: true });
});

test('a found profile is cached for a few minutes, then fetched again', async () => {
  const { loader, calls, clock } = loaderWith([ok({ n: 1 }), ok({ n: 2 })]);
  assert.deepEqual(await loader.load('asha'), { profile: { n: 1 } });
  clock.t = 4 * 60 * 1000;
  assert.deepEqual(await loader.load('asha'), { profile: { n: 1 } });
  assert.equal(calls.length, 1);
  clock.t = 5 * 60 * 1000 + 1;
  assert.deepEqual(await loader.load('asha'), { profile: { n: 2 } });
  assert.equal(calls.length, 2);
});

test('a missing profile is remembered only briefly, so publishing shows up quickly', async () => {
  const { loader, calls, clock } = loaderWith([status(404), ok({ n: 1 })]);
  assert.deepEqual(await loader.load('asha'), { notFound: true });
  clock.t = 10 * 1000;
  assert.deepEqual(await loader.load('asha'), { notFound: true });
  assert.equal(calls.length, 1);
  clock.t = 31 * 1000;
  assert.deepEqual(await loader.load('asha'), { profile: { n: 1 } });
});

test('a VJOS error is thrown, not cached, and not mistaken for a missing profile', async () => {
  const { loader, calls } = loaderWith([status(500), ok({ n: 1 })]);
  await assert.rejects(() => loader.load('asha'), /VJOS responded 500/);
  assert.deepEqual(await loader.load('asha'), { profile: { n: 1 } });
  assert.equal(calls.length, 2);
});

test('an unreachable VJOS is an error too', async () => {
  const { loader } = loaderWith([new Error('connect ECONNREFUSED')]);
  await assert.rejects(() => loader.load('asha'), /ECONNREFUSED/);
});

test('without PLANE_API_URL it fails loudly instead of calling nowhere', async () => {
  const loader = createProfileLoader({ fetchImpl: async () => ok({}), baseUrl: () => '' });
  await assert.rejects(() => loader.load('asha'), /PLANE_API_URL/);
});

test('the cache does not grow without limit', async () => {
  const responses = Array.from({ length: 600 }, () => ok({}));
  const { loader } = loaderWith(responses);
  for (let i = 0; i < 600; i++) await loader.load(`user-${i}`);
  assert.ok(loader.cache.size <= 500);
});
