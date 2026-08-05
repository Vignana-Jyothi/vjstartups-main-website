const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const prisma = require('../config/prisma');
const upload = require('../middlewares/upload');
const cloudinary = require('../config/cloudinary');

router.use(express.json());

// Helper function to get stage name and type from stage number
const getStageInfo = (stageNumber) => {
  const stageMap = {
    1: { name: 'Ideation & Concept', type: 'idea' },
    2: { name: 'Research & Feasibility', type: 'idea' },
    3: { name: 'User Validation', type: 'idea' },
    4: { name: 'Prototype Development', type: 'idea' },
    5: { name: 'MVP Development', type: 'startup' },
    6: { name: 'Pilot/Beta Testing', type: 'startup' },
    7: { name: 'Launch & Go-to-Market', type: 'startup' },
    8: { name: 'Scaling & Growth', type: 'startup' }
  };
  return stageMap[stageNumber] || { name: `Stage ${stageNumber}`, type: 'idea' };
};

// Helper function to create stage notification
const createStageNotification = async (idea, previousStage, newStage) => {
  try {
    // Only create notification if stage actually changed
    if (previousStage === newStage) return;
    
    const stageInfo = getStageInfo(newStage);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Expire after 30 days
    
    // Delete any recent notifications for the same idea/user (last minute)
    await prisma.stageNotification.deleteMany({
      where: {
        ideaId: idea.ideaId,
        userEmail: idea.addedByEmail,
        createdAt: { gte: new Date(Date.now() - 60000) }
      }
    });
    
    await prisma.stageNotification.create({
      data: {
        ideaId: idea.ideaId,
        ideaTitle: idea.title,
        userEmail: idea.addedByEmail,
        userName: idea.addedByName,
        userAvatar: null, // Will be enriched from team if needed
        previousStage,
        newStage,
        stageName: stageInfo.name,
        stageType: stageInfo.type.toUpperCase(),
        expiresAt
      }
    });
    
    console.log(`✅ Stage notification created: ${idea.title} moved to stage ${newStage}`);
  } catch (err) {
    console.error('Error creating stage notification:', err);
    // Don't fail the request if notification creation fails
  }
};

