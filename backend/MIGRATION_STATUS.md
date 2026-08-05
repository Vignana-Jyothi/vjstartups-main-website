# MongoDB to PostgreSQL Migration Status

## ✅ COMPLETED WORK

### 1. Analysis Phase (COMPLETE)
- ✅ Full repository structure analyzed
- ✅ All 9 MongoDB collections identified
- ✅ All relationships mapped
- ✅ ID systems documented
- ✅ Authentication flow understood
- ✅ API endpoints cataloged

### 2. Database Schema (COMPLETE)
- ✅ Complete Prisma schema created (`prisma/schema.prisma`)
- ✅ All 33 tables defined with proper relationships
- ✅ 10 enums created for type safety
- ✅ Foreign keys and cascade deletes configured
- ✅ Indexes strategically placed
- ✅ Legacy ID fields preserved for compatibility

### 3. Documentation (COMPLETE)
- ✅ Comprehensive Migration Guide (`MIGRATION_GUIDE.md`)
- ✅ Deployment Guide (`DEPLOYMENT.md`)
- ✅ README with quick start (`README.md`)
- ✅ Seed script for demo data (`prisma/seed.js`)

### 4. Configuration (COMPLETE)
- ✅ Prisma client singleton (`config/prisma.js`)
- ✅ Updated package.json (removed Mongoose, added Prisma)
- ✅ Updated .env.example with PostgreSQL
- ✅ Updated server.js (PostgreSQL connection)
- ✅ Added npm scripts for Prisma operations

### 5. API Migration (PARTIAL - 1/9 COMPLETE)
- ✅ `auth-api.js` - Converted to Prisma
- ⏳ `problems-api.js` - **NEEDS CONVERSION**
- ⏳ `ideas-api.js` - **NEEDS CONVERSION**
- ⏳ `startups-api.js` - **NEEDS CONVERSION**
- ⏳ `questionnaire-api.js` - **NEEDS CONVERSION**
- ⏳ `tasks-api.js` - **NEEDS CONVERSION**
- ⏳ `admin-api.js` - **NEEDS CONVERSION**
- ⏳ `announcements-api.js` - **NEEDS CONVERSION**
- ⏳ `notifications-api.js` - **NEEDS CONVERSION**

---

## 🔄 REMAINING WORK

### Priority 1: Core API Conversions

Each API file needs the following Mongoose → Prisma conversions:

#### Query Pattern Conversions

| Mongoose Pattern | Prisma Equivalent |
|-----------------|-------------------|
| `Model.find()` | `prisma.model.findMany()` |
| `Model.findOne()` | `prisma.model.findUnique()` or `findFirst()` |
| `Model.findById()` | `prisma.model.findUnique({ where: { id } })` |
| `Model.create()` | `prisma.model.create({ data: {...} })` |
| `new Model().save()` | `prisma.model.create({ data: {...} })` |
| `Model.findByIdAndUpdate()` | `prisma.model.update()` |
| `Model.findOneAndUpdate()` | `prisma.model.update()` |
| `Model.findByIdAndDelete()` | `prisma.model.delete()` |
| `Model.deleteOne()` | `prisma.model.delete()` |
| `Model.countDocuments()` | `prisma.model.count()` |
| `.populate()` | `include: { relation: true }` |
| `.select()` | `select: { field: true }` |
| `.sort()` | `orderBy: { field: 'asc'/'desc' }` |
| `.skip()` / `.limit()` | `skip: n, take: n` |
| `$push`, `$pull` (arrays) | Create/delete related records |
| `.aggregate()` | `prisma.$queryRaw()` or groupBy |

---

## 📋 DETAILED CONVERSION CHECKLIST

### problems-api.js
- [ ] Convert Problem model queries to Prisma
- [ ] Handle upvotedBy array → ProblemUpvote table
- [ ] Handle collaborators array → ProblemCollaborator table
- [ ] Handle comments array → ProblemComment table
- [ ] Handle replies array → ProblemCommentReply table
- [ ] Handle likes arrays → ProblemCommentLike / ProblemReplyLike tables
- [ ] Convert aggregation queries (duplicate detection)
- [ ] Test file uploads (Cloudinary integration)

