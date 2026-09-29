const prisma = require('../config/prisma');
const userAuth = require('./userAuth');

/**
 * Login required, and the request acts as the logged-in user.
 *
 * Routes used to take the actor's identity from fields in the request body (addedByEmail,
 * email, name, userEmail...), so anyone could post, vote or comment as anyone else. This runs
 * userAuth (Authorization: Bearer <sessionToken>) and then overwrites the listed identity fields
 * with the logged-in user's own email and name, so the route handlers can keep reading them.
 *
 * Put it after any multer middleware on multipart routes: multer is what fills req.body.
 *
 *   actingUser({ email: ['email'], name: ['name'] })
 */
function displayName(user) {
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.displayName || user.email;
}

function actingUser({ email = [], name = [] } = {}) {
  return (req, res, next) => {
    userAuth(req, res, (err) => {
      if (err) return next(err);
      if (!req.user?.email) {
        return res.status(403).json({ success: false, message: 'Your account has no email on record' });
      }
      req.body = req.body || {};
      for (const field of email) req.body[field] = req.user.email;
      for (const field of name) req.body[field] = displayName(req.user);
      next();
    });
  };
}

/**
 * Login optional: when a valid session token is sent, req.user is set; otherwise the request
 * continues anonymously. Never trusts an email from the URL or headers.
 */
async function optionalUser(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) return next();
  const token = header.slice(7).trim();
  if (!token) return next();
  try {
    const profile = await prisma.organizationMemberProfile.findFirst({
      where: { publicSessionToken: token, deletedAt: null },
      include: { user: true },
    });
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const expired = profile?.publicSessionTokenCreatedAt && Date.now() - profile.publicSessionTokenCreatedAt.getTime() > thirtyDays;
    if (profile && profile.user.isActive && !expired) req.user = { ...profile.user, adminProfile: profile };
  } catch (err) {
    console.error('Optional auth lookup failed:', err.message);
  }
  next();
}

module.exports = { actingUser, optionalUser, displayName };
