# VJ Startups Backend - PostgreSQL Migration

## 📋 Overview

This is the backend API for the VJ Startups platform, migrated from MongoDB/Mongoose to PostgreSQL/Prisma.

## 🗄️ Database

- **Database**: PostgreSQL 14+
- **ORM**: Prisma 7.9.1
- **Previous**: MongoDB (Mongoose) - DEPRECATED

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# 3. Generate Prisma Client
npm run prisma:generate

# 4. Create database and run migrations
createdb vjstartups  # Create PostgreSQL database
npm run prisma:migrate

# 5. (Optional) Seed demo data
npm run prisma:seed

# 6. Start server
npm run dev  # Development with nodemon
# OR
npm start    # Production
```

## 📝 Environment Variables

Create a `.env` file with the following:

```env
# PostgreSQL Connection
DATABASE_URL="postgresql://username:password@localhost:5432/vjstartups?schema=public"

# Server Configuration
PORT=6220

# Admin Configuration
ADMIN_EMAILS=admin@example.com,admin2@example.com
WING_MASTER_EMAILS=wingmaster@example.com

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
```

## 🛠️ Development Commands

### Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Push schema changes without migration (dev only)
npm run db:push

# Reset database (⚠️ DELETES ALL DATA)
npm run db:reset

# Seed database with demo data
npm run prisma:seed
```

### Server Commands

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## 📁 Project Structure

```
backend/
├── APIs/                    # API route handlers
│   ├── auth-api.js         # Authentication (Google OAuth)
│   ├── problems-api.js     # Problem statements
│   ├── ideas-api.js        # Ideas and solutions
│   ├── startups-api.js     # Startup profiles
│   ├── questionnaire-api.js # Idea evaluation
│   ├── tasks-api.js        # Project management
│   ├── admin-api.js        # Admin operations
│   ├── announcements-api.js # Announcements
│   └── notifications-api.js # Stage notifications
├── config/                  # Configuration files
│   ├── prisma.js           # Prisma client singleton
│   └── cloudinary.js       # Cloudinary config
├── middlewares/             # Express middlewares
│   ├── adminAuth.js        # Admin authorization
│   └── upload.js           # File upload handling
├── prisma/                  # Prisma ORM files
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Migration history
│   └── seed.js             # Seed script
├── uploads/                 # Uploaded files storage
├── .env                     # Environment variables (create from .env.example)
├── .env.example            # Environment template
├── server.js               # Express server entry point
├── package.json            # Node dependencies
├── MIGRATION_GUIDE.md      # Detailed migration documentation
└── README.md               # This file
```

## 🔄 Migration from MongoDB

If you're migrating from an existing MongoDB instance, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for:
- Complete schema mapping
- Data migration scripts
- API conversion guide
- Testing checklist

## 🔗 API Endpoints

### Authentication
- `POST /auth/google` - Google OAuth login

### Problems
- `GET /problem-api/problems` - List problems (paginated)
- `POST /problem-api/problem` - Create problem
- `GET /problem-api/problems/:id` - Get problem details
- `PUT /problem-api/problems/:id/:email` - Update problem
- `DELETE /problem-api/problems/:problemId` - Delete problem
- `POST /problem-api/problem/:id/upvote` - Toggle upvote
- `POST /problem-api/problem/:id/comment` - Add comment
- `POST /problem-api/check-duplicates` - Check for duplicates

### Ideas
- `GET /idea-api/ideas` - List all ideas
- `POST /idea-api/idea` - Create idea
- `GET /idea-api/ideas/:ideaId` - Get idea details
- `PUT /idea-api/idea/:ideaId` - Update idea
- `DELETE /idea-api/idea/:ideaId` - Delete idea
- `POST /idea-api/idea/:ideaId/upvote` - Toggle upvote
- `POST /idea-api/ideas/:ideaId/comments` - Add comment
- `POST /idea-api/ideas/:ideaId/attachments` - Upload attachment
- `POST /idea-api/ideas/:ideaId/links` - Add link

