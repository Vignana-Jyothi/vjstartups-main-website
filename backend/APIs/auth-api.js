const express = require('express');
const { OAuth2Client } = require('google-auth-library');
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

    // Save to DB and get back the full document including _id
    const dbUser = await User.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        name: payload.name,
        picture: payload.picture,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    const user = {
      id: dbUser._id.toString(),
      name: dbUser.name,
      email: dbUser.email,
      picture: dbUser.picture,
    };

    return res.json({ success: true, user });

  } catch (err) {
    console.error('Google login error:', err.message);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;