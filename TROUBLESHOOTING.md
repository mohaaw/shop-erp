# Troubleshooting Guide

Complete reference for debugging common issues in ERP-SHOP.

---

## 🔍 Development Setup Issues

### Node/npm Issues

**Problem: `npm command not found`**
- Solution: Install Node.js from https://nodejs.org/
- Verify: `node --version` and `npm --version`

**Problem: `npm install` very slow**
- Solution: Clear cache and use npm ci:
```bash
npm cache clean --force
npm ci
```

**Problem: Different node versions causing issues**
- Solution: Use nvm (Node Version Manager)
```bash
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Windows
# Download from https://github.com/coreybutler/nvm-windows/releases
```

---

## ⚛️ Frontend Issues

### Development Server

**Problem: `npm run dev` crashes immediately**
```
Solution checklist:
1. Delete .next folder: rm -rf .next
2. Delete node_modules: rm -rf node_modules
3. Clear npm cache: npm cache clean --force
4. Reinstall: npm install
5. Restart: npm run dev
```

**Problem: Port 3000 already in use**
```bash
# macOS/Linux - Find and kill process
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Problem: Module not found errors**
```
TypeScript can't find modules even though they exist
Solution:
1. Check file paths are correct
2. Verify tsconfig.json path aliases
3. Restart TypeScript server (Cmd+Shift+P > TypeScript: Restart TS Server)
4. Delete .next and node_modules, reinstall
```

### Styling Issues

**Problem: Tailwind styles not applying**
```
Solution:
1. Verify tailwind.config.ts content array:
   content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}']
2. Check file extensions are included
3. Run: npm run dev (not build)
4. Clear browser cache (Ctrl+Shift+Delete)
```

**Problem: Dark mode not working**
```
Checklist:
1. Verify globals.css has dark: selector
2. Check html has class="dark" when dark mode active
3. Verify colors use var(--primary-*) syntax
4. Test in incognito window (clear cache)
```

**Problem: Theme not persisting after refresh**
```
Check localStorage:
1. Open DevTools Console
2. localStorage.getItem('theme')
3. Should show 'light', 'dark', or 'auto'
4. If empty, check lib/theme.tsx useEffect hook
```

### Component Issues

**Problem: Button component not responsive**
```
Check:
1. Verify className is applied
2. Check if global styles loaded
3. Inspect element in DevTools
4. Verify Tailwind classes syntax
```

**Problem: Link component showing error**
```
Error: "Invalid <a> inside <Link>"
Solution:
- Remove <a> tag, use <Link> directly
- Next.js 13+ doesn't support nested anchors

// ❌ Wrong
<Link href="/"><a>Home</a></Link>

// ✅ Correct
<Link href="/">Home</Link>
```

**Problem: State not updating in components**
```
Debug:
1. Add console.log in useEffect
2. Verify state setter called
3. Check useCallback dependencies
4. Use React DevTools Profiler
```

### API/Network Issues

**Problem: API calls return 404**
```
Checklist:
1. Verify NEXT_PUBLIC_API_URL in .env.local
2. Check backend server running (localhost:3001)
3. Verify endpoint path correct
4. Check request method (GET, POST, etc.)
```

**Problem: CORS errors in console**
```
Error: "Access to XMLHttpRequest blocked by CORS policy"
Solution (server/server.js):
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**Problem: Authentication token not persisting**
```
Check:
1. Token stored in localStorage: localStorage.getItem('token')
2. Token included in requests: Check Network tab > Request Headers
3. Verify Authorization header format: "Bearer <token>"
4. Check JWT expiry: jwt.io to decode token
```

### Performance Issues

**Problem: Page loads slowly**
```
Steps:
1. Open DevTools Network tab
2. Check which files are large
3. Run: npm run build
4. Analyze bundle: ANALYZE=true npm run build
5. Check images optimized
```

**Problem: Build takes very long**
```
Solution:
1. Check if large files being processed
2. Verify .next folder deleted
3. Check disk space available
4. Try: npm run build --no-lint (skip linting temporarily)
```

---

## 🗄️ Database Issues

### Connection Problems

**Problem: "Connection refused" error**
```
PostgreSQL not running:

# macOS
brew services start postgresql

# Windows
# Start PostgreSQL Service in Services app

# Linux
sudo systemctl start postgresql
```

