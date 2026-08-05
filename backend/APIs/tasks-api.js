const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// ─── PROJECTS ────────────────────────────────────────────────────────────────

/**
 * GET /tasks-api/projects
 * Public: All active projects
 */
router.get('/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: { not: 'ARCHIVED' }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Attach task counts per project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const [total, done] = await Promise.all([
          prisma.task.count({ where: { projectId: project.id } }),
          prisma.task.count({ where: { projectId: project.id, status: 'DONE' } })
        ]);
        return { 
          ...project, 
          status: project.status.toLowerCase(), // Convert enum to lowercase for frontend
          taskCount: total, 
          completedCount: done 
        };
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

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { email: createdBy }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Create project with member in transaction
    const project = await prisma.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          name,
          description,
          color: color || '#7c3aed',
          emoji: emoji || '📋',
          createdBy
        }
      });

      // Add creator as lead member
      await tx.projectMember.create({
        data: {
          projectId: newProject.id,
          userId: user.id,
          name: creatorName || user.name || 'Unknown',
          email: createdBy,
          picture: user.picture,
          role: 'LEAD'
        }
      });

      return newProject;
    });

    // Convert enum to lowercase for frontend
    const projectResponse = {
      ...project,
      status: project.status.toLowerCase()
    };

    res.status(201).json({ success: true, project: projectResponse });
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
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        members: true
      }
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Convert enum to lowercase for frontend
    const projectResponse = {
      ...project,
      status: project.status.toLowerCase(),
      members: project.members.map(m => ({
        ...m,
        role: m.role.toLowerCase()
      }))
    };

    res.json({ success: true, project: projectResponse });
  } catch (err) {
    console.error('Get project error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
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

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (color !== undefined) updateData.color = color;
    if (emoji !== undefined) updateData.emoji = emoji;
    if (status !== undefined) updateData.status = status.toUpperCase(); // Convert to enum format

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: updateData
    });

    // Convert enum to lowercase for frontend
    const projectResponse = {
      ...project,
      status: project.status.toLowerCase()
    };

    res.json({ success: true, project: projectResponse });
  } catch (err) {
    console.error('Update project error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
});

/**
 * DELETE /tasks-api/projects/:id
 * Delete project and all its tasks (cascade delete handled by Prisma)
 */
router.delete('/projects/:id', async (req, res) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id }
    });
    // Tasks and ProjectMembers are cascade deleted automatically

    res.json({ success: true, message: 'Project and all tasks deleted' });
  } catch (err) {
    console.error('Delete project error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
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

    const where = { projectId };
    if (status) {
      where.status = status.toUpperCase().replace('-', '_'); // Convert 'in-progress' to 'IN_PROGRESS'
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        comments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // Convert enums to lowercase for frontend
    const tasksResponse = tasks.map(task => ({
      ...task,
      status: task.status.toLowerCase().replace('_', '-'), // 'IN_PROGRESS' → 'in-progress'
      priority: task.priority.toLowerCase()
    }));

    res.json({ success: true, tasks: tasksResponse });
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
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Verify creator exists
    const creator = await prisma.user.findUnique({
      where: { email: createdById }
    });

    if (!creator) {
      return res.status(404).json({ success: false, message: 'Creator user not found' });
    }

    // Get order (place at end of todo column)
    const lastTask = await prisma.task.findFirst({
      where: { projectId, status: 'TODO' },
      orderBy: { order: 'desc' }
    });
    const order = lastTask ? lastTask.order + 1 : 0;

    const taskData = {
      title,
      description,
      projectId,
      priority: (priority || 'none').toUpperCase(), // Convert to enum format
      dueDate: dueDate ? new Date(dueDate) : null,
      labels: labels || [],
      order,
      createdByUserId: creator.id,
      createdByName
    };

    // Add assignee if provided
    if (assignee && assignee.userId) {
      const assigneeUser = await prisma.user.findUnique({
        where: { email: assignee.userId }
      });
      if (assigneeUser) {
        taskData.assigneeUserId = assigneeUser.id;
        taskData.assigneeName = assignee.name || assigneeUser.name;
        taskData.assigneePicture = assignee.picture || assigneeUser.picture;
      }
    }

    const task = await prisma.task.create({
      data: taskData,
      include: {
        comments: true
      }
    });

    // Convert enums to lowercase for frontend
    const taskResponse = {
      ...task,
      status: task.status.toLowerCase().replace('_', '-'),
      priority: task.priority.toLowerCase()
    };

    res.status(201).json({ success: true, task: taskResponse });
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
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        project: {
          select: { name: true, color: true, emoji: true }
        },
        comments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Convert enums to lowercase for frontend
    const taskResponse = {
      ...task,
      status: task.status.toLowerCase().replace('_', '-'),
      priority: task.priority.toLowerCase(),
      projectId: task.project // Rename for frontend compatibility
    };

    res.json({ success: true, task: taskResponse });
  } catch (err) {
    console.error('Get task error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
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

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status.toUpperCase().replace('-', '_');
    if (priority !== undefined) updateData.priority = priority.toUpperCase();
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (labels !== undefined) updateData.labels = labels;
    if (order !== undefined) updateData.order = order;

    // Handle assignee update
    if (assignee !== undefined) {
      if (assignee && assignee.userId) {
        const assigneeUser = await prisma.user.findUnique({
          where: { email: assignee.userId }
        });
        if (assigneeUser) {
          updateData.assigneeUserId = assigneeUser.id;
          updateData.assigneeName = assignee.name || assigneeUser.name;
          updateData.assigneePicture = assignee.picture || assigneeUser.picture;
        }
      } else {
        // Clear assignee
        updateData.assigneeUserId = null;
        updateData.assigneeName = null;
        updateData.assigneePicture = null;
      }
    }

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        comments: true
      }
    });

    // Convert enums to lowercase for frontend
    const taskResponse = {
      ...task,
      status: task.status.toLowerCase().replace('_', '-'),
      priority: task.priority.toLowerCase()
    };

    res.json({ success: true, task: taskResponse });
  } catch (err) {
    console.error('Update task error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
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

    const updateData = {
      status: status.toUpperCase().replace('-', '_') // 'in-progress' → 'IN_PROGRESS'
    };
    if (order !== undefined) {
      updateData.order = order;
    }

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: updateData
    });

    // Convert enums to lowercase for frontend
    const taskResponse = {
      ...task,
      status: task.status.toLowerCase().replace('_', '-'),
      priority: task.priority.toLowerCase()
    };

    res.json({ success: true, task: taskResponse });
  } catch (err) {
    console.error('Update task status error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
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

    // Verify task exists
    const task = await prisma.task.findUnique({
      where: { id: req.params.id }
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Create comment
    await prisma.taskComment.create({
      data: {
        taskId: req.params.id,
        content,
        authorId,
        authorName,
        authorPicture
      }
    });

    // Fetch updated task with comments
    const updatedTask = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        comments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // Convert enums to lowercase for frontend
    const taskResponse = {
      ...updatedTask,
      status: updatedTask.status.toLowerCase().replace('_', '-'),
      priority: updatedTask.priority.toLowerCase()
    };

    res.json({ success: true, task: taskResponse });
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
});

/**
 * DELETE /tasks-api/tasks/:id
 * Delete a task
 */
router.delete('/tasks/:id', async (req, res) => {
  try {
    await prisma.task.delete({
      where: { id: req.params.id }
    });
    // Comments are cascade deleted automatically

    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    console.error('Delete task error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(500).json({ success: false, message: 'Failed to delete task' });
  }
});

module.exports = router;
