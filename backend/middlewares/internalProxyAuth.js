const prisma = require('../config/prisma');

/**
 * Shared-secret, server-to-server auth for requests forwarded by Django's
 * admin microservice proxy (AdminMicroserviceProxyBase in
 * apps/api/plane/vj_startups/views/admin.py). Reuses the same
 * PLANE_INTERNAL_TOKEN/PUBLIC_SITE_INTERNAL_TOKEN shared secret the
 * public-auth upsert bridge already requires (public_auth.py), instead of
 * introducing a second secret.
 *
 * Why this exists: the proxy used to forward one specific admin's personal
 * publicAdminToken for every request, so every write made through the admin
 * panel - by any real Instance Admin - was attributed to that one configured
 * account (verifiedBy, req.adminUser.id self-checks, etc. all pointed at the
 * wrong user). Django already authenticates the real acting admin via its own
 * session before ever reaching this proxy; this lets it vouch for who that
 * admin actually is via the X-Acting-Admin-Email header, authenticated by the
 * shared secret rather than a per-user token that also happened to expire
 * every 30 days.
 *
 * Returns the resolved { user, profile } pair on success, or null if this
 * request isn't using this path at all (no X-Internal-Token header) so the
 * caller can fall back to the normal personal-token flow. Throws only for
 * malformed/invalid attempts so the caller can respond with the right status.
 */
class InternalProxyAuthError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function tryInternalProxyAuth(req, allowedRoles) {
  const internalToken = req.headers['x-internal-token'];
  if (!internalToken) {
    return null; // Not using this path - caller falls back to personal token auth
  }

  const expectedToken = process.env.PLANE_INTERNAL_TOKEN;
  if (!expectedToken || internalToken !== expectedToken) {
    throw new InternalProxyAuthError(401, 'Invalid internal token');
  }

  const actingEmail = (req.headers['x-acting-admin-email'] || '').trim().toLowerCase();
  if (!actingEmail) {
    throw new InternalProxyAuthError(400, 'X-Acting-Admin-Email header required');
  }

  const profile = await prisma.organizationMemberProfile.findFirst({
    where: {
      user: { email: actingEmail },
      publicRole: { in: allowedRoles },
      deletedAt: null,
    },
    include: { user: true },
  });

  if (!profile || !profile.user.isActive) {
    throw new InternalProxyAuthError(
      403,
      `Access denied: ${actingEmail} is not an active user with one of [${allowedRoles.join(', ')}]`
    );
  }

  return { user: profile.user, profile };
}

module.exports = { tryInternalProxyAuth, InternalProxyAuthError };