**Problem: "Unknown database" error**
```
Database doesn't exist:

# Create it
createdb erp_shop

# Or with psql
psql -U postgres -c "CREATE DATABASE erp_shop;"
```

**Problem: "Password authentication failed"**
```
Wrong credentials:

# Reset password
psql -U postgres
\password postgres
# Enter new password
```

**Problem: Cannot connect to remote database**
```
Check:
1. Verify host/port correct in DATABASE_URL
2. Check firewall allows connection
3. Verify database server running
4. Test connection: psql <connection-string>
```

### Data Issues

**Problem: Migrations not running**
```
With Prisma:
npx prisma migrate dev
npx prisma migrate reset (WARNING: deletes all data)

Check:
1. DATABASE_URL set correctly
2. PostgreSQL running
3. Prisma schema valid
```

**Problem: Seeding data not working**
```
Create seed script (prisma/seed.js):
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Your seed data
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

Run: npx prisma db seed
```

---

## 🔐 Authentication Issues

**Problem: Login always fails**
```
Debug:
1. Check credentials in demo (username/password)
2. Verify backend API running
3. Check Network tab for API response
4. Verify JWT_SECRET set in .env
```

**Problem: Session expires immediately**
```
Check:
1. JWT token expiry time
2. localStorage clearing on page refresh
3. Token validation logic
4. Cookie settings (if using cookies)
```

**Problem: Can't logout**
```
Check:
1. Verify logout endpoint exists
2. Check localStorage cleared
3. Verify state reset
4. Check redirect after logout
```

---

## 🚀 Deployment Issues

### Vercel

**Problem: Build fails on Vercel**
```
Check:
1. Environment variables set in Vercel dashboard
2. Verify build command: npm run build
3. Check output directory: .next
4. Review build logs: Vercel Dashboard > Deployments
```

**Problem: API calls fail after deployment**
```
Solution:
1. Update NEXT_PUBLIC_API_URL to production API
2. Set in Vercel Environment Variables
3. Redeploy with new variables
```

**Problem: 404 errors on routes**
```
Issue: Vercel routing misconfigured
Solution: Ensure vercel.json has:
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Railway

**Problem: Backend deployment fails**
```
Check:
1. Start command correct: npm start
2. Verify package.json has start script
3. Check .env variables set
4. Review logs: Railway Dashboard
```

**Problem: Database connection fails in production**
```
Solution:
1. Add DATABASE_URL to Railway environment
2. Use railway-provided connection string
3. Run migrations: npx prisma migrate deploy
```

---

## 📊 Performance Debugging

### Frontend Profiling

```javascript
// Add to component to measure render time
import { useEffect, useRef } from 'react';

export default function MyComponent() {
  const startTime = useRef(Date.now());
  
  useEffect(() => {
    console.log('Render time:', Date.now() - startTime.current, 'ms');
  }, []);
  
  return <div>Component</div>;
}
```

### API Performance

```javascript
// Measure API response time
const start = Date.now();
const response = await api.get('/endpoint');
console.log('API time:', Date.now() - start, 'ms');
```

---

## 🆘 Getting Help

### Debug Information to Collect

When asking for help, provide:
1. Error message (full text)
2. Steps to reproduce
3. Expected vs actual behavior
4. Browser/Node version
5. Environment (.env variables if relevant)
6. Recent changes made

### Useful DevTools

**Browser DevTools (F12):**
- Console tab - error messages
- Network tab - API calls
- Application tab - localStorage/cookies
- Performance tab - load time

**VS Code:**
- Debug console
- Breakpoints
- Watch expressions
- Call stack

**Terminal:**
```bash
# Check logs
npm run dev 2>&1 | tee debug.log

# Verbose output
npm run dev --verbose
```

---

## 📚 Additional Resources

**When you get stuck:**
- GitHub Issues: Check existing issues first
- Stack Overflow: Tag with `next.js` or `express`
- ChatGPT: Paste error message (remove sensitive data)
- Official Docs:
  - Next.js: https://nextjs.org/docs
  - React: https://react.dev
  - PostgreSQL: https://www.postgresql.org/docs
  - Express: https://expressjs.com

**Common quick fixes:**
```bash
# The "have you tried turning it off and on again"
rm -rf .next node_modules
npm install
npm run dev

# Clear all cache
npm cache clean --force
rm -rf .next
```

---

**Remember: Most issues are solvable with Google, patience, and coffee ☕**
