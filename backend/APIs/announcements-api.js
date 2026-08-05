const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// GET /announcements-api/ — returns all active announcements, sorted by createdAt descending
router.get('/', async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({
      success: true,
      announcements
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements'
    });
  }
});

// POST /announcements-api/ — create announcement (admin or wing master only)
router.post('/', async (req, res) => {
  try {
    const { title, content, posterEmail, posterName } = req.body;

    // Basic validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    // Create new announcement
    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        postedByName: posterName || 'Anonymous',
        postedByEmail: posterEmail || '',
        isActive: true
      }
    });

    res.status(201).json({
      success: true,
      announcement
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create announcement'
    });
  }
});

// DELETE /announcements-api/:id — soft delete (set isActive: false)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await prisma.announcement.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'Announcement deleted successfully',
      announcement
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    console.error('Error deleting announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete announcement'
    });
  }
});

module.exports = router;