// Get all ideas (database only)
router.get('/ideas', async (req, res) => {
  try {
    const ideas = await prisma.idea.findMany({
      include: {
        teamMembers: true,
        collaborators: true,
        upvotedBy: true,
        comments: {
          include: {
            replies: {
              include: {
                likes: true
              }
            },
            likes: true
          },
          orderBy: { createdAt: 'desc' }
        },
        attachments: true,
        links: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(ideas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching ideas", error: err.message });
  }
});

// Get ideas related to a specific problem (database only)
router.get('/ideas/problem/:problemId', async (req, res) => {
  try {
    const ideas = await prisma.idea.findMany({
      where: { relatedProblemId: req.params.problemId },
      include: {
        teamMembers: true,
        collaborators: true,
        upvotedBy: true,
        comments: {
          include: {
            replies: true,
            likes: true
          }
        },
        attachments: true,
        links: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(ideas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching related ideas", error: err.message });
  }
});

// Get a specific idea (database only with access control)
router.get('/ideas/:ideaId', async (req, res) => {
  try {
    const userEmail = req.query.userEmail || req.headers['user-email'];
    
    // Find in database only
    let idea = await prisma.idea.findUnique({
      where: { ideaId: req.params.ideaId },
      include: {
        teamMembers: true,
        collaborators: true,
        upvotedBy: true,
        comments: {
          include: {
            replies: {
              include: {
                likes: true
              },
              orderBy: { createdAt: 'asc' }
            },
            likes: true
          },
          orderBy: { createdAt: 'desc' }
        },
        attachments: {
          orderBy: { uploadedAt: 'desc' }
        },
        links: {
          orderBy: { addedAt: 'desc' }
        }
      }
    });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    // Apply access control filtering
    const isOwner = userEmail && idea.addedByEmail === userEmail;
    const isTeamMember = userEmail && idea.teamMembers.some(m => m.email === userEmail);
    const isCollaborator = userEmail && idea.collaborators.some(c => c.email === userEmail);
    const hasAccess = isOwner || isTeamMember || isCollaborator;
    
    if (!hasAccess) {
      // Filter private content for non-authorized users
      idea.attachments = idea.attachments.filter(a => a.accessLevel === 'PUBLIC');
      idea.links = idea.links.filter(l => l.accessLevel === 'PUBLIC');
    }
    
    // Convert enums to lowercase for frontend compatibility
    idea.attachments = idea.attachments.map(a => ({
      ...a,
      accessLevel: a.accessLevel.toLowerCase()
    }));
    idea.links = idea.links.map(l => ({
      ...l,
      accessLevel: l.accessLevel.toLowerCase()
    }));
    
    return res.json(idea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching idea", error: err.message });
  }
});

// Create new idea
router.post('/idea', upload.fields([
  { name: 'titleImage', maxCount: 1 },
  { name: 'teamImages', maxCount: 10 },
  { name: 'attachments', maxCount: 20 }
]), async (req, res) => {
  console.log('🚀 POST /idea route hit');
  console.log('📝 Request body:', req.body);
  console.log('📁 Request files:', req.files);
  console.log('🔍 Request headers:', req.headers);
  
  try {
    console.log('✅ Starting idea creation process...');
    console.log('🔍 Extracting data from request body...');
    const {
      title,
      description,
      relatedProblemId,
      stage,
      mentor,
      contact,
      targetCustomers,
      addedByName,
      addedByEmail,
      team,
      links,
      attachmentMetadata
    } = req.body;
    
    console.log('📊 Extracted data:', {
      title,
      description,
      relatedProblemId,
      stage,
      mentor,
      contact,
      targetCustomers,
      addedByName,
      addedByEmail,
      teamType: typeof team,
      linksType: typeof links,
      attachmentMetadataType: typeof attachmentMetadata
    });

    console.log('📋 Parsing team members...');
    // Parse team members if sent as string
    let teamMembers = team;
    if (typeof team === 'string') {
      try {
        teamMembers = JSON.parse(team);
        console.log('✅ Team members parsed:', teamMembers);
      } catch (error) {
        console.log('⚠️ Error parsing team members:', error);
        teamMembers = [];
      }
    } else {
      console.log('📋 Team members already parsed:', teamMembers);
    }
    
    // Ensure teamMembers is an array
    if (!Array.isArray(teamMembers)) {
      teamMembers = teamMembers ? [teamMembers] : [];
    }

    // Upload title image if provided
    let titleImageUrl = '';
    console.log('📸 Debug - req.files:', req.files);
    console.log('📸 Debug - titleImage files:', req.files?.titleImage);
    
    if (req.files && req.files.titleImage && req.files.titleImage[0]) {
      const file = req.files.titleImage[0];
      console.log('📸 Debug - Processing title image:', file.originalname, file.mimetype);
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      
      try {
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'idea_images',
          resource_type: 'auto'
        });
        titleImageUrl = result.secure_url;
        console.log('📸 Debug - Cloudinary upload successful:', titleImageUrl);
      } catch (error) {
        console.error("📸 Debug - Cloudinary upload error:", error);
      }
    } else {
      console.log('📸 Debug - No title image found in request');
    }

    console.log('🔗 Processing links...');
    // Parse and process links
    let linksData = [];
    if (links) {
      try {
        const parsedLinks = typeof links === 'string' ? JSON.parse(links) : links;
        console.log('✅ Links parsed:', parsedLinks);
        linksData = Array.isArray(parsedLinks) ? parsedLinks : [parsedLinks];
        console.log('✅ Links data formatted:', linksData);
      } catch (error) {
        console.error('⚠️ Error parsing links:', error);
        linksData = [];
      }
    } else {
      console.log('📝 No links provided');
    }

    console.log('📎 Processing file attachments...');
    // Process file attachments
    let attachmentsData = [];
    if (req.files && req.files.attachments) {
      console.log('📎 Found attachments:', req.files.attachments.length);
      
      const attachmentMeta = attachmentMetadata ? 
        (typeof attachmentMetadata === 'string' ? JSON.parse(attachmentMetadata) : attachmentMetadata) : [];
      
      for (let i = 0; i < req.files.attachments.length; i++) {
        console.log(`📎 Processing attachment ${i + 1}/${req.files.attachments.length}`);
        const file = req.files.attachments[i];
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        
        try {
          console.log('☁️ Uploading attachment to Cloudinary...');
          const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'idea_attachments',
            resource_type: 'auto'
          });
          console.log('✅ Attachment uploaded successfully:', result.secure_url);
          
          const meta = attachmentMeta[i] || {};
          
          attachmentsData.push({
            name: meta.name || file.originalname,
            url: result.secure_url,
            type: file.mimetype,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            accessLevel: meta.accessLevel || 'public',
            uploadedBy: addedByEmail
          });
        } catch (error) {
          console.error("❌ Cloudinary upload error for attachment:", error);
        }
      }
    } else {
      console.log('📎 No attachments found');
    }
    
    console.log('💾 Creating idea in database with transaction...');
    // Create idea with all relations in transaction
    const newIdea = await prisma.$transaction(async (tx) => {
      const idea = await tx.idea.create({
        data: {
          ideaId: uuidv4(),
          title,
          description,
          titleImage: titleImageUrl,
          relatedProblemId,
          stage: parseInt(stage) || 1,
          mentor,
          contact,
          targetCustomers,
          upvotes: 0,
          addedByName,
          addedByEmail,
          tags: []
        }
      });
      
      // Create team members
      if (teamMembers.length > 0) {
        await tx.ideaTeamMember.createMany({
          data: teamMembers.map(m => ({
            ideaId: idea.id,
            name: m.name,
            email: m.email || null,
            role: m.role,
            image: m.image || null
          }))
        });
      }
      
      // Create links
      if (linksData.length > 0) {
        await tx.ideaLink.createMany({
          data: linksData.map(l => ({
            ideaId: idea.id,
            title: l.title,
            url: l.url,
            description: l.description || null,
            accessLevel: (l.accessLevel || 'public').toUpperCase(),
            addedBy: addedByEmail
          }))
        });
      }
      
      // Create attachments
      if (attachmentsData.length > 0) {
        await tx.ideaAttachment.createMany({
          data: attachmentsData.map(a => ({
            ideaId: idea.id,
            name: a.name,
            url: a.url,
            type: a.type,
            size: a.size,
            accessLevel: a.accessLevel.toUpperCase(),
            uploadedBy: a.uploadedBy
          }))
        });
      }
      
      return idea;
    });
    
    console.log('✅ Idea saved successfully:', newIdea.ideaId);
    
    // Create notification for new idea creation
    await createStageNotification(newIdea, 0, newIdea.stage);
    console.log('🔔 Notification created for new idea');
    
    // Fetch with relations for response
    const ideaWithRelations = await prisma.idea.findUnique({
      where: { id: newIdea.id },
      include: {
        teamMembers: true,
        links: true,
        attachments: true,
        collaborators: true
      }
    });
    
    res.status(201).json(ideaWithRelations);
  } catch (err) {
    console.error('❌ Error creating idea:', err);
    console.error('❌ Error stack:', err.stack);
    res.status(500).json({ message: "Error creating idea", error: err.message });
  }
});

// Update idea
router.put('/idea/:ideaId', upload.array('teamImages'), async (req, res) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { ideaId: req.params.ideaId }
    });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Check if the user is the creator of the idea
    if (idea.addedByEmail !== req.body.email) {
      return res.status(403).json({ message: "Unauthorized to update this idea" });
    }

    // Store previous stage for notification
    const previousStage = idea.stage;

    // Parse team if provided
    let teamMembers = null;
    if (req.body.team) {
      teamMembers = typeof req.body.team === 'string' ? JSON.parse(req.body.team) : req.body.team;
      if (!Array.isArray(teamMembers)) {
        teamMembers = [teamMembers];
      }
    }

    // Update in transaction
    await prisma.$transaction(async (tx) => {
      // Update idea fields
      await tx.idea.update({
        where: { id: idea.id },
        data: {
          title: req.body.title || idea.title,
          description: req.body.description || idea.description,
          relatedProblemId: req.body.relatedProblemId || idea.relatedProblemId,
          stage: req.body.stage ? parseInt(req.body.stage) : idea.stage,
          mentor: req.body.mentor || idea.mentor,
          contact: req.body.contact || idea.contact,
          targetCustomers: req.body.targetCustomers || idea.targetCustomers
        }
      });

      // Update team if provided
      if (teamMembers !== null) {
        // Delete existing team members
        await tx.ideaTeamMember.deleteMany({
          where: { ideaId: idea.id }
        });
        
        // Create new team members
        if (teamMembers.length > 0) {
          await tx.ideaTeamMember.createMany({
            data: teamMembers.map(m => ({
              ideaId: idea.id,
              name: m.name,
              email: m.email || null,
              role: m.role,
              image: m.image || null
            }))
          });
        }
      }
    });
    
    // Create stage notification if stage changed
    const newStage = req.body.stage ? parseInt(req.body.stage) : idea.stage;
    if (previousStage !== newStage) {
      await createStageNotification(idea, previousStage, newStage);
    }
    
    // Fetch updated idea with relations
    const updatedIdea = await prisma.idea.findUnique({
      where: { id: idea.id },
      include: {
        teamMembers: true,
        collaborators: true,
        upvotedBy: true,
        comments: {
          include: {
            replies: true,
            likes: true
          }
        },
        attachments: true,
        links: true
      }
    });
    
    res.json(updatedIdea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating idea", error: err.message });
  }
});

// Delete idea
router.delete('/idea/:ideaId', async (req, res) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { ideaId: req.params.ideaId }
    });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Check if the user is the creator of the idea
    if (idea.addedByEmail !== req.body.email) {
      return res.status(403).json({ message: "Unauthorized to delete this idea" });
    }

    await prisma.idea.delete({
      where: { id: idea.id }
    });
    
    res.json({ message: "Idea deleted successfully" });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      return res.status(404).json({ message: "Idea not found" });
    }
    res.status(500).json({ message: "Error deleting idea", error: err.message });
  }
});

