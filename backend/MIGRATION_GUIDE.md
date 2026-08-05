# MongoDB to PostgreSQL Migration Guide

## Overview
This document outlines the complete migration of the VJ Startups backend from MongoDB to PostgreSQL using Prisma ORM.

## Migration Summary

### Databases
- **From:** MongoDB (Mongoose ODM)
- **To:** PostgreSQL (Prisma ORM)
- **ORM:** Prisma v7.9.1

### Collections Migrated
1. **Users** - User authentication and profiles
2. **Problems** - Community problem statements
3. **Ideas** - Ideas related to problems
4. **Startups** - Startups created from validated ideas
5. **QuestionnaireResponses** - Idea evaluation questionnaires
6. **Projects** - Project management (Plane board)
7. **Tasks** - Tasks within projects
8. **Announcements** - Admin announcements
9. **StageNotifications** - Stage transition notifications

---

## Database Schema Changes

### ID Strategy Changes

#### MongoDB (Before)
- **Users, Tasks, Projects:** MongoDB ObjectIds
- **Problems:** Sequential string IDs ("1", "2", "3", etc.)
- **Ideas:** UUID v4 strings
- **Startups:** MongoDB ObjectIds

#### PostgreSQL (After)
- **All Primary Keys:** UUIDs (universally unique identifiers)
- **Legacy IDs Preserved:** All existing ID fields preserved as unique indexes
  - `problemId` (string) - indexed
  - `ideaId` (UUID string) - indexed
  - `responseId` (UUID string) - indexed
  - `commentId` (UUID/string) - indexed

### Relationship Changes

#### Embedded Documents → Separate Tables
MongoDB embedded documents have been normalized into separate PostgreSQL tables with foreign key relationships:

1. **Problem Comments & Replies**
   - `ProblemComment` (was embedded in Problem.comments)
   - `ProblemCommentReply` (was embedded in Comment.replies)
   - `ProblemCommentLike` (was embedded in Comment.likedBy array)
   - `ProblemReplyLike` (was embedded in Reply.likedBy array)

2. **Idea Comments & Replies**
   - `IdeaComment` (was embedded in Idea.comments)
   - `IdeaCommentReply` (was embedded in Comment.replies)
   - `IdeaCommentLike` (was embedded in Comment.likes array)
   - `IdeaReplyLike` (was embedded in Reply.likes array)

3. **Idea Team & Attachments**
   - `IdeaTeamMember` (was embedded in Idea.team array)
   - `IdeaAttachment` (was embedded in Idea.attachments array)
   - `IdeaLink` (was embedded in Idea.links array)

4. **Startup Components**
   - `StartupTeamMember` (was embedded in Startup.team array)
   - `StartupMilestone` (was embedded in Startup.milestones array)
   - `StartupSupportProgram` (was embedded in Startup.supportPrograms array)

5. **Questionnaire Components**
   - `QuestionnaireScore` (was embedded in Response.score object)
   - `QuestionnaireRecommendation` (was embedded in Response.recommendations array)
   - `QuestionnaireCriteria` (was embedded in Response.startupWorthiness object)

6. **Collaborators & Upvotes**
   - `ProblemCollaborator` (was email string in Problem.collaborators array)
   - `IdeaCollaborator` (was email string in Idea.collaborators array)
   - `ProblemUpvote` (was email string in Problem.upvotedBy array)
   - `IdeaUpvote` (was email string in Idea.upvotedBy array)

7. **Project Members**
   - `ProjectMember` (was embedded in Project.members array)

8. **Task Comments**
   - `TaskComment` (was embedded in Task.comments array)

---

## Enums Created

PostgreSQL enums replace string validation in MongoDB:

