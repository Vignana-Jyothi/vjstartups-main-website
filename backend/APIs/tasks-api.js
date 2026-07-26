const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');

// ─── PROJECTS ────────────────────────────────────────────────────────────────

/**
 * GET /tasks-api/projects
 * Public: All active projects
 */
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find({ status: { $ne: 'archived' } })
      .sort({ createdAt: -1 });

    // Attach task counts per project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const [total, done] = await Promise.all([
          Task.countDocuments({ projectId: project._id }),
          Task.countDocuments({ projectId: project._id, status: 'done' })
        ]);
        return { ...project.toObject(), taskCount: total, completedCount: done };
      })
    );

    res.json({ success: true, projects: projectsWithCounts });
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ success: false, message: 'Failed to load projects' });
  }
});

/**
 * POST /tasks-api/projects
 * Create a new project (requires login — userId in body)
 */
router.post('/projects', async (req, res) => {
  try {
    const { name, description, color, emoji, createdBy, creatorName } = req.body;

    if (!name || !createdBy) {
      return res.status(400).json({ success: false, message: 'name and createdBy are required' });
    }

    const project = new Project({
      name,
      description,
      color: color || '#7c3aed',
      emoji: emoji || '📋',
      createdBy,
      members: [{ userId: createdBy, name: creatorName, role: 'lead' }]
    });

    await project.save();
    res.status(201).json({ success: true, project });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
});

/**
 * GET /tasks-api/projects/:id
 * Single project details
 */
router.get('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load project' });
  }
});

/**
 * PUT /tasks-api/projects/:id
 * Update project
 */
router.put('/projects/:id', async (req, res) => {
  try {
    const { name, description, color, emoji, status } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, color, emoji, status },
      { new: true, runValidators: true }
    );

    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
});

/**
 * DELETE /tasks-api/projects/:id
 * Delete project and all its tasks
 */
router.delete('/projects/:id', async (req, res) => {
  try {
    await Promise.all([
      Project.findByIdAndDelete(req.params.id),
      Task.deleteMany({ projectId: req.params.id })
    ]);

    res.json({ success: true, message: 'Project and all tasks deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
});

// ─── TASKS ───────────────────────────────────────────────────────────────────

/**
 * GET /tasks-api/tasks
 * All tasks for a project — grouped by status
 */
router.get('/tasks', async (req, res) => {
  try {
    const { projectId, status } = req.query;

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'projectId is required' });
    }

    const query = { projectId };
    if (status) query.status = status;

    const tasks = await Task.find(query).sort({ order: 1, createdAt: -1 });

    res.json({ success: true, tasks });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ success: false, message: 'Failed to load tasks' });
  }
});

/**
 * POST /tasks-api/tasks
 * Create a new task
 */
router.post('/tasks', async (req, res) => {
  try {
    const { title, description, projectId, priority, dueDate, labels, createdById, createdByName, assignee } = req.body;

    if (!title || !projectId || !createdById || !createdByName) {
      return res.status(400).json({ success: false, message: 'title, projectId, createdById, and createdByName are required' });
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // Get order (place at end of todo column)
    const lastTask = await Task.findOne({ projectId, status: 'todo' }).sort({ order: -1 });
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = new Task({
      title,
      description,
      projectId,
      priority: priority || 'none',
      dueDate: dueDate || null,
      labels: labels || [],
      order,
      assignee: assignee || { userId: null, name: null, picture: null },
      createdBy: { userId: createdById, name: createdByName }
    });

    await task.save();
    res.status(201).json({ success: true, task });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ success: false, message: 'Failed to create task' });
  }
});

/**
 * GET /tasks-api/tasks/:id
 * Single task detail with comments
 */
router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('projectId', 'name color emoji');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load task' });
  }
});

/**
 * PUT /tasks-api/tasks/:id
 * Full task update
 */
router.put('/tasks/:id', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, labels, assignee, order } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate, labels, assignee, order },
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
});

/**
 * PATCH /tasks-api/tasks/:id/status
 * Quick status update (for drag-and-drop)
 */
router.patch('/tasks/:id/status', async (req, res) => {
  try {
    const { status, order } = req.body;
    const validStatuses = ['todo', 'in-progress', 'review', 'done'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status, ...(order !== undefined && { order }) },
      { new: true }
    );

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

/**
 * POST /tasks-api/tasks/:id/comments
 * Add a comment to a task
 */
router.post('/tasks/:id/comments', async (req, res) => {
  try {
    const { content, authorId, authorName, authorPicture } = req.body;

    if (!content || !authorId || !authorName) {
      return res.status(400).json({ success: false, message: 'content, authorId, and authorName are required' });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { content, authorId, authorName, authorPicture } } },
      { new: true }
    );

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
});

/**
 * DELETE /tasks-api/tasks/:id
 * Delete a task
 */
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete task' });
  }
});

module.exports = router;