// Upvote an idea (toggle)
router.post('/idea/:ideaId/upvote', async (req, res) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { ideaId: req.params.ideaId }
    });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    const userEmail = req.body.email;
    if (!userEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user already upvoted
    const existingUpvote = await prisma.ideaUpvote.findUnique({
      where: {
        ideaId_userEmail: {
          ideaId: idea.id,
          userEmail: userEmail
        }
      }
    });

    if (existingUpvote) {
      // Remove upvote
      await prisma.$transaction([
        prisma.ideaUpvote.delete({
          where: { id: existingUpvote.id }
        }),
        prisma.idea.update({
          where: { id: idea.id },
          data: { upvotes: { decrement: 1 } }
        })
      ]);
    } else {
      // Add upvote
      await prisma.$transaction([
        prisma.ideaUpvote.create({
          data: {
            ideaId: idea.id,
            userEmail: userEmail
          }
        }),
        prisma.idea.update({
          where: { id: idea.id },
          data: { upvotes: { increment: 1 } }
        })
      ]);
    }

    // Fetch updated idea
    const updatedIdea = await prisma.idea.findUnique({
      where: { id: idea.id },
      include: {
        upvotedBy: true,
        teamMembers: true,
        collaborators: true
      }
    });

    res.json(updatedIdea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error upvoting idea", error: err.message });
  }
});