### Startups
- `GET /startup-api` - List startups
- `POST /startup-api` - Create startup
- `GET /startup-api/:id` - Get startup details
- `PUT /startup-api/:id` - Update startup
- `DELETE /startup-api/:id` - Delete startup
- `POST /startup-api/:id/upvote` - Upvote startup

### Questionnaires
- `POST /questionnaire-api/response` - Submit questionnaire
- `GET /questionnaire-api/responses/:userEmail` - Get user responses
- `GET /questionnaire-api/responses/idea/:ideaId` - Get idea responses

### Projects & Tasks
- `GET /tasks-api/projects` - List projects
- `POST /tasks-api/projects` - Create project
- `GET /tasks-api/tasks` - List tasks (by project)
- `POST /tasks-api/tasks` - Create task
- `PUT /tasks-api/tasks/:id` - Update task
- `PATCH /tasks-api/tasks/:id/status` - Update task status
- `POST /tasks-api/tasks/:id/comments` - Add comment

### Announcements
- `GET /announcements-api` - List active announcements
- `POST /announcements-api` - Create announcement (admin only)

### Admin
- `GET /admin-api/users` - List users (admin only)
- Various admin management endpoints

## 🧪 Testing

### Manual Testing Checklist

After starting the server, test these endpoints:

1. **Health Check**
   ```bash
   curl http://localhost:6220/problem-api/problems
   ```

2. **Database Connection**
   ```bash
   npm run prisma:studio
   # Opens database GUI at http://localhost:5555
   ```

3. **Authentication**
   - Test Google OAuth login
   - Verify JWT token generation

4. **CRUD Operations**
   - Create a problem
   - Update the problem
   - Add a comment
   - Delete the problem

## 📊 Database Schema

The database uses PostgreSQL with the following main tables:

- **users** - User profiles and authentication
- **problems** - Community problems
- **ideas** - Solution ideas
- **startups** - Startup profiles
- **questionnaire_responses** - Idea evaluations
- **projects** - Project boards
- **tasks** - Project tasks
- **announcements** - System announcements
- **stage_notifications** - Progress notifications

Plus many relationship tables for:
- Comments and replies
- Upvotes and likes
- Collaborators
- Team members
- Attachments and links

See `prisma/schema.prisma` for the complete schema.

## 🔒 Security

### Authentication
- Google OAuth 2.0 for user authentication
- Admin role-based access control
- Session tokens for admin authentication

### Data Protection
- SQL injection protection via Prisma parameterized queries
- Input validation on all endpoints
- File upload restrictions and validation
- CORS configuration for allowed origins

### Best Practices
- Environment variables for sensitive data
- Prepared statements (via Prisma)
- Cascade delete protection
- Foreign key constraints

## 🚨 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Test database connection
psql -h localhost -U username -d vjstartups

# Check DATABASE_URL in .env
echo $DATABASE_URL
```

### Prisma Issues

```bash
# Reset Prisma Client
rm -rf node_modules/.prisma
npm run prisma:generate

# Check migration status
npx prisma migrate status

# View Prisma logs
# Set in config/prisma.js: log: ['query', 'error', 'warn']
```

### Port Already in Use

```bash
# Find process using port 6220
netstat -ano | findstr :6220  # Windows
lsof -i :6220                  # Linux/Mac

# Kill the process
kill -9 <PID>                  # Linux/Mac
taskkill /PID <PID> /F         # Windows
```

## 📚 Documentation

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Migration Guide](./MIGRATION_GUIDE.md)

## 🤝 Contributing

1. Create a new branch for your feature
2. Make changes and test thoroughly
3. Update documentation if needed
4. Submit a pull request

## 📄 License

ISC License - See LICENSE file for details

## 👥 Team

VJ Startups Development Team

---

## 🎯 Next Steps

After setup:

1. ✅ Verify database connection
2. ✅ Run migrations
3. ✅ Test API endpoints
4. ✅ Check Prisma Studio
5. ✅ Update frontend .env if needed
6. ✅ Deploy to production

For production deployment, see deployment documentation.
