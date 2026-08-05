# Deployment Guide - VJ Startups Backend

## 🚀 Production Deployment

This guide covers deploying the VJ Startups backend to production with PostgreSQL.

---

## Prerequisites

- Production PostgreSQL database (14+)
- Node.js 18+ runtime environment
- Domain name and SSL certificate
- Environment variables configured

---

## Deployment Options

### Option 1: Traditional VPS (Recommended)

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL 14+
sudo apt install -y postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2
```

#### 2. PostgreSQL Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE vjstartups;
CREATE USER vjstartups_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE vjstartups TO vjstartups_user;
\q

# Test connection
psql -h localhost -U vjstartups_user -d vjstartups
```

#### 3. Application Deployment

```bash
# Clone repository
cd /var/www
git clone <your-repo-url> vjstartups-backend
cd vjstartups-backend/backend

# Install dependencies
npm install --production

# Create .env file
nano .env
# Add production environment variables (see below)

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start with PM2
pm2 start server.js --name vjstartups-api
pm2 save
pm2 startup  # Follow instructions to enable auto-start
```

#### 4. Nginx Configuration

```nginx
server {
    listen 80;
    server_name api.vjstartups.com;

    location / {
        proxy_pass http://localhost:6220;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # File upload size limit
    client_max_body_size 50M;
}
```

#### 5. SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.vjstartups.com

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

---

### Option 2: Docker Deployment

#### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy application code
COPY . .

# Expose port
EXPOSE 6220

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["node", "server.js"]
```

#### 2. Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: vjstartups
      POSTGRES_USER: vjstartups_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U vjstartups_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: .
    ports:
      - "6220:6220"
    environment:
      DATABASE_URL: postgresql://vjstartups_user:${DB_PASSWORD}@postgres:5432/vjstartups
      NODE_ENV: production
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped

volumes:
  postgres_data:
```

#### 3. Deploy with Docker

```bash
# Build and start
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Check logs
docker-compose logs -f backend
```

---

### Option 3: Cloud Platforms

#### Heroku

```bash
# Install Heroku CLI
# Add Heroku remote
heroku create vjstartups-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set GOOGLE_CLIENT_ID=<your-id>
heroku config:set CLOUDINARY_CLOUD_NAME=<your-name>
# ... other env vars

# Deploy
git push heroku main

# Run migrations
heroku run npm run prisma:migrate

# Check logs
heroku logs --tail
```

#### Railway

1. Connect GitHub repository
2. Add PostgreSQL database
3. Configure environment variables
4. Deploy automatically on push

#### Render

1. Create Web Service
2. Add PostgreSQL database
3. Set build command: `npm install && npx prisma generate`
4. Set start command: `npm start`
5. Add environment variables

---

## Environment Variables (Production)

Create `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/vjstartups?schema=public"

# Server
NODE_ENV=production
PORT=6220

# Authentication
GOOGLE_CLIENT_ID=your_production_google_client_id

# Admin
ADMIN_EMAILS=admin@vnrvjiet.in,admin2@vnrvjiet.in
WING_MASTER_EMAILS=wingmaster@vnrvjiet.in

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security (Optional)
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

---

## Database Backup Strategy

### Automated Backups

```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/vjstartups"
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Dump database
pg_dump -h localhost -U vjstartups_user vjstartups > $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

# Remove backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

### Schedule with Cron

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup-db.sh
```

---

## Monitoring & Logging

### PM2 Monitoring

```bash
# Install PM2 Plus (optional, for advanced monitoring)
pm2 install pm2-server-monit

# View logs
pm2 logs vjstartups-api

# Monitor resources
pm2 monit

# Save logs to file
pm2 logs --out /var/log/vjstartups-api.log
```

### Application Logging

Add Winston or Pino for structured logging:

```javascript
// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
```

---

## Performance Optimization

### 1. Database Connection Pooling

Prisma automatically manages connection pooling. Configure in DATABASE_URL:

```
postgresql://user:password@host:5432/db?connection_limit=20&pool_timeout=30
```

### 2. Query Optimization

```javascript
// Use select to limit fields
const problems = await prisma.problem.findMany({
  select: {
    id: true,
    problemId: true,
    title: true,
    upvotes: true
  }
});