// Add comment to an idea (v1)
router.post('/idea/:ideaId/comment', async (req, res) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { ideaId: req.params.ideaId }
    });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    const { comment, name, email } = req.body;
    
    if (!comment || !name || !email) {
      return res.status(400).json({ message: "Comment, name, and email are required" });
    }

    const newComment = await prisma.ideaComment.create({
      data: {
        commentId: uuidv4(),
        ideaId: idea.id,
        author: name,
        content: comment,
        email: email
      }
    });

    res.json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
});

// Get all comments for an idea
router.get('/ideas/:ideaId/comments', async (req, res) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { ideaId: req.params.ideaId },
      include: {
        comments: {
          include: {
            replies: {
              include: {
                likes: true
              },
              orderBy: { createdAt: 'asc' }
            },
            likes: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    res.json(idea.comments || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
});

// Add a comment to an idea (v2)
router.post('/ideas/:ideaId/comments', async (req, res) => {
  try {
    const { author, content, email } = req.body;
    
    const idea = await prisma.idea.findUnique({
      where: { ideaId: req.params.ideaId }
    });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    const newComment = await prisma.ideaComment.create({
      data: {
        commentId: uuidv4(),
        ideaId: idea.id,
        author,
        content,
        email
      }
    });
    
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
});

// Like a comment (toggle)
router.post('/ideas/:ideaId/comments/:commentId/like', async (req, res) => {
  try {
    const { email } = req.body;
    
    const idea = await prisma.idea.findUnique({
      where: { ideaId: req.params.ideaId }
    });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    const comment = await prisma.ideaComment.findUnique({
      where: { commentId: req.params.commentId },
      include: { likes: true }
    });
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Check if user already liked
    const existingLike = await prisma.ideaCommentLike.findUnique({
      where: {
        commentId_userEmail: {
          commentId: comment.id,
          userEmail: email
        }
      }
    });
    
    if (existingLike) {
      // Remove like
      await prisma.ideaCommentLike.delete({
        where: { id: existingLike.id }
      });
    } else {
      // Add like
      await prisma.ideaCommentLike.create({
        data: {
          commentId: comment.id,
          userEmail: email
        }
      });
    }
    
    // Fetch updated comment
    const updatedComment = await prisma.ideaComment.findUnique({
      where: { id: comment.id },
      include: {
        likes: true,
        replies: {
          include: {
            likes: true
          }
        }
      }
    });
    
    res.json(updatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error liking comment", error: err.message });
  }
});

// Add a reply to a comment
router.post('/ideas/:ideaId/comments/:commentId/replies', async (req, res) => {
  try {
    const { author, content, email } = req.body;
    
    const idea = await prisma.idea.findUnique({
      where: { ideaId: req.params.ideaId }
    });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    const comment = await prisma.ideaComment.findUnique({
      where: { commentId: req.params.commentId }
    });
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    const newReply = await prisma.ideaCommentReply.create({
      data: {
        replyId: uuidv4(),
        commentId: comment.id,
        author,
        content,
        email
      }
    });
    
    // Fetch updated comment with replies
    const updatedComment = await prisma.ideaComment.findUnique({
      where: { id: comment.id },
      include: {
        replies: {
          include: {
            likes: true
          },
          orderBy: { createdAt: 'asc' }
        },
        likes: true
      }
    });
    
    res.status(201).json(updatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding reply", error: err.message });
  }
});

// Add attachment to an idea
router.post('/ideas/:ideaId/attachments', upload.single('file'), async (req, res) => {
  try {
    const { name, type } = req.body;
    const userEmail = req.body.email;
    
    const idea = await prisma.idea.findUnique({
      where: { ideaId: req.params.ideaId },
      include: {
        teamMembers: true,
        collaborators: true
      }
    });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    // Check if user has permission to add attachments
    const canEdit = userEmail === idea.addedByEmail || 
                   (idea.teamMembers && idea.teamMembers.some(member => member.email === userEmail)) ||
                   (idea.collaborators && idea.collaborators.some(c => c.email === userEmail));
    
    if (!canEdit) {
      return res.status(403).json({ message: "Unauthorized to add attachments" });
    }
    
    let fileUrl = '';
    let fileSize = '';
    
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      try {
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'idea_attachments',
          resource_type: 'auto'
        });
        fileUrl = result.secure_url;
        fileSize = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ message: "File upload failed" });
      }
    }
    
    const newAttachment = await prisma.ideaAttachment.create({
      data: {
        ideaId: idea.id,
        name: name || req.file.originalname,
        url: fileUrl,
        type: type || req.file.mimetype,
        size: fileSize,
        accessLevel: req.body.accessLevel ? req.body.accessLevel.toUpperCase() : 'PUBLIC',
        uploadedBy: userEmail
      }
    });
    
    // Convert enum to lowercase for response
    const responseAttachment = {
      ...newAttachment,
      accessLevel: newAttachment.accessLevel.toLowerCase()
    };
    
    res.status(201).json(responseAttachment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding attachment", error: err.message });
  }
});

// Delete attachment from an idea
router.delete('/ideas/:ideaId/attachments/:attachmentIndex', async (req, res) => {
  try {
    const userEmail = req.body.email;
    const attachmentIndex = parseInt(req.params.attachmentIndex);
    
    const idea = await prisma.idea.findUnique({
      where: { ideaId: req.params.ideaId },
      include: {
        teamMembers: true,
        attachments: {
          orderBy: { uploadedAt: 'asc' }
        }
      }
    });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    if (!idea.attachments || attachmentIndex >= idea.attachments.length) {
      return res.status(404).json({ message: "Attachment not found" });
    }
    
    const attachment = idea.attachments[attachmentIndex];
    
    // Check if user has permission to delete attachment
    const canDelete = userEmail === idea.addedByEmail || 
                     userEmail === attachment.uploadedBy ||
                     (idea.teamMembers && idea.teamMembers.some(member => member.email === userEmail));
    
    if (!canDelete) {
      return res.status(403).json({ message: "Unauthorized to delete attachment" });
    }
    
    await prisma.ideaAttachment.delete({
      where: { id: attachment.id }
    });
    
    res.json({ message: "Attachment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting attachment", error: err.message });
  }
});

// Add link to an idea
router.post('/ideas/:ideaId/links', async (req, res) => {
  try {
    const { title, description, url, accessLevel } = req.body;
    const userEmail = req.body.email;
    
    const idea = await prisma.idea.findUnique({
      where: { ideaId: req.params.ideaId },
      include: {
        teamMembers: true,
        collaborators: true
      }
    });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    // Check if user has permission to add links
    const canEdit = userEmail === idea.addedByEmail || 
                   (idea.teamMembers && idea.teamMembers.some(member => member.email === userEmail)) ||
                   (idea.collaborators && idea.collaborators.some(c => c.email === userEmail));
    
    if (!canEdit) {
      return res.status(403).json({ message: "Unauthorized to add links" });
    }
    
    const newLink = await prisma.ideaLink.create({
      data: {
        ideaId: idea.id,
        title,
        description,
        url,
        accessLevel: (accessLevel || 'public').toUpperCase(),
        addedBy: userEmail
      }
    });
    
    // Convert enum to lowercase for response
    const responseLink = {
      ...newLink,
      accessLevel: newLink.accessLevel.toLowerCase()
    };
    
    res.status(201).json(responseLink);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding link", error: err.message });
  }
});

// Update link in an idea
router.put('/ideas/:ideaId/links/:linkIndex', async (req, res) => {
  try {
    const { title, description, url, accessLevel } = req.body;
    const userEmail = req.body.email;
    const linkIndex = parseInt(req.params.linkIndex);
    
    const idea = await prisma.idea.findUnique({
      where: { ideaId: req.params.ideaId },
      include: {
        teamMembers: true,
        links: {
          orderBy: { addedAt: 'asc' }
        }
      }
    });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    if (!idea.links || linkIndex >= idea.links.length) {
      return res.status(404).json({ message: "Link not found" });
    }
    
    const link = idea.links[linkIndex];
    
    // Check if user has permission to edit link
    const canEdit = userEmail === idea.addedByEmail || 
                   userEmail === link.addedBy ||
                   (idea.teamMembers && idea.teamMembers.some(member => member.email === userEmail));
    
    if (!canEdit) {
      return res.status(403).json({ message: "Unauthorized to edit link" });
    }
    
    // Update link
    const updatedLink = await prisma.ideaLink.update({
      where: { id: link.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(url && { url }),
        ...(accessLevel && { accessLevel: accessLevel.toUpperCase() })
      }
    });
    
    // Convert enum to lowercase for response
    const responseLink = {
      ...updatedLink,
      accessLevel: updatedLink.accessLevel.toLowerCase()
    };
    
    res.json(responseLink);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating link", error: err.message });
  }
});

// Delete link from an idea
router.delete('/ideas/:ideaId/links/:linkIndex', async (req, res) => {
  try {
    const userEmail = req.body.email;
    const linkIndex = parseInt(req.params.linkIndex);
    
    const idea = await prisma.idea.findUnique({
      where: { ideaId: req.params.ideaId },
      include: {
        teamMembers: true,
        links: {
          orderBy: { addedAt: 'asc' }
        }
      }
    });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    if (!idea.links || linkIndex >= idea.links.length) {
      return res.status(404).json({ message: "Link not found" });
    }
    
    const link = idea.links[linkIndex];
    
    // Check if user has permission to delete link
    const canDelete = userEmail === idea.addedByEmail || 
                     userEmail === link.addedBy ||
                     (idea.teamMembers && idea.teamMembers.some(member => member.email === userEmail));
    
    if (!canDelete) {
      return res.status(403).json({ message: "Unauthorized to delete link" });
    }
    
    await prisma.ideaLink.delete({
      where: { id: link.id }
    });
    
    res.json({ message: "Link deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting link", error: err.message });
  }
});

// Update idea startup status
router.put('/idea/:id/startup-status', async (req, res) => {
  try {
    const { isStartupWorthy, worthinessLevel, evaluatedAt, userEmail, hasStartupCreated } = req.body;
    
    const idea = await prisma.idea.findUnique({
      where: { ideaId: req.params.id }
    });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    // Update startup status fields
    const updatedIdea = await prisma.idea.update({
      where: { id: idea.id },
      data: {
        isStartupWorthy: isStartupWorthy !== undefined ? isStartupWorthy : idea.isStartupWorthy,
        worthinessLevel: worthinessLevel ? worthinessLevel.toUpperCase() : idea.worthinessLevel,
        evaluatedAt: evaluatedAt ? new Date(evaluatedAt) : idea.evaluatedAt || new Date(),
        hasStartupCreated: hasStartupCreated !== undefined ? hasStartupCreated : idea.hasStartupCreated
      }
    });
    
    // Build response in old format
    const startupStatus = {
      isWorthy: updatedIdea.isStartupWorthy,
      level: updatedIdea.worthinessLevel ? updatedIdea.worthinessLevel.toLowerCase() : null,
      evaluatedAt: updatedIdea.evaluatedAt,
      hasStartupCreated: updatedIdea.hasStartupCreated
    };
    
    res.json({ message: "Startup status updated successfully", startupStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating startup status", error: err.message });
  }
});

// Test endpoint to check startup status of an idea
router.get('/idea/:id/startup-status', async (req, res) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { ideaId: req.params.id },
      select: {
        ideaId: true,
        title: true,
        stage: true,
        isStartupWorthy: true,
        worthinessLevel: true,
        evaluatedAt: true,
        hasStartupCreated: true
      }
    });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    // Build response in old format
    const startupStatus = {
      isWorthy: idea.isStartupWorthy,
      level: idea.worthinessLevel ? idea.worthinessLevel.toLowerCase() : null,
      evaluatedAt: idea.evaluatedAt,
      hasStartupCreated: idea.hasStartupCreated
    };
    
    res.json({ 
      ideaId: idea.ideaId,
      title: idea.title,
      startupStatus: startupStatus || null,
      stage: idea.stage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching startup status", error: err.message });
  }
});

module.exports = router;
