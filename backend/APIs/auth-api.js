const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const prisma = require('../config/prisma');

router.post('/google', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is required' });
  }

  // Create client inside the handler so it always reads the env var at runtime
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const normalizedEmail = String(payload.email || '').toLowerCase();

    // Determine if this email should be auto-promoted to admin
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);

    const shouldBeAdmin = adminEmails.includes(normalizedEmail);

    // Generate a fresh adminToken if this user is (or will be) an admin
    const adminToken = shouldBeAdmin ? uuidv4() : null;
    const adminTokenCreatedAt = shouldBeAdmin ? new Date() : null;

    // Every logged-in user gets a session token, not just admins/wing roles -
    // otherwise there's no way for the backend to know who's actually making a
    // request, and every ownership check has to trust whatever email the client
    // sends. Preserve a still-valid token across logins (same 30-day policy as
    // adminToken) so re-logging-in on the same device doesn't invalidate it.
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { sessionToken: true, sessionTokenCreatedAt: true }
    });
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const hasValidSessionToken =
      existingUser &&
      Boolean(existingUser.sessionToken) &&
      (!existingUser.sessionTokenCreatedAt ||
        Date.now() - existingUser.sessionTokenCreatedAt.getTime() <= thirtyDays);
    const sessionToken = hasValidSessionToken ? existingUser.sessionToken : uuidv4();
    const sessionTokenCreatedAt = hasValidSessionToken ? existingUser.sessionTokenCreatedAt : new Date();

    // Build update object
    const updateData = {
      name: payload.name,
      picture: payload.picture,
      updatedAt: new Date(),
      sessionToken,
      sessionTokenCreatedAt,
    };

    if (shouldBeAdmin) {
      updateData.role = 'ADMIN';
      updateData.adminToken = adminToken;
      updateData.adminTokenCreatedAt = adminTokenCreatedAt;
    }

    // Save to DB using upsert and get back the full document including id
    const dbUser = await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: updateData,
      create: {
        email: normalizedEmail,
        name: payload.name,
        picture: payload.picture,
        role: shouldBeAdmin ? 'ADMIN' : 'STUDENT',
        adminToken,
        adminTokenCreatedAt,
        sessionToken,
        sessionTokenCreatedAt,
      },
    });

    const user = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      picture: dbUser.picture,
      role: dbUser.role.toLowerCase(),
      sessionToken: dbUser.sessionToken,
      // WING_MEMBER/WING_MASTER also get an adminToken issued (see admin-api.js's
      // role-promotion endpoint) since problem/idea verification and posting
      // announcements are gated on it too, not just ADMIN.
      ...(['ADMIN', 'WING_MEMBER', 'WING_MASTER'].includes(dbUser.role) && { adminToken: dbUser.adminToken }),
    };

    return res.json({ success: true, user });

  } catch (err) {
    console.error('Google login error:', err.message);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;
