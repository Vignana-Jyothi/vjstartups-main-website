const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Idea = require('../models/Ideas');
const Problem = require('../models/Problems');
const StageNotification = require('../models/StageNotifications');
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
    
    // Delete any recent notifications for the same idea/user (last minute)
    await StageNotification.deleteMany({
      ideaId: idea.ideaId,
      userEmail: idea.addedByEmail,
      createdAt: { $gte: new Date(Date.now() - 60000) }
    });
    
    const notification = new StageNotification({
      ideaId: idea.ideaId,
      ideaTitle: idea.title,
      userEmail: idea.addedByEmail,
      userName: idea.addedByName,
      userAvatar: idea.team?.[0]?.image || null,
      previousStage,
      newStage,
      stageName: stageInfo.name,
      stageType: stageInfo.type
    });
    
    await notification.save();
    console.log(`✅ Stage notification created: ${idea.title} moved to stage ${newStage}`);
  } catch (err) {
    console.error('Error creating stage notification:', err);
    // Don't fail the request if notification creation fails
  }
};

// Get all ideas (database only)
router.get('/ideas', async (req, res) => {
  try {
    const ideas = await Idea.find();
    res.json(ideas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching ideas", error: err.message });
  }
});

// Get ideas related to a specific problem (database only)
router.get('/ideas/problem/:problemId', async (req, res) => {
  try {
    const ideas = await Idea.find({ relatedProblemId: req.params.problemId });
    res.json(ideas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching related ideas", error: err.message });
  }
});

// Helper function to filter links and attachments based on access control
const filterContentBasedOnAccess = (idea, userEmail) => {
  if (!idea.links && !idea.attachments) return idea;
  
  const filteredIdea = { ...idea };
  
  // Filter links
  if (idea.links) {
    filteredIdea.links = idea.links.filter(link => {
      // Public links are visible to everyone
      if (link.accessLevel === 'public') return true;
      
      // Private links are visible only to the creator and team members
      if (link.accessLevel === 'private') {
        if (userEmail === idea.addedByEmail) return true;
        if (idea.team && idea.team.some(member => member.email === userEmail)) return true;
        if (idea.collaborators && idea.collaborators.includes(userEmail)) return true;
        return false;
      }
      
      return false;
    });
  }
  
  // Filter attachments
  if (idea.attachments) {
    filteredIdea.attachments = idea.attachments.filter(attachment => {
      // Public attachments are visible to everyone
      if (attachment.accessLevel === 'public') return true;
      
      // Private attachments are visible only to the creator and team members
      if (attachment.accessLevel === 'private') {
        if (userEmail === idea.addedByEmail) return true;
        if (idea.team && idea.team.some(member => member.email === userEmail)) return true;
        if (idea.collaborators && idea.collaborators.includes(userEmail)) return true;
        return false;
      }
      
      return false;
    });
  }
  
  return filteredIdea;
};

// Get a specific idea (database only with access control)
router.get('/ideas/:ideaId', async (req, res) => {
  try {
    const userEmail = req.query.userEmail || req.headers['user-email'];
    
    // Find in database only
    let idea = await Idea.findOne({ ideaId: req.params.ideaId });
    if (idea) {
      idea = filterContentBasedOnAccess(idea.toObject(), userEmail);
      return res.json(idea);
    }
    
    return res.status(404).json({ message: "Idea not found" });
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
        linksData = parsedLinks.map(link => ({
          title: link.title,
          url: link.url,
          description: link.description || '',
          accessLevel: link.accessLevel || 'public',
          addedBy: addedByEmail,
          addedAt: new Date()
        }));
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
          
          // Parse attachment metadata from form data
          let attachmentMeta = {};
          if (attachmentMetadata) {
            try {
              const attachmentsArray = typeof attachmentMetadata === 'string' ? JSON.parse(attachmentMetadata) : attachmentMetadata;
              attachmentMeta = attachmentsArray[i] || {};
            } catch (error) {
              console.error('⚠️ Error parsing attachment metadata:', error);
            }
          }
          
          attachmentsData.push({
            name: attachmentMeta.name || file.originalname,
            url: result.secure_url,
            type: file.mimetype,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            accessLevel: attachmentMeta.accessLevel || 'public',
            uploadedBy: addedByEmail,
            uploadedAt: new Date()
          });
        } catch (error) {
          console.error("❌ Cloudinary upload error for attachment:", error);
        }
      }
    } else {
      console.log('📎 No attachments found');
    }
    
    // Create a new idea
    const newIdea = new Idea({
      ideaId: uuidv4(),
      title,
      description,
      titleImage: titleImageUrl,
      relatedProblemId,
      stage: parseInt(stage) || 1,
      mentor,
      contact,
      targetCustomers,
      team: teamMembers,
      links: linksData,
      attachments: attachmentsData,
      upvotes: 0,
      upvotedBy: [],
      comments: [],
      addedByName,
      addedByEmail,
      tags: [],
      createdAt: new Date()
    });

    console.log('💾 Saving idea to database...');
    await newIdea.save();
    console.log('✅ Idea saved successfully:', newIdea.ideaId);
    
    // Create notification for new idea creation
    await createStageNotification(newIdea, 0, newIdea.stage);
    console.log('🔔 Notification created for new idea');
    
    res.status(201).json(newIdea);
  } catch (err) {
    console.error('❌ Error creating idea:', err);
    console.error('❌ Error stack:', err.stack);
    res.status(500).json({ message: "Error creating idea", error: err.message });
  }
});