### ideas-api.js
- [ ] Convert Idea model queries to Prisma
- [ ] Handle upvotedBy → IdeaUpvote table
- [ ] Handle collaborators → IdeaCollaborator table
- [ ] Handle team → IdeaTeamMember table
- [ ] Handle comments → IdeaComment table
- [ ] Handle attachments → IdeaAttachment table
- [ ] Handle links → IdeaLink table
- [ ] Handle replies → IdeaCommentReply table
- [ ] Preserve access control logic (public/private content)
- [ ] Test stage notifications

### startups-api.js
- [ ] Convert Startup model queries to Prisma
- [ ] Handle team → StartupTeamMember table
- [ ] Handle milestones → StartupMilestone table
- [ ] Handle supportPrograms → StartupSupportProgram table
- [ ] Handle file uploads
- [ ] Test file path transformations
- [ ] Handle createdBy relationship

### questionnaire-api.js
- [ ] Convert QuestionnaireResponse queries to Prisma
- [ ] Handle score object → QuestionnaireScore table
- [ ] Handle recommendations array → QuestionnaireRecommendation table
- [ ] Handle startupWorthiness → QuestionnaireCriteria table
- [ ] Preserve scoring logic
- [ ] Test idea status updates

### tasks-api.js
- [ ] Convert Project queries to Prisma
- [ ] Convert Task queries to Prisma
- [ ] Handle members array → ProjectMember table
- [ ] Handle comments array → TaskComment table
- [ ] Test task ordering logic
- [ ] Test project-task cascade deletes

### admin-api.js
- [ ] Convert User admin queries to Prisma
- [ ] Convert Startup admin queries to Prisma
- [ ] Convert Idea admin queries to Prisma
- [ ] Convert Problem admin queries to Prisma
- [ ] Convert aggregation queries (stats, growth charts)
- [ ] Test role updates
- [ ] Test pagination

### announcements-api.js
- [ ] Convert Announcement queries to Prisma
- [ ] Test soft delete (isActive flag)
- [ ] Test creation with poster info

### notifications-api.js
- [ ] Convert StageNotification queries to Prisma
- [ ] Convert aggregation queries (stats, leaderboard)
- [ ] Handle fallback data enrichment
- [ ] Test User lookup for avatars
- [ ] Test notification deduplication
- [ ] Test cleanup endpoint

---

## 🛠️ CONVERSION METHODOLOGY

For each API file, follow this process:

### Step 1: Import Prisma
```javascript
// Remove
const Model = require('../models/ModelName');
const mongoose = require('mongoose');

// Add
const prisma = require('../config/prisma');
```

### Step 2: Convert Create Operations
```javascript
// Before
const record = new Model({ ...data });
await record.save();

// After
const record = await prisma.model.create({
  data: { ...data }
});
```

### Step 3: Convert Find Operations
```javascript
// Before
const records = await Model.find({ field: value })
  .populate('relation')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

// After
const records = await prisma.model.findMany({
  where: { field: value },
  include: { relation: true },
  orderBy: { createdAt: 'desc' },
  skip, 
  take: limit
});
```

### Step 4: Handle Arrays → Relations
```javascript
// Before (Array in document)
problem.upvotedBy.push(email);
await problem.save();

// After (Separate table)
await prisma.problemUpvote.create({
  data: {
    problemId: problem.id,
    userEmail: email
  }
});

// Or toggle with upsert/delete
const existing = await prisma.problemUpvote.findUnique({
  where: {
    problemId_userEmail: {
      problemId: problem.id,
      userEmail: email
    }
  }
});

if (existing) {
  await prisma.problemUpvote.delete({
    where: { id: existing.id }
  });
} else {
  await prisma.problemUpvote.create({
    data: { problemId: problem.id, userEmail: email }
  });
}
```

### Step 5: Handle Embedded Documents
```javascript
// Before (Embedded in array)
problem.comments.push({
  commentId: uuidv4(),
  text, name, email,
  createdAt: new Date()
});
await problem.save();

// After (Separate table)
await prisma.problemComment.create({
  data: {
    commentId: uuidv4(),
    problemId: problem.id,
    text, name, email
  }
});
```

