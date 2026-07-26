const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const User = require('../models/User');
const Startup = require('../models/Startup');
const Ideas = require('../models/Ideas');
const Problems = require('../models/Problems');

// Apply admin auth to all routes in this router
router.use(adminAuth);

// ─── STATS ──────────────────────────────────────────────────────────────────

/**
 * GET /admin-api/stats
 * Returns aggregate counts for the dashboard overview
 */
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalStartups, totalIdeas, totalProblems,
           adminCount, recentUsers, recentStartups] = await Promise.all([
      User.countDocuments(),
      Startup.countDocuments(),
      Ideas.countDocuments(),
      Problems.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      User.find().sort({ updatedAt: -1 }).limit(5).select('name email picture role updatedAt'),
      Startup.find().sort({ createdAt: -1 }).limit(5).select('startupName tagline stage createdAt'),
    ]);

    // Monthly growth — last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [userGrowth, startupGrowth] = await Promise.all([
      User.aggregate([
        { $match: { updatedAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { year: { $year: '$updatedAt' }, month: { $month: '$updatedAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      Startup.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStartups,
        totalIdeas,
        totalProblems,
        adminCount,
      },
      charts: { userGrowth, startupGrowth },
      recent: { users: recentUsers, startups: recentStartups }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ success: false, message: 'Failed to load stats' });
  }
});

// ─── USERS ───────────────────────────────────────────────────────────────────

/**
 * GET /admin-api/users
 * Returns all users with pagination
 */
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';

    const query = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {};

    const [users, total] = await Promise.all([
      User.find(query)
        .select('name email picture role updatedAt')
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(query)
    ]);

    res.json({ success: true, users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ success: false, message: 'Failed to load users' });
  }
});

/**
 * PATCH /admin-api/users/:id/role
 * Promote or demote a user's role
 */
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    // Prevent self-demotion
    if (req.adminUser._id.toString() === req.params.id && role === 'user') {
      return res.status(400).json({ success: false, message: 'You cannot demote yourself' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, ...(role === 'user' ? { adminToken: null, adminTokenCreatedAt: null } : {}) },
      { new: true }
    ).select('name email role');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    console.error('Admin role update error:', err);
    res.status(500).json({ success: false, message: 'Failed to update role' });
  }
});

/**
 * DELETE /admin-api/users/:id
 * Delete a user
 */
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.adminUser._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete yourself' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    console.error('Admin delete user error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
});

// ─── STARTUPS ────────────────────────────────────────────────────────────────

/**
 * GET /admin-api/startups
 * All startups with full details for admin review
 */
router.get('/startups', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const stageFilter = req.query.stage;

    const query = {};
    if (search) query.startupName = { $regex: search, $options: 'i' };
    if (stageFilter) query.stage = parseInt(stageFilter);

    const [startups, total] = await Promise.all([
      Startup.find(query)
        .populate('createdBy', 'name email picture')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Startup.countDocuments(query)
    ]);

    res.json({ success: true, startups, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Admin startups error:', err);
    res.status(500).json({ success: false, message: 'Failed to load startups' });
  }
});

/**
 * PATCH /admin-api/startups/:id/stage
 * Update startup stage (1–9)
 */
router.patch('/startups/:id/stage', async (req, res) => {
  try {
    const { stage } = req.body;
    if (!stage || stage < 1 || stage > 9) {
      return res.status(400).json({ success: false, message: 'Stage must be 1–9' });
    }

    const startup = await Startup.findByIdAndUpdate(
      req.params.id,
      { stage },
      { new: true }
    ).select('startupName stage');

    if (!startup) return res.status(404).json({ success: false, message: 'Startup not found' });

    res.json({ success: true, startup });
  } catch (err) {
    console.error('Admin stage update error:', err);
    res.status(500).json({ success: false, message: 'Failed to update stage' });
  }
});

// ─── IDEAS ───────────────────────────────────────────────────────────────────

/**
 * GET /admin-api/ideas
 * All ideas for admin review
 */
router.get('/ideas', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';

    const query = search ? { title: { $regex: search, $options: 'i' } } : {};

    const [ideas, total] = await Promise.all([
      Ideas.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Ideas.countDocuments(query)
    ]);

    res.json({ success: true, ideas, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Admin ideas error:', err);
    res.status(500).json({ success: false, message: 'Failed to load ideas' });
  }
});

// ─── PROBLEMS ────────────────────────────────────────────────────────────────

/**
 * GET /admin-api/problems
 * All problems for admin review
 */
router.get('/problems', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';

    const query = search ? { title: { $regex: search, $options: 'i' } } : {};

    const [problems, total] = await Promise.all([
      Problems.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Problems.countDocuments(query)
    ]);

    res.json({ success: true, problems, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Admin problems error:', err);
    res.status(500).json({ success: false, message: 'Failed to load problems' });
  }
});

module.exports = router;
