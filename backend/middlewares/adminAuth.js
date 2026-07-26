const User = require('../models/User');

/**
 * Admin authentication middleware.
 * Expects: Authorization: Bearer <adminToken>
 * The adminToken is a UUID generated at login time and stored in the User document.
 */
const adminAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token is empty' });
  }

  try {
    const user = await User.findOne({ adminToken: token, role: 'admin' });

    if (!user) {
      return res.status(403).json({ success: false, message: 'Access denied: not an admin or invalid token' });
    }

    // Token expiry check: 30 days
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (user.adminTokenCreatedAt && Date.now() - user.adminTokenCreatedAt.getTime() > thirtyDays) {
      return res.status(401).json({ success: false, message: 'Admin session expired — please log in again' });
    }

    req.adminUser = user;
    next();
  } catch (err) {
    console.error('Admin auth middleware error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = adminAuth;
