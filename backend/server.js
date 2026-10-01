// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const prisma = require('./config/prisma');
const { corsOrigins } = require('./config/appConfig');

dotenv.config();
const app = express();

// Parse JSON bodies
app.use(express.json());

// CORS — allowed origins come from config/appConfig.js (CORS_ORIGINS overrides;
// localhost is only allowed outside production).
app.use(cors({
  origin: corsOrigins(),
  credentials: true
}));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Test database connection
(async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL Connected via Prisma');
  } catch (err) {
    console.error('❌ DB Connection Failed:', err);
    process.exit(1);
  }
})();

// ─── Routes ──────────────────────────────────────────────────────────────────

// Existing public routes. They return other people's emails and phone numbers only where the
// requester is entitled to them (middlewares/privacy.js); optionalUser tells it who is asking.
const { optionalUser } = require('./middlewares/actingUser');
const privacy = require('./middlewares/privacy');
const publicApi = [optionalUser, privacy];

app.use('/problem-api', publicApi, require('./APIs/problems-api'));
app.use('/idea-api', publicApi, require('./APIs/ideas-api'));
app.use('/questionnaire-api', publicApi, require('./APIs/questionnaire-api'));
app.use('/startup-api', publicApi, require('./APIs/startups-api'));
app.use('/auth', require('./APIs/auth-api'));
app.use('/notification-api', publicApi, require('./APIs/notifications-api'));

// Admin routes (all protected by adminAuth middleware inside)
app.use('/admin-api', require('./APIs/admin-api'));

// tasks-api.js (kanban board) is unmounted: confirmed zero frontend usage,
// and its Project/Task models named their tables "projects"/"project_members"
// /"tasks", which now belong to Plane's own native project management
// system after the Postgres merge - every route in that file 500s.

app.use('/announcements-api', publicApi, require('./APIs/announcements-api'));
app.use('/story-api', require('./APIs/stories-api'));
app.use('/leaderboard-api', require('./APIs/leaderboard-api'));
app.use('/stats-api', require('./APIs/stats-api'));
app.use('/content-api', require('./APIs/content-api'));

// ─────────────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 6220;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});
