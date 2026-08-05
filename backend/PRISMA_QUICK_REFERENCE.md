# Prisma Quick Reference - Mongoose to Prisma Conversion

## 🚀 Quick Start

```javascript
// Import Prisma client
const prisma = require('../config/prisma');

// All operations are async/await
const result = await prisma.model.operation();
```

---

## 📖 Common Operations

### CREATE

```javascript
// Mongoose
const user = new User({ email, name });
await user.save();

// Prisma
const user = await prisma.user.create({
  data: { email, name }
});
```

### CREATE with Relations

```javascript
// Mongoose
const problem = new Problem({ title, addedByEmail });
problem.collaborators = ['email1@test.com', 'email2@test.com'];
await problem.save();

// Prisma
const problem = await prisma.problem.create({
  data: {
    title,
    addedByEmail,
    collaborators: {
      create: [
        { email: 'email1@test.com' },
        { email: 'email2@test.com' }
      ]
    }
  }
});
```

### FIND ALL

```javascript
// Mongoose
const problems = await Problem.find();

// Prisma
const problems = await prisma.problem.findMany();
```

### FIND with Filter

```javascript
// Mongoose
const problems = await Problem.find({ stage: 5 });

// Prisma
const problems = await prisma.problem.findMany({
  where: { stage: 5 }
});
```

### FIND ONE

```javascript
// Mongoose
const problem = await Problem.findOne({ problemId: '123' });

// Prisma
const problem = await prisma.problem.findUnique({
  where: { problemId: '123' }
});
// OR
const problem = await prisma.problem.findFirst({
  where: { problemId: '123' }
});
```

### FIND by ID

```javascript
// Mongoose
const problem = await Problem.findById(id);

// Prisma
const problem = await prisma.problem.findUnique({
  where: { id: id }
});
```

### UPDATE

```javascript
// Mongoose
await Problem.findByIdAndUpdate(id, { title: 'New Title' }, { new: true });

// Prisma
await prisma.problem.update({
  where: { id },
  data: { title: 'New Title' }
});
```

### UPDATE Many

```javascript
// Mongoose
await Problem.updateMany({ stage: 1 }, { status: 'active' });

// Prisma
await prisma.problem.updateMany({
  where: { stage: 1 },
  data: { status: 'active' }
});
```

### UPSERT (Create or Update)

```javascript
// Mongoose
await User.findOneAndUpdate(
  { email },
  { name, picture },
  { upsert: true, new: true }
);

// Prisma
await prisma.user.upsert({
  where: { email },
  update: { name, picture },
  create: { email, name, picture }
});
```

### DELETE

```javascript
// Mongoose
await Problem.findByIdAndDelete(id);
// OR
await Problem.deleteOne({ problemId: '123' });

// Prisma
await prisma.problem.delete({
  where: { id }
});
```

### DELETE Many

```javascript
// Mongoose
await Problem.deleteMany({ status: 'inactive' });

// Prisma
await prisma.problem.deleteMany({
  where: { status: 'inactive' }
});
```

### COUNT

```javascript
// Mongoose
const count = await Problem.countDocuments({ stage: 5 });

// Prisma
const count = await prisma.problem.count({
  where: { stage: 5 }
});
```

---

## 🔗 Relations & Populate

### Include Relations (Populate)

```javascript
// Mongoose
const problems = await Problem.find()
  .populate('creator', 'name email');

// Prisma
const problems = await prisma.problem.findMany({
  include: {
    creator: {
      select: { name: true, email: true }
    }
  }
});
```

### Include Multiple Relations

```javascript
// Mongoose
const ideas = await Idea.find()
  .populate('creator')
  .populate('problem');

// Prisma
const ideas = await prisma.idea.findMany({
  include: {
    creator: true,
    problem: true
  }
});
```

### Nested Includes

```javascript
// Prisma
const problems = await prisma.problem.findMany({
  include: {
    comments: {
      include: {
        replies: true,
        likedBy: true
      }
    },
    upvotedBy: true
  }
});
```

---

## 🔍 Filtering & Sorting

### Basic Filters

```javascript
// Mongoose
const problems = await Problem.find({
  stage: { $gte: 5 },
  status: 'active'
});

// Prisma
const problems = await prisma.problem.findMany({
  where: {
    stage: { gte: 5 },
    status: 'active'
  }
});
```

### OR Conditions

```javascript
// Mongoose
const results = await Problem.find({
  $or: [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } }
  ]
});

// Prisma
const results = await prisma.problem.findMany({
  where: {
    OR: [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }
});
```

### AND Conditions

```javascript
// Prisma
const results = await prisma.problem.findMany({
  where: {
    AND: [
      { stage: { gte: 3 } },
      { upvotes: { gte: 10 } }
    ]
  }
});
```

