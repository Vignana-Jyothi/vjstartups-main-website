const prisma = require('../config/prisma');

/**
 * General authentication middleware for any logged-in user (any role).
 * Expects: Authorization: Bearer <sessionToken>
 * Same Bearer-token model as adminAuth.js/verifierAuth.js, but with no role
 * restriction - this is for "prove you're the user you claim to be", not
 * privilege gating. Sets req.user.
 */
const userAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token is empty' });
  }

  try {
    const profile = await prisma.organizationMemberProfile.findFirst({
      where: { publicSessionToken: token, deletedAt: null },
      include: { user: true },
    });

    if (!profile || !profile.user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid session token' });
    }

    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (profile.publicSessionTokenCreatedAt && Date.now() - profile.publicSessionTokenCreatedAt.getTime() > thirtyDays) {
      return res.status(401).json({ success: false, message: 'Session expired — please log in again' });
    }

    req.user = { ...profile.user, adminProfile: profile };
    next();
  } catch (err) {
    console.error('User auth middleware error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = userAuth;