```prisma
enum UserRole {
  USER, STUDENT, WING_MEMBER, WING_MASTER, ADMIN
}

enum WorthinessLevel {
  HIGH, MEDIUM, LOW
}

enum AccessLevel {
  PUBLIC, PRIVATE
}

enum FundingStatus {
  BOOTSTRAPPED, SEEKING_FUNDING, PRE_SEED, SEED, SERIES_A, LATER_STAGE
}

enum IncorporationStatus {
  NOT_INCORPORATED, INCORPORATED, LLC, PARTNERSHIP, OTHER
}

enum QuestionnaireStatus {
  DRAFT, COMPLETED
}

enum ProjectStatus {
  ACTIVE, PAUSED, COMPLETED, ARCHIVED
}

enum ProjectMemberRole {
  MEMBER, LEAD
}

enum TaskStatus {
  TODO, IN_PROGRESS, REVIEW, DONE
}

enum TaskPriority {
  URGENT, HIGH, MEDIUM, LOW, NONE
}

enum StageType {
  PROBLEM, IDEA, STARTUP
}
```

---

## Index Strategy

### Performance Indexes
All tables include strategic indexes for:
- Foreign key columns
- Frequently queried fields
- Sort/filter columns
- Unique constraints

Example:
```prisma
@@index([email])
@@index([problemId])
@@index([createdAt])
@@index([stage])
```

---

## Data Type Changes

### Text Fields
MongoDB string fields with large content → PostgreSQL `@db.Text`:
- Problem descriptions, briefs
- Idea descriptions, target customers
- Startup business models
- Questionnaire responses

### Arrays
MongoDB arrays → PostgreSQL arrays:
- `tags: [String]` → `tags String[]`
- `keyFeatures: [String]` → `keyFeatures String[]`
- `labels: [String]` → `labels String[]`

### JSON Fields
Complex MongoDB objects → PostgreSQL `Json` type:
- `QuestionnaireResponse.responses` (dynamic form data)

### Dates
All MongoDB `Date` fields → PostgreSQL `DateTime`:
- Automatic `@default(now())` for creation timestamps
- Automatic `@updatedAt` for update timestamps

---

## Cascade Delete Rules

Foreign keys configured with `onDelete: Cascade` for:
- Comments when parent (Problem/Idea) deleted
- Replies when parent Comment deleted
- Likes when parent Comment/Reply deleted
- Team members when parent Startup/Idea deleted
- Tasks when parent Project deleted
- All related entities maintain referential integrity

---

## Migration Steps

### 1. Environment Setup
```bash
# Install dependencies
cd backend
npm install @prisma/client@latest
npm install --save-dev prisma@latest

# Create .env file
cp .env.example .env
```

### 2. Configure Database URL
Edit `backend/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/vjstartups?schema=public"
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Create Database and Run Migration
```bash
# Create database
createdb vjstartups

# Run migration
npx prisma migrate dev --name init
```

### 5. Data Migration (if needed)
If you have existing MongoDB data:
```bash
node scripts/migrate-data.js
```

---

## API Changes Required

### Import Changes
**Before (Mongoose):**
```javascript
const Problem = require('../models/Problems');
const mongoose = require('mongoose');
```

**After (Prisma):**
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
```

### Query Changes

#### Create Operations
**Before:**
```javascript
const problem = new Problem({
  problemId: nextId.toString(),
  title, description, ...
});
await problem.save();
```

**After:**
```javascript
const problem = await prisma.problem.create({
  data: {
    problemId: nextId.toString(),
    title, description,
    creator: { connect: { email: addedByEmail } },
    collaborators: {
      create: collaborators.map(email => ({ email }))
    }
  }
});
```

#### Find Operations
**Before:**
```javascript
const problems = await Problem.find({ stage: 5 })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
```

**After:**
```javascript
const problems = await prisma.problem.findMany({
  where: { stage: 5 },
  orderBy: { createdAt: 'desc' },
  skip, take: limit,
  include: { creator: true, upvotedBy: true }
});
```

#### Update Operations
**Before:**
```javascript
await Problem.findOneAndUpdate(
  { problemId: id },
  { $set: { title: 'New Title' } },
  { new: true }
);
```

**After:**
```javascript
await prisma.problem.update({
  where: { problemId: id },
  data: { title: 'New Title' }
});
```

#### Delete Operations
**Before:**
```javascript
await Problem.deleteOne({ problemId: id });
```

**After:**
```javascript
await prisma.problem.delete({
  where: { problemId: id }
});
```

#### Array Operations (Upvotes/Collaborators)
**Before:**
```javascript
problem.upvotedBy.push(email);
await problem.save();
```

