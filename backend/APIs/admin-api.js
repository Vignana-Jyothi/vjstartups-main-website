const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const prisma = require('../config/prisma');

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
      prisma.user.count(),
      prisma.startup.count(),
      prisma.idea.count(),
      prisma.problem.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.findMany({
        select: {
          name: true,
          email: true,
          picture: true,
          role: true,
          updatedAt: true
        },
        orderBy: { updatedAt: 'desc' },
        take: 5
      }),
      prisma.startup.findMany({
        select: {
          startupName: true,
          tagline: true,
          stage: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    // Monthly growth — last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Use raw queries for date grouping (PostgreSQL-specific)
    const userGrowth = await prisma.$queryRaw`
      SELECT 
        EXTRACT(YEAR FROM updated_at) as year,
        EXTRACT(MONTH FROM updated_at) as month,
        COUNT(*) as count
      FROM users
      WHERE updated_at >= ${sixMonthsAgo}
      GROUP BY year, month
      ORDER BY year, month
    `;

    const startupGrowth = await prisma.$queryRaw`
      SELECT 
        EXTRACT(YEAR FROM created_at) as year,
        EXTRACT(MONTH FROM created_at) as month,
        COUNT(*) as count
      FROM startups
      WHERE created_at >= ${sixMonthsAgo}
      GROUP BY year, month
      ORDER BY year, month
    `;

    // Format growth data to match original structure
    const formattedUserGrowth = userGrowth.map(row => ({
      _id: { year: Number(row.year), month: Number(row.month) },
      count: Number(row.count)
    }));

    const formattedStartupGrowth = startupGrowth.map(row => ({
      _id: { year: Number(row.year), month: Number(row.month) },
      count: Number(row.count)
    }));

    // Convert role enum to lowercase for frontend compatibility
    const formattedRecentUsers = recentUsers.map(user => ({
      ...user,
      role: user.role.toLowerCase()
    }));

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStartups,
        totalIdeas,
        totalProblems,
        adminCount,
      },
      charts: { 
        userGrowth: formattedUserGrowth, 
        startupGrowth: formattedStartupGrowth 
      },
      recent: { 
        users: formattedRecentUsers, 
        startups: recentStartups 
      }
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

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          picture: true,
          role: true,
          updatedAt: true
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    // Convert role enum to lowercase for frontend
    const formattedUsers = users.map(user => ({
      ...user,
      role: user.role.toLowerCase()
    }));

    res.json({ 
      success: true, 
      users: formattedUsers, 
      total, 
      page, 
      totalPages: Math.ceil(total / limit) 
    });
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
    const validRoles = ['user', 'admin', 'student', 'wing_member', 'wing_master'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    // Convert to enum format
    const enumRole = role.toUpperCase();

    // Prevent self-demotion
    if (req.adminUser.id === req.params.id && enumRole !== 'ADMIN') {
      return res.status(400).json({ success: false, message: 'You cannot demote yourself' });
    }

    const updateData = {
      role: enumRole
    };

    // Clear admin token if demoting from admin
    if (enumRole !== 'ADMIN') {
      updateData.adminToken = null;
      updateData.adminTokenCreatedAt = null;
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    // Convert role to lowercase for response
    const formattedUser = {
      ...user,
      role: user.role.toLowerCase()
    };

    res.json({ success: true, user: formattedUser });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
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
    if (req.adminUser.id === req.params.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete yourself' });
    }

    await prisma.user.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
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

    const where = {};
    if (search) {
      where.startupName = { contains: search, mode: 'insensitive' };
    }
    if (stageFilter) {
      where.stage = parseInt(stageFilter);
    }

    const [startups, total] = await Promise.all([
      prisma.startup.findMany({
        where,
        include: {
          creator: {
            select: {
              name: true,
              email: true,
              picture: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.startup.count({ where })
    ]);

    res.json({ 
      success: true, 
      startups, 
      total, 
      page, 
      totalPages: Math.ceil(total / limit) 
    });
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

    const startup = await prisma.startup.update({
      where: { id: req.params.id },
      data: { stage },
      select: {
        id: true,
        startupName: true,
        stage: true
      }
    });

    res.json({ success: true, startup });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }
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

    const where = search 
      ? { title: { contains: search, mode: 'insensitive' } } 
      : {};

    const [ideas, total] = await Promise.all([
      prisma.idea.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.idea.count({ where })
    ]);

    res.json({ 
      success: true, 
      ideas, 
      total, 
      page, 
      totalPages: Math.ceil(total / limit) 
    });
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

    const where = search 
      ? { title: { contains: search, mode: 'insensitive' } } 
      : {};

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.problem.count({ where })
    ]);

    res.json({ 
      success: true, 
      problems, 
      total, 
      page, 
      totalPages: Math.ceil(total / limit) 
    });
  } catch (err) {
    console.error('Admin problems error:', err);
    res.status(500).json({ success: false, message: 'Failed to load problems' });
  }
});

module.exports = router;
