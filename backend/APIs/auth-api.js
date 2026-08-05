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

    // Build update object
    const updateData = {
      name: payload.name,
      picture: payload.picture,
      updatedAt: new Date(),
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
      },
    });

    const user = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      picture: dbUser.picture,
      role: dbUser.role.toLowerCase(),
      // Only include adminToken if this user is an admin
      ...(dbUser.role === 'ADMIN' && { adminToken: dbUser.adminToken }),
    };

    return res.json({ success: true, user });

  } catch (err) {
    console.error('Google login error:', err.message);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;
