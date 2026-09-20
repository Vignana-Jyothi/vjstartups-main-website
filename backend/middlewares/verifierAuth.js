const prisma = require('../config/prisma');

/**
 * Verifier authentication middleware.
 * Expects: Authorization: Bearer <adminToken>
 * Same Bearer-token model as adminAuth.js, but accepts WING_MEMBER and
 * WING_MASTER in addition to ADMIN, since problem verification is a
 * talent-wing responsibility, not an admin-only one. Sets req.user
 * (not req.adminUser) since callers only need to know who verified it.
 */
const ALLOWED_ROLES = ['WING_MEMBER', 'WING_MASTER', 'ADMIN'];

const verifierAuth = async (req, res, next) => {
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
      where: {
        publicAdminToken: token,
        publicRole: { in: ALLOWED_ROLES },
        deletedAt: null,
      },
      include: { user: true },
    });

    if (!profile || !profile.user.isActive) {
      return res.status(403).json({ success: false, message: 'Access denied: requires wing member, wing master, or admin role' });
    }

    // Token expiry check: 30 days (matches adminAuth.js's policy)
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (profile.publicAdminTokenCreatedAt && Date.now() - profile.publicAdminTokenCreatedAt.getTime() > thirtyDays) {
      return res.status(401).json({ success: false, message: 'Session expired — please log in again' });
    }

    req.user = { ...profile.user, adminProfile: profile };
    next();
  } catch (err) {
    console.error('Verifier auth middleware error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = verifierAuth;