### Step 6: Convert Aggregations
```javascript
// Before
const stats = await Model.aggregate([
  { $match: { field: value } },
  { $group: { _id: '$category', count: { $sum: 1 } } }
]);

// After (option 1: groupBy)
const stats = await prisma.model.groupBy({
  by: ['category'],
  where: { field: value },
  _count: true
});

// After (option 2: raw query)
const stats = await prisma.$queryRaw`
  SELECT category, COUNT(*) as count
  FROM model
  WHERE field = ${value}
  GROUP BY category
`;
```

---

## 🧪 TESTING STRATEGY

After each API conversion:

1. **Unit Test Queries**
   - Test create operations
   - Test read operations
   - Test update operations
   - Test delete operations

2. **Integration Test Endpoints**
   ```bash
   # Test with curl or Postman
   curl http://localhost:6220/api-endpoint
   ```

3. **Verify Data Integrity**
   ```bash
   # Use Prisma Studio
   npx prisma studio
   ```

4. **Check Relationships**
   - Verify foreign keys work
   - Verify cascade deletes work
   - Verify includes/joins work

5. **Performance Test**
   - Check query performance
   - Verify indexes are used
   - Test with realistic data volume

---

## 🚀 DEPLOYMENT CHECKLIST

Before production deployment:

- [ ] All API files converted
- [ ] All tests passing
- [ ] Database migrations tested
- [ ] Seed script tested
- [ ] Environment variables configured
- [ ] Backup strategy implemented
- [ ] Monitoring configured
- [ ] Performance tested
- [ ] Security audit complete
- [ ] Documentation updated

---

## 📊 DATABASE ER DIAGRAM (TEXT)

```
USER
├─┬─ problems (1:N) → PROBLEM
│ ├─ ideas (1:N) → IDEA
│ ├─ startups (1:N) → STARTUP
│ ├─ projects (1:N) → PROJECT
│ ├─ tasks_created (1:N) → TASK
│ ├─ tasks_assigned (1:N) → TASK
│ ├─ problem_upvotes (1:N) → PROBLEM_UPVOTE
│ ├─ idea_upvotes (1:N) → IDEA_UPVOTE
│ ├─ problem_comments (1:N) → PROBLEM_COMMENT
│ ├─ idea_comments (1:N) → IDEA_COMMENT
│ ├─ stage_notifications (1:N) → STAGE_NOTIFICATION
│ └─ project_memberships (1:N) → PROJECT_MEMBER

PROBLEM
├─┬─ creator (N:1) → USER
│ ├─ collaborators (1:N) → PROBLEM_COLLABORATOR
│ ├─ comments (1:N) → PROBLEM_COMMENT
│ │   ├─ likedBy (1:N) → PROBLEM_COMMENT_LIKE
│ │   └─ replies (1:N) → PROBLEM_COMMENT_REPLY
│ │       └─ likedBy (1:N) → PROBLEM_REPLY_LIKE
│ ├─ upvotedBy (1:N) → PROBLEM_UPVOTE
│ └─ ideas (1:N) → IDEA

IDEA
├─┬─ creator (N:1) → USER
│ ├─ problem (N:1) → PROBLEM
│ ├─ collaborators (1:N) → IDEA_COLLABORATOR
│ ├─ team_members (1:N) → IDEA_TEAM_MEMBER
│ ├─ comments (1:N) → IDEA_COMMENT
│ │   ├─ likes (1:N) → IDEA_COMMENT_LIKE
│ │   └─ replies (1:N) → IDEA_COMMENT_REPLY
│ │       └─ likes (1:N) → IDEA_REPLY_LIKE
│ ├─ upvotedBy (1:N) → IDEA_UPVOTE
│ ├─ attachments (1:N) → IDEA_ATTACHMENT
│ ├─ links (1:N) → IDEA_LINK
│ ├─ questionnaires (1:N) → QUESTIONNAIRE_RESPONSE
│ ├─ startup (1:1) → STARTUP
│ └─ stage_notifications (1:N) → STAGE_NOTIFICATION

STARTUP
├─┬─ creator (N:1) → USER
│ ├─ idea (1:1) → IDEA
│ ├─ team_members (1:N) → STARTUP_TEAM_MEMBER
│ ├─ milestones (1:N) → STARTUP_MILESTONE
│ └─ support_programs (1:N) → STARTUP_SUPPORT_PROGRAM

QUESTIONNAIRE_RESPONSE
├─┬─ idea (N:1) → IDEA
│ ├─ scores (1:1) → QUESTIONNAIRE_SCORE
│ ├─ recommendations (1:N) → QUESTIONNAIRE_RECOMMENDATION
│ └─ criteria (1:1) → QUESTIONNAIRE_CRITERIA

PROJECT
├─┬─ creator (N:1) → USER
│ ├─ members (1:N) → PROJECT_MEMBER
│ └─ tasks (1:N) → TASK

TASK
├─┬─ project (N:1) → PROJECT
│ ├─ creator (N:1) → USER
│ ├─ assignee (N:1) → USER
│ └─ comments (1:N) → TASK_COMMENT

ANNOUNCEMENT (standalone)
STAGE_NOTIFICATION
├─┬─ idea (N:1) → IDEA
│ └─ user (N:1) → USER
```

