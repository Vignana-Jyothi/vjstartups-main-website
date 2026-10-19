const express = require('express');
const router = express.Router();
const { normalizeHandle, isValidHandle, createProfileLoader } = require('../lib/profileLoader');

// Public member profiles live in VJOS (Plane). The site's pages can't read VJOS from the browser
// (it sends no CORS headers for the site), so this route fetches the profile server-to-server and
// passes it on. VJOS has already decided what is public - a member's profile is only returned
// once they have published it, and only the fields meant for the public - so nothing is added or
// filtered here. Cached briefly (see lib/profileLoader.js) so page views don't each hit VJOS.

const loader = createProfileLoader();

// GET /profile-api/:handle
router.get('/:handle', async (req, res) => {
  const handle = normalizeHandle(req.params.handle);
  if (!isValidHandle(handle)) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }
  try {
    const result = await loader.load(handle);
    if (result.notFound) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.set('Cache-Control', 'public, max-age=60');
    res.json({ success: true, profile: result.profile });
  } catch (error) {
    console.error('Error loading profile from VJOS:', error.message);
    res.status(502).json({ success: false, message: 'Profile unavailable' });
  }
});

module.exports = router;
