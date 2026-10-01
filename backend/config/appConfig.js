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

/** VJOS (Plane) as this server reaches it, without a trailing slash; '' when PLANE_API_URL is unset. */
function planeApiUrl(env = process.env) {
  return String(env.PLANE_API_URL || '').trim().replace(/\/+$/, '');
}

// Settings the server can't do its job without, and what stops working when one is missing. The
// server still starts (so a single missing upload key doesn't take the site down); the affected
// routes answer "not set up" and the start-up log names what's missing - names only, never values.
const REQUIRED_SETTINGS = {
  DATABASE_URL: 'everything',
  GOOGLE_CLIENT_ID: 'Google login',
  PLANE_API_URL: 'login, the leaderboard and startup workspaces',
  PLANE_INTERNAL_TOKEN: 'login and startup workspaces',
  CLOUDINARY_CLOUD_NAME: 'file and photo uploads',
  CLOUDINARY_API_KEY: 'file and photo uploads',
  CLOUDINARY_API_SECRET: 'file and photo uploads',
};

/** The required settings that are unset, as [name, what needs it] pairs. */
function missingSettings(env = process.env) {
  return Object.entries(REQUIRED_SETTINGS).filter(([name]) => !String(env[name] || '').trim());
}

/** What the browser needs to know about this deployment; nothing here is secret. */
function publicConfig(env = process.env) {
  return {
    googleClientId: String(env.GOOGLE_CLIENT_ID || '').trim() || null,
    // VJOS's admin page, linked from the site's nav for admins. No link when unset.
    planeAdminUrl: String(env.PLANE_ADMIN_URL || '').trim() || null,
  };
}

module.exports = {
  REQUIRED_SETTINGS,
  planeApiUrl,
  missingSettings,
  publicConfig,
  DEFAULT_INSTITUTIONAL_EMAIL_DOMAINS,
  DEFAULT_ORIGINS,
  LOCAL_ORIGINS,
  institutionalEmailDomains,
  isInstitutionalEmail,
  corsOrigins,
};