---

## 💡 TIPS FOR REMAINING WORK

### 1. Start with Simple APIs
- Begin with `announcements-api.js` (simplest)
- Then `notifications-api.js`
- Save complex ones (`problems-api.js`, `ideas-api.js`) for last

### 2. Test Incrementally
- Convert one function at a time
- Test before moving to next
- Use Prisma Studio to verify data

### 3. Use Transactions
For complex operations involving multiple tables:
```javascript
await prisma.$transaction(async (tx) => {
  const problem = await tx.problem.create({ data: {...} });
  await tx.problemCollaborator.createMany({ 
    data: collaborators.map(email => ({ problemId: problem.id, email }))
  });
});
```

### 4. Handle Legacy IDs
Always preserve legacy ID fields:
```javascript
// When creating
const problem = await prisma.problem.create({
  data: {
    problemId: nextId.toString(), // Legacy string ID
    // ... other fields
  }
});

// When finding
const problem = await prisma.problem.findUnique({
  where: { problemId: legacyId } // Not id!
});
```

### 5. Migration Script Template
For data migration from MongoDB to PostgreSQL, use:
```javascript
// scripts/migrate-data.js
const { MongoClient } = require('mongodb');
const { PrismaClient } = require('@prisma/client');

const mongo = new MongoClient(process.env.MONGO_URI);
const prisma = new PrismaClient();

async function migrate() {
  await mongo.connect();
  const db = mongo.db();
  
  // Migrate users first (no dependencies)
  const users = await db.collection('users').find().toArray();
  for (const user of users) {
    await prisma.user.create({
      data: {
        id: user._id.toString(),
        email: user.email,
        // ... map other fields
      }
    });
  }
  
  // Then migrate problems, ideas, etc.
  // ...
}

migrate().finally(() => {
  mongo.close();
  prisma.$disconnect();
});
```

---

## 📞 NEXT STEPS

1. **Run Initial Setup**
   ```bash
   cd backend
   npm install
   npx prisma generate
   createdb vjstartups
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```

2. **Start Converting APIs**
   - Pick one API file
   - Follow conversion methodology above
   - Test thoroughly
   - Move to next file

3. **Test Integration**
   - Start server: `npm run dev`
   - Test each endpoint
   - Verify data integrity

4. **Deploy**
   - Follow `DEPLOYMENT.md`
   - Set up production database
   - Run migrations
   - Deploy application

---

## ✅ SUCCESS CRITERIA

Migration is complete when:
- ✅ All 9 API files use Prisma (not Mongoose)
- ✅ No MongoDB packages remain in package.json
- ✅ All endpoints return correct responses
- ✅ Frontend works without any changes
- ✅ Authentication flow works
- ✅ File uploads work
- ✅ All relationships preserved
- ✅ Performance is acceptable
- ✅ Tests pass

---

**Current Progress: ~40% Complete**

The foundation is solid. Schema, documentation, and infrastructure are done. Main work remaining is converting the 8 API files to use Prisma instead of Mongoose.

---

*Last Updated: Current Session*
