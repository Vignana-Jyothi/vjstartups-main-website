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

test('CORS: no origin on the unowned plural vjstartups.com domain is trusted by default', () => {
  const dev = corsOrigins({});
  assert.ok(dev.every((o) => !/\/\/([a-z0-9-]+\.)*vjstartups\.com$/.test(o)), dev.join(', '));
});

test('CORS_ORIGINS replaces the defaults entirely', () => {
  const origins = corsOrigins({ CORS_ORIGINS: 'https://a.example, https://b.example ,', NODE_ENV: 'production' });
  assert.deepEqual(origins, ['https://a.example', 'https://b.example']);
});

test('the Plane address has no built-in default and loses its trailing slash', () => {
  const { planeApiUrl } = require('../config/appConfig');
  assert.equal(planeApiUrl({}), '');
  assert.equal(planeApiUrl({ PLANE_API_URL: ' https://vjos.example.test/ ' }), 'https://vjos.example.test');
});

test('missing settings are reported by name, blank counts as missing', () => {
  const { missingSettings, REQUIRED_SETTINGS } = require('../config/appConfig');
  const all = Object.fromEntries(Object.keys(REQUIRED_SETTINGS).map((k) => [k, 'x']));
  assert.deepEqual(missingSettings(all), []);
  assert.deepEqual(missingSettings({ ...all, PLANE_API_URL: '  ' }).map(([name]) => name), ['PLANE_API_URL']);
});

test('the public config holds only the Google client id and the admin link', () => {
  const { publicConfig } = require('../config/appConfig');
  const env = { GOOGLE_CLIENT_ID: 'id.apps', PLANE_ADMIN_URL: 'https://vjos.example.test/god-mode/', PLANE_INTERNAL_TOKEN: 'secret', CLOUDINARY_API_SECRET: 'secret' };
  assert.deepEqual(publicConfig(env), { googleClientId: 'id.apps', planeAdminUrl: 'https://vjos.example.test/god-mode/' });
  assert.deepEqual(publicConfig({}), { googleClientId: null, planeAdminUrl: null });
});