// Use pagination
const problems = await prisma.problem.findMany({
  take: 20,
  skip: (page - 1) * 20
});

// Use indexes (already in schema)
```

### 3. Caching (Optional)

Install Redis for caching:

```bash
# Install Redis
sudo apt install redis-server

# Install Node Redis client
npm install redis
```

```javascript
// cache.js
const redis = require('redis');
const client = redis.createClient();

async function getCached(key, fetchFunction, ttl = 3600) {
  const cached = await client.get(key);
  if (cached) return JSON.parse(cached);
  
  const fresh = await fetchFunction();
  await client.setEx(key, ttl, JSON.stringify(fresh));
  return fresh;
}

module.exports = { getCached };
```

### 4. Load Balancing (For High Traffic)

Use Nginx as load balancer:

```nginx
upstream backend {
    least_conn;
    server 127.0.0.1:6220;
    server 127.0.0.1:6221;
    server 127.0.0.1:6222;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

---

## Security Checklist

- [ ] Use HTTPS (SSL/TLS) for all connections
- [ ] Set strong PostgreSQL passwords
- [ ] Enable PostgreSQL SSL connections
- [ ] Configure firewall (allow only necessary ports)
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Keep dependencies updated (`npm audit fix`)
- [ ] Disable Prisma Studio in production
- [ ] Use prepared statements (Prisma does this automatically)
- [ ] Implement CORS whitelist
- [ ] Set up monitoring and alerts
- [ ] Regular database backups
- [ ] Use non-root user for Node.js process

---

## Troubleshooting

### High Memory Usage

```bash
# Check Node.js memory
pm2 status

# Increase memory limit
pm2 start server.js --name vjstartups-api --max-memory-restart 500M
```

### Slow Queries

```javascript
// Enable query logging in Prisma
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Analyze slow queries
// Add indexes to frequently queried fields
```

### Connection Pool Exhausted

```
// Increase connection limit in DATABASE_URL
postgresql://user:pass@host:5432/db?connection_limit=30
```

---

## Rollback Procedure

If deployment fails:

```bash
# Revert to previous version
git checkout <previous-commit>
npm install
npm run prisma:generate

# Rollback database migration
npx prisma migrate resolve --rolled-back <migration-name>

# Restart application
pm2 restart vjstartups-api
```

---

## Health Checks

Create `healthcheck.js`:

```javascript
const http = require('http');

const options = {
  host: 'localhost',
  port: 6220,
  path: '/health',
  timeout: 2000
};

const healthCheck = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode == 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

healthCheck.on('error', (err) => {
  console.error('ERROR');
  process.exit(1);
});

healthCheck.end();
```

Add health endpoint in `server.js`:

```javascript
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});
```

---

## Maintenance

### Regular Tasks

1. **Weekly**: Check logs for errors
2. **Weekly**: Monitor database size and performance
3. **Monthly**: Update dependencies (`npm update`)
4. **Monthly**: Review and optimize slow queries
5. **Quarterly**: Security audit (`npm audit`)
6. **Yearly**: Review and update backups strategy

---

## Support

For deployment issues:
- Check logs: `pm2 logs vjstartups-api`
- Check database: `psql -U vjstartups_user vjstartups`
- Check Prisma: `npx prisma studio`

---

## Success Checklist

After deployment, verify:

- [ ] Server is running (`pm2 status`)
- [ ] Database connection works
- [ ] Migrations applied successfully
- [ ] API endpoints respond correctly
- [ ] SSL certificate is valid
- [ ] CORS allows frontend origin
- [ ] File uploads work
- [ ] Authentication works
- [ ] Backups are running
- [ ] Monitoring is active
- [ ] Logs are being collected

---

🎉 **Deployment Complete!**

Your VJ Startups backend is now running in production with PostgreSQL.
