const express = require('express');
const multer = require('multer');
const router = express.Router();
const prisma = require('../config/prisma');
const cloudinary = require('../config/cloudinary');
const verifierAuth = require('../middlewares/verifierAuth');
const { KINDS, cleanItem, group } = require('../config/siteContent');

// The site's editable content (programs, funded ventures, wings, the club's text and numbers,
// the home page's Signals). Anyone can read what's published; admins and wing masters edit it
// from /manage, the same people who write success stories.
const EDITOR_ROLES = ['ADMIN', 'WING_MASTER'];

const editorAuth = [
  verifierAuth,
  (req, res, next) => {
    const role = req.user?.adminProfile?.publicRole;
    if (!EDITOR_ROLES.includes(role)) {
      return res.status(403).json({ success: false, message: 'Only admins and wing masters can edit site content' });
    }
    next();
  },
];

const ORDER = [{ kind: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }];

// Every page reads this, so the published set is kept for a minute; any edit clears it.
let cache = null;
const CACHE_MS = 60 * 1000;

const editorName = (user) => [user.firstName, user.lastName].filter(Boolean).join(' ') || user.displayName || '';

// GET /content-api — everything published, grouped by kind
router.get('/', async (req, res) => {
  try {
    if (!cache || Date.now() - cache.at > CACHE_MS) {
      const rows = await prisma.siteContent.findMany({ where: { isPublished: true }, orderBy: ORDER });
      cache = { at: Date.now(), body: { success: true, ...group(rows) } };
    }
    res.set('Cache-Control', 'public, max-age=60');
    res.json(cache.body);
  } catch (error) {
    console.error('Error fetching site content:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch site content' });
  }
});

// GET /content-api/manage — everything, hidden items included, for the editors' page
router.get('/manage', editorAuth, async (req, res) => {
  try {
    const rows = await prisma.siteContent.findMany({ orderBy: ORDER });
    res.json({ success: true, ...group(rows, { withState: true }) });
  } catch (error) {
    console.error('Error fetching site content for editing:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch site content' });
  }
});

// PUT /content-api/:kind/:slug — create or replace one item
router.put('/:kind/:slug', editorAuth, async (req, res) => {
  const { kind, slug } = req.params;
  const { data, error } = cleanItem(kind, slug, req.body);
  if (error) return res.status(400).json({ success: false, message: error });
  try {
    const last = await prisma.siteContent.findFirst({ where: { kind }, orderBy: { sortOrder: 'desc' }, select: { sortOrder: true } });
    const by = { updatedByName: editorName(req.user), updatedByEmail: req.user.email || '' };
    const row = await prisma.siteContent.upsert({
      where: { kind_slug: { kind, slug } },
      create: { kind, slug, data, sortOrder: (last?.sortOrder ?? 0) + 10, ...by },
      update: { data, ...by },
    });
    cache = null;
    res.json({ success: true, item: { ...row.data, id: row.slug, isPublished: row.isPublished, sortOrder: row.sortOrder } });
  } catch (err) {
    console.error('Error saving site content:', err);
    res.status(500).json({ success: false, message: 'Failed to save' });
  }
});

// PATCH /content-api/:kind/:slug — show or hide it ({ isPublished })
router.patch('/:kind/:slug', editorAuth, async (req, res) => {
  const { kind, slug } = req.params;
  if (!KINDS[kind] || typeof req.body?.isPublished !== 'boolean') {
    return res.status(400).json({ success: false, message: 'Send { isPublished: true | false }' });
  }
  try {
    await prisma.siteContent.update({
      where: { kind_slug: { kind, slug } },
      data: { isPublished: req.body.isPublished, updatedByName: editorName(req.user), updatedByEmail: req.user.email || '' },
    });
    cache = null;
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Not found' });
    console.error('Error updating site content:', error);
    res.status(500).json({ success: false, message: 'Failed to update' });
  }
});

// POST /content-api/:kind/order — { slugs: [...] } in the order they should appear
router.post('/:kind/order', editorAuth, async (req, res) => {
  const { kind } = req.params;
  const slugs = Array.isArray(req.body?.slugs) ? req.body.slugs.filter((s) => typeof s === 'string').slice(0, 200) : [];
  if (!KINDS[kind] || !slugs.length) return res.status(400).json({ success: false, message: 'Send { slugs: [...] }' });
  try {
    await prisma.$transaction(
      slugs.map((slug, i) => prisma.siteContent.updateMany({ where: { kind, slug }, data: { sortOrder: (i + 1) * 10 } })),
    );
    cache = null;
    res.json({ success: true });
  } catch (error) {
    console.error('Error reordering site content:', error);
    res.status(500).json({ success: false, message: 'Failed to reorder' });
  }
});

// Photos (a venture's picture) go straight to Cloudinary from memory.
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files can be uploaded'));
  },
});

// POST /content-api/upload — one photo (field "image"), returned as a Cloudinary URL
router.post('/upload', editorAuth, (req, res) => {
  imageUpload.single('image')(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'No image received' });
    try {
      const dataURI = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(dataURI, { folder: 'site_content', resource_type: 'image' });
      res.status(201).json({ success: true, url: result.secure_url });
    } catch (error) {
      console.error('Error uploading site content image:', error);
      res.status(502).json({ success: false, message: 'Image upload failed' });
    }
  });
});

module.exports = router;
