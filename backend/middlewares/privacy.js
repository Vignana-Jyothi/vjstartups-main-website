/**
 * Strips other people's personal data from JSON responses.
 *
 * The public APIs returned every submitter's, team member's, collaborator's and upvoter's email,
 * and ideas' contact phone numbers, to anyone. The frontend only ever compares these against the
 * current user's own email ("is this mine?", "did I upvote?"), so each response keeps:
 *   - the requester's own email wherever it appears;
 *   - the full people lists of an item (collaborators, team, invited, who added a link) for that
 *     item's owner, collaborators and team, so their edit forms keep working;
 *   - upvote and like lists reduced to the requester's own entry;
 *   - contact phone numbers for logged-in members only;
 * and drops every other field whose whole value is an email address.
 *
 * Mount after optionalUser (or any auth middleware) so req.user is known; it reads req.user when
 * the response is sent, so routes that authenticate inside still count.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_KEYS = new Set(['contact', 'phone', 'contactNumber', 'phoneNumber']);
// Lists that say who did something: only the requester's own entry is returned.
const ACTOR_LISTS = new Set(['upvotedBy', 'likedBy', 'likes', 'upvoters', 'downvotedBy']);
// Sub-trees the item's own people get no extra view into (other members' activity).
const NO_PRIVILEGE = new Set(['comments', 'replies', 'upvotedBy', 'likedBy', 'likes']);

const STAFF_ROLES = new Set(['WING_MEMBER', 'WING_MASTER', 'ADMIN']);

const lower = (v) => (typeof v === 'string' ? v.trim().toLowerCase() : v);

function emailsIn(value) {
  if (!Array.isArray(value)) return [];
  return value.map((m) => lower(typeof m === 'string' ? m : m && (m.email || m.userEmail))).filter(Boolean);
}

function isOwnPeople(obj, me) {
  if (!me || !obj || typeof obj !== 'object') return false;
  if (lower(obj.addedByEmail) === me || lower(obj.postedByEmail) === me) return true;
  return ['collaborators', 'team', 'teamMembers'].some((k) => emailsIn(obj[k]).includes(me));
}

function clean(value, ctx, privileged) {
  if (Array.isArray(value)) return value.map((v) => clean(v, ctx, privileged)).filter((v) => v !== undefined);
  if (!value || typeof value !== 'object') {
    if (typeof value === 'string' && EMAIL.test(value.trim())) {
      return lower(value) === ctx.me || privileged ? value : undefined;
    }
    return value;
  }
  // Dates and Prisma Decimals serialise themselves (to strings); other non-plain objects pass through.
  if (typeof value.toJSON === 'function') return value.toJSON();
  if (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) return value;

  const own = privileged || isOwnPeople(value, ctx.me);
  const out = {};
  for (const [key, v] of Object.entries(value)) {
    if (PHONE_KEYS.has(key) && typeof v === 'string') {
      if (ctx.me) out[key] = v;
      continue;
    }
    if (ACTOR_LISTS.has(key) && Array.isArray(v)) {
      out[key] = v
        .filter((m) => (typeof m === 'string' ? lower(m) === ctx.me : emailsIn([m]).includes(ctx.me)))
        .map((m) => clean(m, ctx, false));
      continue;
    }
    // An item's own people see its people lists (collaborators, team, invited, who added a
    // link) in full, but not other members' activity (comments, upvotes, likes).
    const cleaned = clean(v, ctx, NO_PRIVILEGE.has(key) ? false : own);
    if (cleaned !== undefined) out[key] = cleaned;
  }
  return out;
}

function privacy(req, res, next) {
  const json = res.json.bind(res);
  res.json = (body) => {
    // Staff (who verify and follow up on submissions) see responses unfiltered.
    if (STAFF_ROLES.has(req.user?.adminProfile?.publicRole)) return json(body);
    const me = lower(req.user?.email) || null;
    try {
      return json(clean(body, { me }, false));
    } catch (err) {
      console.error('Privacy filter failed; response withheld:', err.message);
      res.status(500);
      return json({ message: 'Internal server error' });
    }
  };
  next();
}

module.exports = privacy;
