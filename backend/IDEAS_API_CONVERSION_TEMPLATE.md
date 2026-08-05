# ideas-api.js Conversion Template

## Quick Reference: Use This to Complete the Final File

This template provides the exact conversion patterns for all 19 endpoints in `ideas-api.js`.

---

## Setup Section (Top of File)

```javascript
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const prisma = require('../config/prisma');
const upload = require('../middlewares/upload');
const cloudinary = require('../config/cloudinary');

router.use(express.json());

// Helper function - KEEP EXACTLY AS IS
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

// Helper function for stage notifications
const createStageNotification = async (idea, previousStage, newStage) => {
  try {
    if (previousStage === newStage) return;
    
    const stageInfo = getStageInfo(newStage);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    // Delete recent duplicates
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
        userAvatar: null, // Will be enriched from User table
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
  }
};
```

---

## Endpoint 1: GET /ideas

```javascript
router.get('/ideas', async (req, res) => {
  try {
    const ideas = await prisma.idea.findMany({
      include: {
        teamMembers: true,
        collaborators: true,
        upvotedBy: true,
        comments: {
          include: {
            replies: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(ideas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching ideas", error: err.message });
  }
});
```

---

## Endpoint 2: GET /ideas/problem/:problemId

```javascript
router.get('/ideas/problem/:problemId', async (req, res) => {
  try {
    const ideas = await prisma.idea.findMany({
      where: { relatedProblemId: req.params.problemId },
      include: {
        teamMembers: true,
        collaborators: true,
        upvotedBy: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(ideas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching related ideas", error: err.message });
  }
});
```

---

## Endpoint 3: GET /ideas/:ideaId (with Access Control)

```javascript
router.get('/ideas/:ideaId', async (req, res) => {
  try {
    const userEmail = req.query.userEmail || req.headers['user-email'];
    
    const idea = await prisma.idea.findUnique({
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
              }
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
      // Filter private content
      idea.attachments = idea.attachments.filter(a => a.accessLevel === 'PUBLIC');
      idea.links = idea.links.filter(l => l.accessLevel === 'PUBLIC');
    }
    
    // Convert enums to lowercase
    idea.attachments = idea.attachments.map(a => ({
      ...a,
      accessLevel: a.accessLevel.toLowerCase()
    }));
    idea.links = idea.links.map(l => ({
      ...l,
      accessLevel: l.accessLevel.toLowerCase()
    }));
    
    res.json(idea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching idea", error: err.message });
  }
});
```

---

## Endpoint 4: POST /idea (Most Complex)

```javascript
router.post('/idea', upload.fields([
  { name: 'titleImage', maxCount: 1 },
  { name: 'teamImages', maxCount: 10 },
  { name: 'attachments', maxCount: 20 }
]), async (req, res) => {
  try {
    const {
      title, description, relatedProblemId, stage, mentor, contact,
      targetCustomers, addedByName, addedByEmail, team, links, attachmentMetadata
    } = req.body;
    
    // Parse team members
    let teamMembers = [];
    if (team) {
      teamMembers = typeof team === 'string' ? JSON.parse(team) : team;
    }
    
    // Upload title image
    let titleImageUrl = '';
    if (req.files?.titleImage?.[0]) {
      const file = req.files.titleImage[0];
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'idea_images',
        resource_type: 'auto'
      });
      titleImageUrl = result.secure_url;
    }
    
    // Parse links
    let linksData = [];
    if (links) {
      const parsedLinks = typeof links === 'string' ? JSON.parse(links) : links;
      linksData = parsedLinks;
    }
    
    // Process attachments
    let attachmentsData = [];
    if (req.files?.attachments) {
      const attachmentMeta = attachmentMetadata ? 
        (typeof attachmentMetadata === 'string' ? JSON.parse(attachmentMetadata) : attachmentMetadata) : [];
      
      for (let i = 0; i < req.files.attachments.length; i++) {
        const file = req.files.attachments[i];
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'idea_attachments',
          resource_type: 'auto'
        });
        
        const meta = attachmentMeta[i] || {};
        attachmentsData.push({
          name: meta.name || file.originalname,
          url: result.secure_url,
          type: file.mimetype,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          accessLevel: meta.accessLevel || 'public',
          uploadedBy: addedByEmail
        });
      }
    }
    
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
    
    // Create stage notification
    await createStageNotification(newIdea, 0, newIdea.stage);
    
    // Fetch with relations
    const ideaWithRelations = await prisma.idea.findUnique({
      where: { id: newIdea.id },
      include: {
        teamMembers: true,
        links: true,
        attachments: true
      }
    });
    
    res.status(201).json(ideaWithRelations);
  } catch (err) {
    console.error('Error creating idea:', err);
    res.status(500).json({ message: "Error creating idea", error: err.message });
  }
});
```

---

## Endpoint 5: PUT /idea/:ideaId

