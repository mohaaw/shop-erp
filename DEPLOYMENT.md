# Deployment & Production Guide

Complete guide for deploying ERP-SHOP to production.

---

## 🚀 Deployment Platforms

### Option 1: Vercel (Recommended for Next.js)

**Best for:** Frontend (Next.js)
**Cost:** Free tier available
**Time to deploy:** 2 minutes

#### Setup:
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Import Project"
4. Select your `erp-shop` repository
5. Configure:
   - **Framework**: Next.js
   - **Root Directory**: `./client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.com
   ```

7. Deploy!

**URL**: `your-app.vercel.app`

---

### Option 2: Railway (For Backend)

**Best for:** Express Backend
**Cost:** $5/month minimum
**Time to deploy:** 5 minutes

#### Setup:
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project
4. Connect your repository
5. Configure:
   - **Root**: Select `server` folder
   - **Start Command**: `npm start`
   - **Environment**: Node.js

6. Add Environment Variables:
   ```
   PORT=3001
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   DATABASE_URL=your-db-url
   ```

7. Deploy!

**URL**: `your-api-railway.app`

---

### Option 3: Docker (Self-Hosted)

**Best for:** Complete control
**Cost**: Depends on hosting
**Time to deploy**: 15 minutes

#### Create Dockerfile for Frontend:

```dockerfile
# client/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Create Dockerfile for Backend:

```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

#### Docker Compose:

```yaml
# docker-compose.yml
version: '3.9'

services:
  frontend:
    build:
      context: ./client
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://api:3001

  backend:
    build:
      context: ./server
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://user:pass@db:5432/erp_shop

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: erp_user
      POSTGRES_PASSWORD: secure_password
      POSTGRES_DB: erp_shop
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 🗄️ Database Setup

### PostgreSQL (Recommended)

#### Local Setup:
```bash
# Install PostgreSQL (if not already installed)
# macOS
brew install postgresql@15

# Windows
# Download from https://www.postgresql.org/download/windows/

# Start service
brew services start postgresql

# Create database
createdb erp_shop

# Create user
psql -U postgres -c "CREATE USER erp_user WITH PASSWORD 'your_secure_password';"
```

#### Connection String:
```
postgresql://erp_user:your_secure_password@localhost:5432/erp_shop
```

### Environment Variables:

**server/.env**
```env
PORT=3001
NODE_ENV=production
JWT_SECRET=your-very-secure-secret-key-minimum-32-characters
DATABASE_URL=postgresql://erp_user:password@localhost:5432/erp_shop
CORS_ORIGIN=https://your-frontend-url.com
```

**client/.env.production**
```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

---

## 🔐 Security Checklist

Before going to production:

- [ ] Change all default credentials
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable HTTPS everywhere
- [ ] Set CORS to specific domains
- [ ] Add rate limiting to API
- [ ] Enable database encryption
- [ ] Set up database backups
- [ ] Use environment variables for secrets
- [ ] Enable security headers
- [ ] Set up logging & monitoring
- [ ] Enable API authentication
- [ ] Add input validation
- [ ] Set up SSL certificates

---

## 📊 Performance Optimization

### Frontend (Next.js)

```bash
# Build for production
npm run build

# Analyze bundle size
npm install -D @next/bundle-analyzer

# Update next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // ... your config
})

# Analyze
ANALYZE=true npm run build
```

### Backend (Express)

```javascript
// Add compression
const compression = require('compression');
app.use(compression());

// Add helmet for security headers
const helmet = require('helmet');
app.use(helmet());

// Add rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
```

---

## 🔄 Continuous Integration/Deployment (CI/CD)

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies (Frontend)
        run: cd client && npm install
      
      - name: Build frontend
        run: cd client && npm run build
      
      - name: Type check
        run: cd client && npm run type-check
      
      - name: Install dependencies (Backend)
        run: cd server && npm install
      
      - name: Test backend
        run: cd server && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel (Frontend)
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./client
      
      - name: Deploy to Railway (Backend)
        run: |
          npm install -g @railway/cli
          railway login --token ${{ secrets.RAILWAY_TOKEN }}
          railway up
        working-directory: ./server
```

---

## 📈 Monitoring & Analytics

### Application Monitoring

1. **Sentry** (Error Tracking)
```bash
npm install @sentry/nextjs
```

2. **Vercel Analytics** (Performance)
   - Included with Vercel deployment

3. **Datadog** (Full Stack Monitoring)
   - Set up for backend monitoring

### Database Monitoring

```bash
# PostgreSQL monitoring
SELECT version();
SELECT datname, size_pretty(pg_database.get_database_size(datname))
FROM pg_database;
```

---

## 🔄 Database Migrations

### Using Prisma (Recommended)

1. Install Prisma:
```bash
npm install @prisma/client
npm install -D prisma
```

2. Initialize:
```bash
npx prisma init
```

3. Update `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/erp_shop"
```

4. Create schema (`prisma/schema.prisma`):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
```

5. Run migrations:
```bash
npx prisma migrate dev --name init
```

---

## 🛠️ Backup & Recovery

### Database Backup

```bash
# Daily backup
pg_dump erp_shop > backup_$(date +%Y%m%d).sql

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups/erp_shop"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump erp_shop | gzip > $BACKUP_DIR/backup_$DATE.sql.gz
```

### Restore from Backup

```bash
# Restore database
psql erp_shop < backup_20231127.sql

# Or from gzip
gunzip -c backup_20231127.sql.gz | psql erp_shop
```

---

## 📋 Production Checklist

Before launch:

**Frontend:**
- [ ] Build tested locally
- [ ] Environment variables set
- [ ] API endpoints verified
- [ ] SSL certificate configured
- [ ] Performance optimized
- [ ] Error boundaries in place
- [ ] Analytics enabled
- [ ] Monitoring set up

**Backend:**
- [ ] Database migrations run
- [ ] API endpoints tested
- [ ] Authentication working
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Error handling complete
- [ ] Security headers set

**Infrastructure:**
- [ ] Domain configured
- [ ] SSL/TLS enabled
- [ ] CDN configured
- [ ] Backups scheduled
- [ ] Monitoring active
- [ ] Alerting configured
- [ ] CI/CD pipeline working

---

## 🚨 Troubleshooting

### Common Issues

**Frontend won't load:**
- Check NEXT_PUBLIC_API_URL
- Verify CORS settings
- Check network in DevTools

**API calls failing:**
- Check DATABASE_URL
- Verify credentials
- Check network firewall

**Database connection issues:**
- Verify connection string
- Check PostgreSQL running
- Verify user permissions

---

## 📞 Support Resources

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Prisma Docs: https://www.prisma.io/docs
- PostgreSQL Docs: https://www.postgresql.org/docs
- Next.js Docs: https://nextjs.org/docs
- Express Docs: https://expressjs.com

---

**Your ERP-SHOP is ready for production! 🚀**
