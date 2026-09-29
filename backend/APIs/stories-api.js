const express = require('express');
const multer = require('multer');
const router = express.Router();
const prisma = require('../config/prisma');
const cloudinary = require('../config/cloudinary');
const verifierAuth = require('../middlewares/verifierAuth');

// Success stories: anyone can read published ones; admins and wing masters write them up, edit
// them and hide them (the same people who post announcements).
const WRITER_ROLES = ['ADMIN', 'WING_MASTER'];

const writerAuth = [
  verifierAuth,
  (req, res, next) => {
    const role = req.user?.adminProfile?.publicRole;
    if (!WRITER_ROLES.includes(role)) {
      return res.status(403).json({ success: false, message: 'Only admins and wing masters can write stories' });
    }
    next();
  },
];

// Photos go straight to Cloudinary from memory; nothing is kept on the server's disk.
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files can be uploaded'));
  },
});

// ---------------------------------------------------------------------------------------------
// Input cleaning: the nested parts are stored as JSON, so only known fields of the right type
// are kept, strings are trimmed and length-capped, and empty entries are dropped.

const str = (v, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const url = (v) => {
  const s = str(v, 1000);
  return /^(https?:\/\/|\/)/i.test(s) ? s : '';
};
const list = (v, max = 30) => (Array.isArray(v) ? v.slice(0, max) : []);
const strings = (v, max = 20, len = 200) => list(v, max).map((s) => str(s, len)).filter(Boolean);
const compact = (obj) => Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== '' && value !== undefined));

const SOCIAL = ['linkedin', 'instagram', 'twitter', 'github', 'portfolio'];

function cleanStory(body, { partial = false } = {}) {
  const out = {};
  const has = (key) => !partial || Object.prototype.hasOwnProperty.call(body, key);

  if (has('programId')) out.programId = str(body.programId, 120);
  if (has('season')) out.season = str(body.season, 120);
  if (has('title')) out.title = str(body.title, 200);
  if (has('subtitle')) out.subtitle = str(body.subtitle, 400);
  if (has('date')) out.storyDate = str(body.date, 40);
  if (has('overview')) out.overview = str(body.overview, 8000);
  if (has('featured')) out.featured = body.featured === true;

  if (has('participants')) {
    out.participants = list(body.participants, 20)
      .map((p) => compact({
        name: str(p?.name, 120),
        branch: str(p?.branch, 120),
        year: str(p?.year, 40),
        role: str(p?.role, 120),
        imageUrl: url(p?.imageUrl),
        socialLinks: list(p?.socialLinks, 6)
          .map((l) => compact({ platform: SOCIAL.includes(l?.platform) ? l.platform : 'portfolio', url: url(l?.url), displayName: str(l?.displayName, 40) }))
          .filter((l) => l.url),
      }))
      .filter((p) => p.name);
  }
  if (has('journey')) {
    out.journey = list(body.journey, 20)
      .map((j) => compact({ phase: str(j?.phase, 200), description: str(j?.description, 1000), achievement: str(j?.achievement, 500) }))
      .filter((j) => j.phase);
  }
  if (has('outcomes')) {
    out.outcomes = list(body.outcomes, 12)
      .map((o) => compact({ title: str(o?.title, 200), description: str(o?.description, 1000), metrics: str(o?.metrics, 200) }))
      .filter((o) => o.title);
  }
  if (has('quotes')) {
    out.quotes = list(body.quotes, 6)
      .map((q) => compact({ text: str(q?.text, 1500), author: str(q?.author, 120), designation: str(q?.designation, 160) }))
      .filter((q) => q.text);
  }
  if (has('gallery')) {
    out.gallery = list(body.gallery, 24)
      .map((g) => compact({ type: g?.type === 'video' ? 'video' : 'image', url: url(g?.url), caption: str(g?.caption, 300) }))
      .filter((g) => g.url);
  }
  if (has('tags')) out.tags = strings(body.tags, 12, 60);
  if (has('achievements')) out.achievements = strings(body.achievements, 12, 200);
  return out;
}

