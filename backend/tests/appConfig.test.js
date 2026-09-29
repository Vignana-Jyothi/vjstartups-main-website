'use strict';

// Run with: npm test   (uses Node's built-in test runner, no extra packages)
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  DEFAULT_ORIGINS,
  LOCAL_ORIGINS,
  institutionalEmailDomains,
  isInstitutionalEmail,
  corsOrigins,
} = require('../config/appConfig');

test('the college domain defaults to vnrvjiet.in and matches case-insensitively', () => {
  assert.deepEqual(institutionalEmailDomains({}), ['vnrvjiet.in']);
  assert.equal(isInstitutionalEmail('Someone@VNRVJIET.in', {}), true);
});

test('other and look-alike domains are not institutional', () => {
  assert.equal(isInstitutionalEmail('someone@gmail.com', {}), false);
  assert.equal(isInstitutionalEmail('someone@notvnrvjiet.in', {}), false);
  assert.equal(isInstitutionalEmail('', {}), false);
  assert.equal(isInstitutionalEmail(undefined, {}), false);
  assert.equal(isInstitutionalEmail(null, {}), false);
});

test('several domains, stray spaces and leading @ are tolerated', () => {
  const env = { INSTITUTIONAL_EMAIL_DOMAINS: '@vnrvjiet.in, Example.EDU ,' };
  assert.deepEqual(institutionalEmailDomains(env), ['vnrvjiet.in', 'example.edu']);
  assert.equal(isInstitutionalEmail('a@example.edu', env), true);
});

test('a blank INSTITUTIONAL_EMAIL_DOMAINS falls back to the default', () => {
  assert.deepEqual(institutionalEmailDomains({ INSTITUTIONAL_EMAIL_DOMAINS: '' }), ['vnrvjiet.in']);
});

test('CORS: localhost origins are allowed outside production only', () => {
  const dev = corsOrigins({});
  for (const origin of [...DEFAULT_ORIGINS, ...LOCAL_ORIGINS]) assert.ok(dev.includes(origin), origin);

  const prod = corsOrigins({ NODE_ENV: 'production' });
  assert.deepEqual(prod, DEFAULT_ORIGINS);
  assert.ok(prod.every((o) => !o.startsWith('http://localhost')));
});

test('CORS: the live and dev sites are allowed by default', () => {
  const origins = corsOrigins({ NODE_ENV: 'production' });
  assert.ok(origins.includes('https://www.vjstartup.com'));
  assert.ok(origins.includes('https://dev-vj.vjstartup.com'));
});

test('CORS_ORIGINS replaces the defaults entirely', () => {
  const origins = corsOrigins({ CORS_ORIGINS: 'https://a.example, https://b.example ,', NODE_ENV: 'production' });
  assert.deepEqual(origins, ['https://a.example', 'https://b.example']);
});
