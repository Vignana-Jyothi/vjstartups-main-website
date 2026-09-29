const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();

const TOKEN_ROLES = ['ADMIN', 'WING_MEMBER', 'WING_MASTER'];

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

    // User creation/lookup happens in Django now, not here - see
    // public_auth.py for why (it owns the users table, needs to fire its own
    // onboarding signals, and has ~30 bookkeeping columns Prisma shouldn't
    // touch directly). We've already verified the Google ID token above, so
    // this internal call is trusted purely by the shared secret, not a user
    // session - it must never be reachable from a browser.
    const planeResponse = await fetch(`${process.env.PLANE_API_URL}/api/vj-startups/public-auth/upsert-user/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Token': process.env.PLANE_INTERNAL_TOKEN,
      },
      body: JSON.stringify({
        email: normalizedEmail,
        first_name: payload.given_name || '',
        last_name: payload.family_name || '',
        picture: payload.picture || '',
        should_be_admin: shouldBeAdmin,
      }),
    });

    if (!planeResponse.ok) {
      const errBody = await planeResponse.text();
      console.error('Plane user-upsert failed:', planeResponse.status, errBody);
      return res.status(502).json({ success: false, message: 'Failed to reach the identity service' });
    }

    const dbUser = await planeResponse.json();

    const user = {
      id: dbUser.id,
      name: [dbUser.first_name, dbUser.last_name].filter(Boolean).join(' ') || normalizedEmail,
      email: dbUser.email,
      picture: dbUser.avatar,
      role: dbUser.public_role.toLowerCase(),
      sessionToken: dbUser.public_session_token,
      // WING_MEMBER/WING_MASTER also get an adminToken since problem/idea
      // verification and posting announcements are gated on it too, not just ADMIN.
      ...(TOKEN_ROLES.includes(dbUser.public_role) && { adminToken: dbUser.public_admin_token }),
    };

    return res.json({ success: true, user });

  } catch (err) {
    console.error('Google login error:', err.message);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;