### Sorting

```javascript
// Mongoose
const problems = await Problem.find()
  .sort({ createdAt: -1, upvotes: -1 });

// Prisma
const problems = await prisma.problem.findMany({
  orderBy: [
    { createdAt: 'desc' },
    { upvotes: 'desc' }
  ]
});
```

### Pagination

```javascript
// Mongoose
const problems = await Problem.find()
  .skip((page - 1) * limit)
  .limit(limit);

// Prisma
const problems = await prisma.problem.findMany({
  skip: (page - 1) * limit,
  take: limit
});
```

---

## 🎯 Select Fields

### Select Specific Fields

```javascript
// Mongoose
const problems = await Problem.find()
  .select('title upvotes createdAt');

// Prisma
const problems = await prisma.problem.findMany({
  select: {
    title: true,
    upvotes: true,
    createdAt: true
  }
});
```

### Exclude Fields

```javascript
// Mongoose
const users = await User.find()
  .select('-password -adminToken');

// Prisma
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
    // Simply don't include password and adminToken
  }
});
```

---

## 🔄 Array Operations → Relations

### Push to Array → Create Related Record

```javascript
// Mongoose
problem.upvotedBy.push(userEmail);
await problem.save();

// Prisma
await prisma.problemUpvote.create({
  data: {
    problemId: problem.id,
    userEmail
  }
});
```

### Remove from Array → Delete Related Record

```javascript
// Mongoose
problem.upvotedBy = problem.upvotedBy.filter(e => e !== userEmail);
await problem.save();

// Prisma
await prisma.problemUpvote.delete({
  where: {
    problemId_userEmail: {
      problemId: problem.id,
      userEmail
    }
  }
});
```

### Toggle (Add/Remove)

```javascript
// Prisma
const existing = await prisma.problemUpvote.findUnique({
  where: {
    problemId_userEmail: {
      problemId: problem.id,
      userEmail
    }
  }
});

if (existing) {
  await prisma.problemUpvote.delete({
    where: { id: existing.id }
  });
} else {
  await prisma.problemUpvote.create({
    data: { problemId: problem.id, userEmail }
  });
}
```

### Check if Exists in Array → Check Related Record

```javascript
// Mongoose
const hasUpvoted = problem.upvotedBy.includes(userEmail);

// Prisma
const upvote = await prisma.problemUpvote.findUnique({
  where: {
    problemId_userEmail: {
      problemId: problem.id,
      userEmail
    }
  }
});
const hasUpvoted = !!upvote;
```

---

## 📝 Embedded Documents → Relations

### Push to Comments Array → Create Comment

```javascript
// Mongoose
problem.comments.push({
  commentId: uuidv4(),
  text, name, email,
  createdAt: new Date()
});
await problem.save();

// Prisma
await prisma.problemComment.create({
  data: {
    commentId: uuidv4(),
    problemId: problem.id,
    text, name, email
  }
});
```

### Update Nested Document → Update Related Record

```javascript
// Mongoose
const comment = problem.comments.id(commentId);
comment.text = 'Updated text';
await problem.save();

// Prisma
await prisma.problemComment.update({
  where: { commentId },
  data: { text: 'Updated text' }
});
```

### Remove Nested Document → Delete Related Record

```javascript
// Mongoose
problem.comments.id(commentId).remove();
await problem.save();

// Prisma
await prisma.problemComment.delete({
  where: { commentId }
});
```

---

## 🔐 Transactions

### Simple Transaction

```javascript
// Prisma
await prisma.$transaction(async (tx) => {
  const problem = await tx.problem.create({ 
    data: { title, addedByEmail } 
  });
  
  await tx.problemCollaborator.createMany({
    data: collaborators.map(email => ({
      problemId: problem.id,
      email
    }))
  });
});
```

### Complex Transaction with Error Handling

```javascript
// Prisma
try {
  const result = await prisma.$transaction(async (tx) => {
    // Create main record
    const idea = await tx.idea.create({ data: {...} });
    
    // Create related records
    await tx.ideaTeamMember.createMany({ data: [...] });
    await tx.ideaAttachment.createMany({ data: [...] });
    
    // Update counter
    await tx.problem.update({
      where: { id: idea.relatedProblemId },
      data: { ideaCount: { increment: 1 } }
    });
    
    return idea;
  });
  
  return result;
} catch (error) {
  console.error('Transaction failed:', error);
  throw error;
}
```

---

## 📊 Aggregations

### Count by Group

```javascript
// Mongoose
const stats = await Problem.aggregate([
  { $group: { _id: '$stage', count: { $sum: 1 } } }
]);

// Prisma
const stats = await prisma.problem.groupBy({
  by: ['stage'],
  _count: true
});
```

### Sum / Avg

