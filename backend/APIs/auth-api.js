const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const User = require('../models/User');

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
    const adminToken = shouldBeAdmin ? uuidv4() : undefined;
    const adminTokenCreatedAt = shouldBeAdmin ? new Date() : undefined;

    // Build update object
    const updateData = {
      email: normalizedEmail,
      name: payload.name,
      picture: payload.picture,
      updatedAt: new Date(),
    };

    if (shouldBeAdmin) {
      updateData.role = 'admin';
      updateData.adminToken = adminToken;
      updateData.adminTokenCreatedAt = adminTokenCreatedAt;
    }

    // Save to DB and get back the full document including _id
    const dbUser = await User.findOneAndUpdate(
      { email: normalizedEmail },
      updateData,
      { upsert: true, new: true }
    );

    const user = {
      id: dbUser._id.toString(),
      name: dbUser.name,
      email: dbUser.email,
      picture: dbUser.picture,
      role: dbUser.role,
      // Only include adminToken if this user is an admin
      ...(dbUser.role === 'admin' && { adminToken: dbUser.adminToken }),
    };

    return res.json({ success: true, user });

  } catch (err) {
    console.error('Google login error:', err.message);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;