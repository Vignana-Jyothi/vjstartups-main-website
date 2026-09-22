// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const prisma = require('./config/prisma');

dotenv.config();
const app = express();

// Parse JSON bodies
app.use(express.json());

// CORS — allow main site, admin panel, and plane board
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:4000',
    'http://localhost:4001', // admin dev
    'http://localhost:4002', // plane dev
    'https://hub.vjstartup.com',
    'https://vjstartups.com',
    'https://www.vjstartups.com',
    'https://admin.vjstartups.com',
    'https://plane.vjstartups.com',
  ],
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

// Existing public routes
app.use('/problem-api', require('./APIs/problems-api'));
app.use('/idea-api', require('./APIs/ideas-api'));
app.use('/questionnaire-api', require('./APIs/questionnaire-api'));
app.use('/startup-api', require('./APIs/startups-api'));
app.use('/auth', require('./APIs/auth-api'));
app.use('/notification-api', require('./APIs/notifications-api'));

// Admin routes (all protected by adminAuth middleware inside)
app.use('/admin-api', require('./APIs/admin-api'));

// tasks-api.js (kanban board) is unmounted: confirmed zero frontend usage,
// and its Project/Task models named their tables "projects"/"project_members"
// /"tasks", which now belong to Plane's own native project management
// system after the Postgres merge - every route in that file 500s.

app.use('/announcements-api', require('./APIs/announcements-api'));

// TEMPORARY - for diagnosing the admin proxy's persistent 401. Echoes back
// exactly what this server received, no auth involved, to rule in/out
// whether a custom header is even reaching Express. Remove once resolved.
app.get('/debug-echo-headers', (req, res) => {
  res.json({ headers: req.headers });
});

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