// Update idea
router.put('/idea/:ideaId', upload.array('teamImages'), async (req, res) => {
  try {
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Check if the user is the creator of the idea
    if (idea.addedByEmail !== req.body.email) {
      return res.status(403).json({ message: "Unauthorized to update this idea" });
    }

    // Store previous stage for notification
    const previousStage = idea.stage;

    // Update idea fields
    idea.title = req.body.title || idea.title;
    idea.description = req.body.description || idea.description;
    idea.relatedProblemId = req.body.relatedProblemId || idea.relatedProblemId;
    idea.stage = req.body.stage ? parseInt(req.body.stage) : idea.stage;
    idea.mentor = req.body.mentor || idea.mentor;
    idea.contact = req.body.contact || idea.contact;
    idea.targetCustomers = req.body.targetCustomers || idea.targetCustomers;

    // Update team if provided
    if (req.body.team) {
      let teamMembers = req.body.team;
      if (typeof req.body.team === 'string') {
        try {
          teamMembers = JSON.parse(req.body.team);
        } catch (error) {
          teamMembers = idea.team; // Keep existing team if parsing fails
        }
      }
      idea.team = teamMembers;
    }

    await idea.save();
    
    // Create stage notification if stage changed
    if (previousStage !== idea.stage) {
      await createStageNotification(idea, previousStage, idea.stage);
    }
    
    res.json(idea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating idea", error: err.message });
  }
});

// Delete idea
router.delete('/idea/:ideaId', async (req, res) => {
  try {
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Check if the user is the creator of the idea
    if (idea.addedByEmail !== req.body.email) {
      return res.status(403).json({ message: "Unauthorized to delete this idea" });
    }

    await Idea.deleteOne({ ideaId: req.params.ideaId });
    res.json({ message: "Idea deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting idea", error: err.message });
  }
});

// Upvote an idea
router.post('/idea/:ideaId/upvote', async (req, res) => {
  try {
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    const userEmail = req.body.email;
    if (!userEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Toggle upvote
    const hasUpvoted = idea.upvotedBy.includes(userEmail);
    
    if (hasUpvoted) {
      // Remove upvote
      idea.upvotedBy = idea.upvotedBy.filter(email => email !== userEmail);
      idea.upvotes = Math.max(0, idea.upvotes - 1);
    } else {
      // Add upvote
      idea.upvotedBy.push(userEmail);
      idea.upvotes += 1;
    }

    await idea.save();
    res.json(idea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error upvoting idea", error: err.message });
  }
});

// Add comment to an idea
router.post('/idea/:ideaId/comment', async (req, res) => {
  try {
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    const { comment, name, email } = req.body;
    
    if (!comment || !name || !email) {
      return res.status(400).json({ message: "Comment, name, and email are required" });
    }

    const newComment = {
      _id: uuidv4(),
      author: name,
      content: comment,
      email: email,
      createdAt: new Date(),
      likes: [],
      replies: []
    };

    idea.comments.push(newComment);
    await idea.save();

    res.json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
});

// Get all comments for an idea
router.get('/ideas/:ideaId/comments', async (req, res) => {
  try {
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    res.json(idea.comments || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
});

// Add a comment to an idea
router.post('/ideas/:ideaId/comments', async (req, res) => {
  try {
    const { author, content, email } = req.body;
    
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    const newComment = {
      _id: uuidv4(),
      author,
      content,
      email,
      createdAt: new Date(),
      likes: [],
      replies: []
    };
    
    idea.comments.push(newComment);
    await idea.save();
    
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
});

// Like a comment
router.post('/ideas/:ideaId/comments/:commentId/like', async (req, res) => {
  try {
    const { email } = req.body;
    
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    const comment = idea.comments.find(c => c._id === req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Toggle like
    if (!comment.likes) comment.likes = [];
    
    const likeIndex = comment.likes.indexOf(email);
    if (likeIndex > -1) {
      // Remove like
      comment.likes.splice(likeIndex, 1);
    } else {
      // Add like
      comment.likes.push(email);
    }
    
    await idea.save();
    
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error liking comment", error: err.message });
  }
});

// Add a reply to a comment
router.post('/ideas/:ideaId/comments/:commentId/replies', async (req, res) => {
  try {
    const { author, content, email } = req.body;
    
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    const comment = idea.comments.find(c => c._id === req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    const newReply = {
      _id: uuidv4(),
      author,
      content,
      email,
      createdAt: new Date(),
      likes: []
    };
    
    if (!comment.replies) comment.replies = [];
    comment.replies.push(newReply);
    
    await idea.save();
    
    res.status(201).json(comment);
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
    
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    // Check if user has permission to add attachments
    const canEdit = userEmail === idea.addedByEmail || 
                   (idea.team && idea.team.some(member => member.email === userEmail)) ||
                   (idea.collaborators && idea.collaborators.includes(userEmail));
    
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
    
    const newAttachment = {
      name: name || req.file.originalname,
      url: fileUrl,
      type: type || req.file.mimetype,
      size: fileSize,
      uploadedBy: userEmail,
      uploadedAt: new Date()
    };
    
    if (!idea.attachments) idea.attachments = [];
    idea.attachments.push(newAttachment);
    
    await idea.save();
    
    res.status(201).json(newAttachment);
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
    
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
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
                     (idea.team && idea.team.some(member => member.email === userEmail));
    
    if (!canDelete) {
      return res.status(403).json({ message: "Unauthorized to delete attachment" });
    }
    
    idea.attachments.splice(attachmentIndex, 1);
    await idea.save();
    
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
    
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    // Check if user has permission to add links
    const canEdit = userEmail === idea.addedByEmail || 
                   (idea.team && idea.team.some(member => member.email === userEmail)) ||
                   (idea.collaborators && idea.collaborators.includes(userEmail));
    
    if (!canEdit) {
      return res.status(403).json({ message: "Unauthorized to add links" });
    }
    
    const newLink = {
      title,
      description,
      url,
      accessLevel: accessLevel || 'public',
      addedBy: userEmail,
      addedAt: new Date()
    };
    
    if (!idea.links) idea.links = [];
    idea.links.push(newLink);
    
    await idea.save();
    
    res.status(201).json(newLink);
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
    
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
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
                   (idea.team && idea.team.some(member => member.email === userEmail));
    
    if (!canEdit) {
      return res.status(403).json({ message: "Unauthorized to edit link" });
    }
    
    // Update link properties
    if (title) link.title = title;
    if (description) link.description = description;
    if (url) link.url = url;
    if (accessLevel) link.accessLevel = accessLevel;
    link.updatedAt = new Date();
    
    await idea.save();
    
    res.json(link);
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
    
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
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
                     (idea.team && idea.team.some(member => member.email === userEmail));
    
    if (!canDelete) {
      return res.status(403).json({ message: "Unauthorized to delete link" });
    }
    
    idea.links.splice(linkIndex, 1);
    await idea.save();
    
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
    
    const idea = await Idea.findOne({ ideaId: req.params.id });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    // Update startup status
    idea.startupStatus = {
      isWorthy: isStartupWorthy !== undefined ? isStartupWorthy : idea.startupStatus?.isWorthy || false,
      level: worthinessLevel || idea.startupStatus?.level,
      evaluatedAt: evaluatedAt || idea.startupStatus?.evaluatedAt || new Date(),
      hasStartupCreated: hasStartupCreated !== undefined ? hasStartupCreated : idea.startupStatus?.hasStartupCreated || false
    };
    
    await idea.save();
    res.json({ message: "Startup status updated successfully", startupStatus: idea.startupStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating startup status", error: err.message });
  }
});

// Test endpoint to check startup status of an idea
router.get('/idea/:id/startup-status', async (req, res) => {
  try {
    const idea = await Idea.findOne({ ideaId: req.params.id });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    res.json({ 
      ideaId: idea.ideaId,
      title: idea.title,
      startupStatus: idea.startupStatus || null,
      stage: idea.stage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching startup status", error: err.message });
  }
});

module.exports = router;
