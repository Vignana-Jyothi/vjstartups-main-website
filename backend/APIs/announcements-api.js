const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// GET /announcements-api/ — returns all active announcements, sorted by createdAt descending
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .sort({ createdAt: -1 });
    
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
    const announcement = new Announcement({
      title,
      content,
      postedBy: {
        name: posterName || 'Anonymous',
        email: posterEmail || ''
      }
    });

    await announcement.save();

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

    const announcement = await Announcement.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    res.json({
      success: true,
      message: 'Announcement deleted successfully',
      announcement
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete announcement'
    });
  }
});

module.exports = router;