```javascript
// Prisma
const stats = await prisma.problem.aggregate({
  _sum: { upvotes: true },
  _avg: { upvotes: true },
  _count: true
});
```

### Raw SQL for Complex Aggregations

```javascript
// Prisma
const result = await prisma.$queryRaw`
  SELECT 
    stage,
    COUNT(*) as count,
    AVG(upvotes) as avg_upvotes
  FROM problems
  WHERE created_at > NOW() - INTERVAL '30 days'
  GROUP BY stage
  ORDER BY count DESC
`;
```

---

## 🔍 Search & Text Matching

### Case-Insensitive Search

```javascript
// Mongoose
const results = await Problem.find({
  title: { $regex: search, $options: 'i' }
});

// Prisma
const results = await prisma.problem.findMany({
  where: {
    title: {
      contains: search,
      mode: 'insensitive'
    }
  }
});
```

### Multiple Field Search

```javascript
// Prisma
const results = await prisma.problem.findMany({
  where: {
    OR: [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } }
    ]
  }
});
```

### Starts With / Ends With

```javascript
// Prisma
const results = await prisma.user.findMany({
  where: {
    email: {
      endsWith: '@vnrvjiet.in'
    }
  }
});
```

---

## 🎨 Special Cases

### Working with Arrays (String[])

```javascript
// Check if array contains value
const problems = await prisma.problem.findMany({
  where: {
    tags: {
      has: 'tech'
    }
  }
});

// Check if array contains any of values
const problems = await prisma.problem.findMany({
  where: {
    tags: {
      hasSome: ['tech', 'startup', 'innovation']
    }
  }
});
```

### Working with JSON Fields

```javascript
// Store JSON
await prisma.questionnaireResponse.create({
  data: {
    responses: {
      question1: 'answer1',
      question2: 'answer2'
    }
  }
});

// Query JSON (PostgreSQL-specific)
const responses = await prisma.questionnaireResponse.findMany({
  where: {
    responses: {
      path: ['question1'],
      equals: 'answer1'
    }
  }
});
```

### Working with Dates

```javascript
// Date range
const recent = await prisma.problem.findMany({
  where: {
    createdAt: {
      gte: new Date('2024-01-01'),
      lte: new Date('2024-12-31')
    }
  }
});

// Last 7 days
const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 7);

const recent = await prisma.problem.findMany({
  where: {
    createdAt: { gte: weekAgo }
  }
});
```

---

## ⚠️ Common Pitfalls

### 1. Don't Forget to Connect Relations

```javascript
// ❌ Wrong
await prisma.problem.create({
  data: {
    title,
    addedByEmail // This is just a string!
  }
});

// ✅ Correct
await prisma.problem.create({
  data: {
    title,
    addedByEmail,
    creator: {
      connect: { email: addedByEmail }
    }
  }
});
```

### 2. Use Correct Where Clause for Unique Fields

```javascript
// ❌ Wrong
const problem = await prisma.problem.findFirst({
  where: { problemId: '123' }
});

// ✅ Better (uses unique index)
const problem = await prisma.problem.findUnique({
  where: { problemId: '123' }
});
```

### 3. Handle Null Relationships

```javascript
// ✅ Good - handle optional relations
const ideas = await prisma.idea.findMany({
  include: {
    problem: true  // Can be null
  }
});

ideas.forEach(idea => {
  if (idea.problem) {
    console.log(idea.problem.title);
  }
});
```

### 4. Use Transactions for Multi-Step Operations

```javascript
// ❌ Risky (no rollback if second step fails)
const problem = await prisma.problem.create({ data: {...} });
await prisma.problemCollaborator.create({ data: {...} });

// ✅ Safe (atomic operation)
await prisma.$transaction(async (tx) => {
  const problem = await tx.problem.create({ data: {...} });
  await tx.problemCollaborator.create({ data: {...} });
});
```

---

## 🛠️ Debugging

### Enable Query Logging

```javascript
// config/prisma.js
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Use Prisma Studio

```bash
npx prisma studio
# Opens GUI at http://localhost:5555
```

### Check Generated SQL

```javascript
// Set log level to see SQL queries
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
  ],
});

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Params: ' + e.params);
  console.log('Duration: ' + e.duration + 'ms');
});
```

---

## 📚 Additional Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Full Schema](./prisma/schema.prisma)

---

## 🎯 Quick Tips

1. **Always use transactions** for related operations
2. **Use `select`** to limit returned fields
3. **Use `include`** instead of multiple queries
4. **Leverage unique indexes** with `findUnique`
5. **Handle null relations** gracefully
6. **Use Prisma Studio** for debugging
7. **Enable query logging** during development
8. **Test cascade deletes** thoroughly

---

*This quick reference covers the most common patterns. See full documentation for advanced features.*
