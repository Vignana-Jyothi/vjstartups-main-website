const prisma = require('../config/prisma');
const { tryInternalProxyAuth, InternalProxyAuthError } = require('./internalProxyAuth');

/**
 * Admin authentication middleware.
 * Expects either:
 *   - X-Internal-Token + X-Acting-Admin-Email (Django's admin proxy,
 *     forwarding the real acting admin's identity - see internalProxyAuth.js)
 *   - Authorization: Bearer <adminToken>, a UUID generated at login time and
 *     stored on the OrganizationMemberProfile linked to this user
 *     (Django/Plane-owned table - see public_auth.py on the Plane side for
 *     why user identity lives there now)
 */
const adminAuth = async (req, res, next) => {
  try {
    const viaProxy = await tryInternalProxyAuth(req, ['ADMIN']);
    if (viaProxy) {
      req.adminUser = { ...viaProxy.user, adminProfile: viaProxy.profile };
      return next();
    }
  } catch (err) {
    if (err instanceof InternalProxyAuthError) {
      return res.status(err.status).json({ success: false, message: err.message });
    }
    console.error('Admin auth middleware error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }

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
        publicRole: 'ADMIN',
        deletedAt: null,
      },
      include: { user: true },
    });

    if (!profile || !profile.user.isActive) {
      return res.status(403).json({ success: false, message: 'Access denied: not an admin or invalid token' });
    }

    // Token expiry check: 30 days
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (profile.publicAdminTokenCreatedAt && Date.now() - profile.publicAdminTokenCreatedAt.getTime() > thirtyDays) {
      return res.status(401).json({ success: false, message: 'Admin session expired — please log in again' });
    }

    // Flattened so req.adminUser.id/.email etc. keep working like before;
    // .adminProfile carries the role/token fields for anything that needs them.
    req.adminUser = { ...profile.user, adminProfile: profile };
    next();
  } catch (err) {
    console.error('Admin auth middleware error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = adminAuth;