function problemsWith(story, { partial = false } = {}) {
  const missing = [];
  if (!partial || 'programId' in story) if (!story.programId) missing.push('program');
  if (!partial || 'season' in story) if (!story.season) missing.push('season or batch');
  if (!partial || 'title' in story) if (!story.title) missing.push('title');
  if (!partial || 'participants' in story) if (!story.participants?.length) missing.push('at least one student');
  return missing;
}

// The public shape matches what the story pages render (date, not storyDate; no poster email).
function toPublic(row) {
  const { storyDate, postedByEmail, isPublished, ...rest } = row;
  return { ...rest, date: storyDate, contentType: 'web' };
}

const slugify = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-').slice(0, 70).replace(/-+$/, '');

async function uniqueId(base) {
  const root = base || 'story';
  for (let n = 1; n < 50; n++) {
    const id = n === 1 ? root : `${root}-${n}`;
    if (!(await prisma.successStory.findUnique({ where: { id }, select: { id: true } }))) return id;
  }
  return `${root}-${Date.now()}`;
}

// ---------------------------------------------------------------------------------------------

// GET /story-api/stories?programId=... — published stories, newest first
router.get('/stories', async (req, res) => {
  try {
    const programId = str(req.query.programId, 120);
    const stories = await prisma.successStory.findMany({
      where: { isPublished: true, ...(programId && { programId }) },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });
    res.json({ success: true, stories: stories.map(toPublic) });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stories' });
  }
});

// GET /story-api/stories/:id — one published story
router.get('/stories/:id', async (req, res) => {
  try {
    const story = await prisma.successStory.findFirst({ where: { id: req.params.id, isPublished: true } });
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    res.json({ success: true, story: toPublic(story) });
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch story' });
  }
});

// POST /story-api/stories — write up a new story (admins and wing masters)
router.post('/stories', writerAuth, async (req, res) => {
  try {
    const data = cleanStory(req.body || {});
    const missing = problemsWith(data);
    if (missing.length) {
      return res.status(400).json({ success: false, message: `Missing: ${missing.join(', ')}` });
    }
    const id = await uniqueId(slugify(`${data.title} ${data.participants[0].name.split(' ')[0]}`));
    const story = await prisma.successStory.create({
      data: {
        ...data,
        id,
        postedByName: [req.user.firstName, req.user.lastName].filter(Boolean).join(' ') || req.user.displayName || '',
        postedByEmail: req.user.email || '',
      },
    });
    res.status(201).json({ success: true, story: toPublic(story) });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ success: false, message: 'Failed to create story' });
  }
});

// PATCH /story-api/stories/:id — edit any part of a story
router.patch('/stories/:id', writerAuth, async (req, res) => {
  try {
    const data = cleanStory(req.body || {}, { partial: true });
    const missing = problemsWith(data, { partial: true });
    if (missing.length) {
      return res.status(400).json({ success: false, message: `Can't be empty: ${missing.join(', ')}` });
    }
    if (req.body && typeof req.body.isPublished === 'boolean') data.isPublished = req.body.isPublished;
    const story = await prisma.successStory.update({ where: { id: req.params.id }, data });
    res.json({ success: true, story: toPublic(story) });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Story not found' });
    console.error('Error updating story:', error);
    res.status(500).json({ success: false, message: 'Failed to update story' });
  }
});

// DELETE /story-api/stories/:id — hide it (soft delete; PATCH isPublished: true brings it back)
router.delete('/stories/:id', writerAuth, async (req, res) => {
  try {
    await prisma.successStory.update({ where: { id: req.params.id }, data: { isPublished: false } });
    res.json({ success: true, message: 'Story hidden' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Story not found' });
    console.error('Error hiding story:', error);
    res.status(500).json({ success: false, message: 'Failed to hide story' });
  }
});

// POST /story-api/upload — one photo (field "image"), returned as a Cloudinary URL
router.post('/upload', writerAuth, (req, res) => {
  imageUpload.single('image')(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'No image received' });
    try {
      const dataURI = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(dataURI, { folder: 'success_stories', resource_type: 'image' });
      res.status(201).json({ success: true, url: result.secure_url });
    } catch (error) {
      console.error('Error uploading story image:', error);
      res.status(502).json({ success: false, message: 'Image upload failed' });
    }
  });
});

module.exports = router;