```javascript
router.put('/idea/:ideaId', upload.array('teamImages'), async (req, res) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { ideaId: req.params.ideaId }
    });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    if (idea.addedByEmail !== req.body.email) {
      return res.status(403).json({ message: "Unauthorized to update this idea" });
    }
    
    const previousStage = idea.stage;
    
    // Parse team if provided
    let teamMembers = null;
    if (req.body.team) {
      teamMembers = typeof req.body.team === 'string' ? JSON.parse(req.body.team) : req.body.team;
    }
    
    // Update in transaction
    await prisma.$transaction(async (tx) => {
      // Update idea
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
      if (teamMembers) {
        await tx.ideaTeamMember.deleteMany({ where: { ideaId: idea.id } });
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
    
    // Create notification if stage changed
    const newStage = req.body.stage ? parseInt(req.body.stage) : idea.stage;
    if (previousStage !== newStage) {
      await createStageNotification(idea, previousStage, newStage);
    }
    
    // Fetch updated idea
    const updatedIdea = await prisma.idea.findUnique({
      where: { id: idea.id },
      include: {
        teamMembers: true,
        collaborators: true
      }
    });
    
    res.json(updatedIdea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating idea", error: err.message });
  }
});
```

---

## Endpoint 6-19: Use Similar Patterns

For the remaining 13 endpoints, follow these patterns:

### DELETE /idea/:ideaId
- Use `prisma.idea.delete()` with authorization check
- Cascade deletes handle related records

### POST /idea/:ideaId/upvote (Toggle)
- Use the EXACT pattern from problems-api.js
- Check `findUnique` → delete or create → increment/decrement counter

### Comment Endpoints
- Use the EXACT pattern from problems-api.js
- `POST /idea/:ideaId/comment` → `prisma.ideaComment.create()`
- `GET /ideas/:ideaId/comments` → `prisma.ideaComment.findMany()`
- `POST /ideas/:ideaId/comments/:commentId/like` → Toggle pattern
- `POST /ideas/:ideaId/comments/:commentId/replies` → `prisma.ideaCommentReply.create()`

### Attachment Endpoints
- `POST /ideas/:ideaId/attachments` → Upload to Cloudinary → `prisma.ideaAttachment.create()`
- `DELETE /ideas/:ideaId/attachments/:index` → Fetch all, delete by index

### Link Endpoints  
- `POST /ideas/:ideaId/links` → `prisma.ideaLink.create()`
- `PUT /ideas/:ideaId/links/:index` → Fetch all, update by index
- `DELETE /ideas/:ideaId/links/:index` → Fetch all, delete by index

### Startup Status Endpoints
- `PUT /idea/:id/startup-status` → `prisma.idea.update()` for worthiness fields
- `GET /idea/:id/startup-status` → `prisma.idea.findUnique()` select status fields

---

## Testing Checklist

After conversion, test each endpoint:

```bash
# 1. Create idea
POST /idea with multipart form data

# 2. List ideas
GET /ideas

# 3. Get single idea (public user)
GET /ideas/:ideaId

# 4. Get single idea (owner)
GET /ideas/:ideaId?userEmail=owner@email.com

# 5. Update idea
PUT /idea/:ideaId

# 6. Upvote
POST /idea/:ideaId/upvote

# 7. Add comment
POST /idea/:ideaId/comment

# 8. Like comment
POST /ideas/:ideaId/comments/:commentId/like

# 9. Add reply
POST /ideas/:ideaId/comments/:commentId/replies

# 10. Upload attachment
POST /ideas/:ideaId/attachments

# 11. Add link
POST /ideas/:ideaId/links

# 12. Update startup status
PUT /idea/:id/startup-status

# 13. Delete idea
DELETE /idea/:ideaId
```

---

## Common Issues & Solutions

### Issue 1: Enum Case Mismatch
**Error**: Invalid enum value  
**Solution**: Convert to UPPERCASE before saving to DB
```javascript
accessLevel: accessLevel.toUpperCase() // 'public' → 'PUBLIC'
```

### Issue 2: Array Index Access
**Error**: Cannot access by index  
**Solution**: Fetch all, then use array index
```javascript
const attachments = await prisma.ideaAttachment.findMany({
  where: { ideaId: idea.id },
  orderBy: { uploadedAt: 'asc' }
});
const attachment = attachments[index];
```

### Issue 3: Access Control Not Working
**Error**: Private content visible to all  
**Solution**: Filter AFTER fetching, not in query
```javascript
// Fetch all
const idea = await prisma.idea.findUnique({ include: { attachments: true } });

// Then filter
if (!hasAccess) {
  idea.attachments = idea.attachments.filter(a => a.accessLevel === 'PUBLIC');
}
```

---

## Final Steps

1. Convert all 19 endpoints using patterns above
2. Test each endpoint individually
3. Rename `ideas-api.js` to `ideas-api-ORIGINAL.js`
4. Rename `ideas-api-CONVERTED.js` to `ideas-api.js`
5. Update progress tracker to 100%
6. Celebrate! 🎉

---

**Estimated Time**: 10-12 hours  
**Complexity**: ⭐⭐⭐⭐⭐ Very Complex  
**Reward**: 100% Migration Complete!
