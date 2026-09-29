'use strict';

/**
 * Deployment-specific settings, read from the environment.
 *
 * Nothing that differs between environments (allowed browser origins, the
 * college email domain) is hardcoded in the routes any more - change the
 * environment, not the code.
 */

const DEFAULT_INSTITUTIONAL_EMAIL_DOMAINS = 'vnrvjiet.in';

// The sites that legitimately call this API from a browser. Only hosts we control belong here:
// CORS is sent with credentials, so an origin on a domain nobody owns (or that someone else
// could register) would be trusted. The plural "vjstartups.com" names that used to be listed
// have no DNS records and were removed; use CORS_ORIGINS to add anything else.
const DEFAULT_ORIGINS = [
  'https://www.vjstartup.com',
  'https://vjstartup.com',
  'https://hub.vjstartup.com',
  'https://dev-vj.vjstartup.com',
];

// Local development servers - dropped when NODE_ENV=production.
const LOCAL_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:4000',
  'http://localhost:4001', // admin dev
  'http://localhost:4002', // plane dev
];

function splitList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

/** Lower-case email domains (no '@') from INSTITUTIONAL_EMAIL_DOMAINS, comma separated. */
function institutionalEmailDomains(env = process.env) {
  const raw = env.INSTITUTIONAL_EMAIL_DOMAINS || DEFAULT_INSTITUTIONAL_EMAIL_DOMAINS;
  return splitList(raw).map((d) => d.replace(/^@/, '').toLowerCase());
}

function isInstitutionalEmail(email, env = process.env) {
  if (typeof email !== 'string') return false;
  const value = email.trim().toLowerCase();
  return institutionalEmailDomains(env).some((domain) => value.endsWith(`@${domain}`));
}

/**
 * Allowed CORS origins: CORS_ORIGINS (comma separated) replaces the defaults
 * entirely when set; otherwise the site list, plus localhost outside production.
 */
function corsOrigins(env = process.env) {
  const configured = splitList(env.CORS_ORIGINS);
  if (configured.length) return configured;
  return env.NODE_ENV === 'production' ? [...DEFAULT_ORIGINS] : [...DEFAULT_ORIGINS, ...LOCAL_ORIGINS];
}

module.exports = {
  DEFAULT_INSTITUTIONAL_EMAIL_DOMAINS,
  DEFAULT_ORIGINS,
  LOCAL_ORIGINS,
  institutionalEmailDomains,
  isInstitutionalEmail,
  corsOrigins,
};
