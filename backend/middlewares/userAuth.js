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
    const user = await prisma.user.findFirst({
      where: { sessionToken: token }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid session token' });
    }

    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (user.sessionTokenCreatedAt && Date.now() - user.sessionTokenCreatedAt.getTime() > thirtyDays) {
      return res.status(401).json({ success: false, message: 'Session expired — please log in again' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('User auth middleware error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = userAuth;
