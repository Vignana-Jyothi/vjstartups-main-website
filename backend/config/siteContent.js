'use strict';

// The site's editable content: programs, funded ventures, the club's wings, the club's own
// numbers and text, and the home page's Signals. Each kind is stored as JSON in site_content
// (one row per item); this file decides what a valid item of each kind looks like. Only known
// fields of the right type are kept, strings are trimmed and length-capped, and empty entries
// are dropped, so whatever an editor sends, the pages get the shape they expect.

const str = (v, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const url = (v) => {
  const s = str(v, 1000);
  return /^(https?:\/\/|\/|mailto:)/i.test(s) ? s : '';
};
const email = (v) => {
  const s = str(v, 200);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : '';
};
const list = (v, max = 30) => (Array.isArray(v) ? v.slice(0, max) : []);
const strings = (v, max = 20, len = 300) => list(v, max).map((s) => str(s, len)).filter(Boolean);
const oneOf = (v, options, fallback) => (options.includes(v) ? v : fallback);
const compact = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== '' && value !== undefined && !(Array.isArray(value) && !value.length)));

const STATUSES = ['active', 'planned', 'completed'];
const CATEGORIES = ['challenge', 'internship', 'learning', 'networking', 'training', 'event', 'initiative'];

function program(b) {
  const edition = Number.parseInt(b.edition, 10);
  return compact({
    title: str(b.title, 160),
    subtitle: str(b.subtitle, 300),
    duration: str(b.duration, 80),
    status: oneOf(b.status, STATUSES, 'active'),
    edition: Number.isFinite(edition) && edition > 0 ? edition : undefined,
    category: oneOf(b.category, CATEGORIES, 'initiative'),
    onHomePage: b.onHomePage === true ? true : undefined,
    shortDescription: str(b.shortDescription, 500),
    overview: str(b.overview, 6000),
    howToParticipate: strings(b.howToParticipate),
    support: strings(b.support),
    benefits: strings(b.benefits),
    eligibility: strings(b.eligibility),
    timeline: strings(b.timeline),
    resources: list(b.resources, 20)
      .map((r) => compact({ title: str(r?.title, 200), description: str(r?.description, 600), link: url(r?.link) }))
      .filter((r) => r.title),
    mentors: list(b.mentors, 40)
      .map((m) =>
        compact({
          name: str(m?.name, 120),
          designation: str(m?.designation, 160),
          department: str(m?.department, 160),
          expertise: strings(m?.expertise, 12, 120),
          email: email(m?.email),
          contact: str(m?.contact, 40),
          whatsappNumber: str(m?.whatsappNumber, 20).replace(/[^\d+]/g, ''),
          availability: str(m?.availability, 200),
          location: str(m?.location, 200),
          note: str(m?.note, 400),
          resumeLink: url(m?.resumeLink),
        }),
      )
      .filter((m) => m.name),
    contact: compact({ email: email(b.contact?.email), coordinator: str(b.contact?.coordinator, 160) }),
  });
}

function venture(b) {
  return compact({
    name: str(b.name, 160),
    sector: str(b.sector, 80),
    description: str(b.description, 600),
    imageUrl: url(b.imageUrl),
    website: url(b.website),
  });
}

function wing(b) {
  return compact({
    name: str(b.name, 80),
    description: str(b.description, 600),
    purpose: str(b.purpose, 600),
    focusAreas: strings(b.focusAreas, 12, 200),
    achievements: strings(b.achievements, 12, 300),
    currentProjects: strings(b.currentProjects, 12, 300),
    subWings: list(b.subWings, 12)
      .map((s) => {
        const edition = Number.parseInt(s?.edition, 10);
        return compact({
          id: str(s?.id, 80),
          name: str(s?.name, 120),
          description: str(s?.description, 600),
          status: oneOf(s?.status, STATUSES, 'active'),
          edition: Number.isFinite(edition) && edition > 0 ? edition : undefined,
          currentActivity: str(s?.currentActivity, 300),
          achievements: strings(s?.achievements, 12, 300),
        });
      })
      .filter((s) => s.name),
  });
}

function club(b) {
  return compact({
    name: str(b.name, 120),
    tagline: str(b.tagline, 300),
    description: str(b.description, 2000),
    mission: str(b.mission, 1000),
    vision: str(b.vision, 1000),
    stats: list(b.stats, 6)
      .map((s) => compact({ value: str(s?.value, 20), label: str(s?.label, 60) }))
      .filter((s) => s.value && s.label),
  });
}

function signal(b) {
  return compact({ value: str(b.value, 20), title: str(b.title, 120), note: str(b.note, 200) });
}

/** Each kind: how to clean an item, which field it can't do without, and the API's list name. */
const KINDS = {
  program: { clean: program, required: 'title', plural: 'programs' },
  venture: { clean: venture, required: 'name', plural: 'ventures' },
  wing: { clean: wing, required: 'name', plural: 'wings' },
  club: { clean: club, required: 'name', plural: 'club', single: 'main' },
  signal: { clean: signal, required: 'title', plural: 'signals' },
};

const SLUG = /^[a-z0-9][a-z0-9-]{0,79}$/;

/** Cleans an item of a kind. Returns { data } or { error } with a message for the editor. */
function cleanItem(kind, slug, body) {
  const spec = KINDS[kind];
  if (!spec) return { error: `Unknown kind: ${kind}` };
  if (spec.single ? slug !== spec.single : !SLUG.test(slug || '')) {
    return { error: spec.single ? `The club has one entry, "${spec.single}"` : 'The id may use lowercase letters, digits and hyphens' };
  }
  const data = spec.clean(body && typeof body === 'object' ? body : {});
  if (!data[spec.required]) return { error: `Missing: ${spec.required}` };
  return { data };
}

/** Rows to the API's shape: { programs: [...], ventures: [...], wings, signals, club }. */
function group(rows, { withState = false } = {}) {
  const out = { club: null };
  for (const spec of Object.values(KINDS)) if (!spec.single) out[spec.plural] = [];
  for (const row of rows) {
    const spec = KINDS[row.kind];
    if (!spec) continue;
    const item = { ...row.data, id: row.slug };
    if (withState) Object.assign(item, { isPublished: row.isPublished, sortOrder: row.sortOrder, updatedByName: row.updatedByName, updatedAt: row.updatedAt });
    if (spec.single) out[spec.plural] = item;
    else out[spec.plural].push(item);
  }
  return out;
}

module.exports = { KINDS, cleanItem, group };