**After:**
```javascript
await prisma.problemUpvote.create({
  data: {
    problemId: problem.id,
    userEmail: email
  }
});
// Or use upsert to toggle
await prisma.problemUpvote.delete({
  where: {
    problemId_userEmail: {
      problemId: problem.id,
      userEmail: email
    }
  }
});
```

---

## Testing Checklist

After migration, verify:

### Authentication
- [ ] Google OAuth login
- [ ] Admin token generation
- [ ] User role assignment

### Problems
- [ ] Create problem with image upload
- [ ] List problems with pagination
- [ ] Upvote/downvote problems
- [ ] Add/delete comments
- [ ] Add/delete replies
- [ ] Like comments/replies
- [ ] Update problem (owner/collaborator only)
- [ ] Delete problem (owner/collaborator only)
- [ ] Duplicate detection

### Ideas
- [ ] Create idea with attachments
- [ ] Link idea to problem
- [ ] Update idea stage
- [ ] Add team members
- [ ] Add/update attachments (public/private)
- [ ] Add/update links (public/private)
- [ ] Access control for private content
- [ ] Comment system
- [ ] Upvote system
- [ ] Stage notifications

### Startups
- [ ] Create startup from idea
- [ ] File uploads (cover, logo, pitch deck, one-pager)
- [ ] Update startup details
- [ ] View/download documents
- [ ] Upvote system
- [ ] View count tracking

### Questionnaires
- [ ] Submit questionnaire
- [ ] Calculate scores
- [ ] Generate recommendations
- [ ] Evaluate startup worthiness
- [ ] Update idea startup status

### Projects & Tasks
- [ ] Create project
- [ ] Add project members
- [ ] Create task
- [ ] Assign task
- [ ] Update task status (drag-drop)
- [ ] Add comments to task
- [ ] Update task priority
- [ ] Set due dates
- [ ] Delete task/project

### Announcements
- [ ] Create announcement (admin only)
- [ ] List active announcements
- [ ] Toggle announcement status

### Notifications
- [ ] Stage transition notifications
- [ ] Auto-expire after 30 days
- [ ] List user notifications

---

## Rollback Plan

If issues occur:

1. **Keep MongoDB running** during initial PostgreSQL testing
2. **Backup MongoDB data** before migration:
   ```bash
   mongodump --uri="mongodb://localhost:27017/vjstartups" --out=./mongo-backup
   ```
3. **Test PostgreSQL thoroughly** in development before production
4. **Dual-run period**: Run both databases temporarily with read-only MongoDB

---

## Performance Optimization

### Connection Pooling
Prisma automatically manages connection pooling. Configure in schema:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Query Optimization
- Use `select` to limit returned fields
- Use `include` judiciously (avoid N+1 queries)
- Implement cursor-based pagination for large datasets
- Add indexes for frequently filtered/sorted columns

### Example Optimized Query
```javascript
const problems = await prisma.problem.findMany({
  where: { stage: { gte: 5 } },
  select: {
    id: true,
    problemId: true,
    title: true,
    briefparagraph: true,
    upvotes: true,
    createdAt: true,
    creator: {
      select: { name: true, email: true }
    }
  },
  orderBy: { createdAt: 'desc' },
  take: 12
});
```

---

## Maintenance

### Prisma Studio
Access database GUI:
```bash
npx prisma studio
```

### Schema Updates
After schema changes:
```bash
npx prisma migrate dev --name describe_your_changes
npx prisma generate
```

### Database Backups
Regular PostgreSQL backups:
```bash
pg_dump vjstartups > backup_$(date +%Y%m%d).sql
```

---

## Support

For issues during migration:
1. Check Prisma logs: Enable `log: ['query', 'error']` in PrismaClient
2. Review migration files in `prisma/migrations/`
3. Test queries in Prisma Studio
4. Consult Prisma docs: https://www.prisma.io/docs

---

## Summary

This migration:
- ✅ Preserves all existing functionality
- ✅ Maintains API compatibility
- ✅ Improves data integrity with foreign keys
- ✅ Normalizes data structure
- ✅ Adds proper indexing for performance
- ✅ Implements cascade deletes
- ✅ Maintains backward compatibility with legacy IDs
- ✅ Requires ZERO frontend changes
