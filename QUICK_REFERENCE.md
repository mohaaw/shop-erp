# ERP-SHOP Quick Reference Card

**Keep this handy during development.**

---

## 🚀 Essential Commands

```bash
# Start development
npm install && npm run dev

# After pulling code
npm install
npm run dev

# Before committing
npm run lint
npm run build

# Database (if needed)
npm run db:migrate
npm run db:seed
```

---

## 📁 Key Files & Folders

```
client/
├── app/                    # Pages (Next.js routing)
├── components/ui/          # Reusable UI components
├── lib/theme.tsx           # Theme system
├── lib/api.ts              # API client
├── store/                  # Zustand stores
└── types/                  # TypeScript definitions

server/
├── server.js               # Express app
├── .env                    # Environment variables
└── README.md               # Backend docs
```

---

## 🔗 Documentation Links

| Need | Doc | Time |
|------|-----|------|
| Get running | QUICK_START.md | 5 min |
| Understand structure | FILE_STRUCTURE.md | 10 min |
| See components | INDEX.md | 10 min |
| Build features | PHASE2_GUIDE.md | 20 min |
| Team workflows | TEAM_COLLABORATION.md | 15 min |
| Deploy app | DEPLOYMENT.md | 20 min |
| Fix errors | TROUBLESHOOTING.md | 15 min |
| GitHub setup | GITHUB_SETUP.md | 10 min |
| Full launch | MASTER_CHECKLIST.md | 30 min |

---

## 🎨 Component Imports

```typescript
// UI Components
import { Button, Card, Input, Badge, Alert } from '@/components/ui'

// Theme
import { useTheme } from '@/lib/theme'

// API
import { api } from '@/lib/api'

// Store
import { useAuthStore } from '@/store/auth'
import { useProductStore } from '@/store/products'

// Types
import type { User, Product, Order } from '@/types'
```

---

## 🎨 Color System

```typescript
// Primary colors
bg-primary-50 to bg-primary-900
text-primary-600
border-primary-200

// Also available
secondary, success, warning, error, info
```

---

## 📝 API Patterns

```typescript
// GET
const data = await api.get('/products')

// POST
const created = await api.post('/products', { name: '...' })

// PUT
const updated = await api.put('/products/1', { name: '...' })

// DELETE
await api.delete('/products/1')

// Error handling
try {
  const data = await api.get('/endpoint')
} catch (error) {
  console.error(error)
}
```

---

## 🔄 State Management Pattern

```typescript
// In store/example.ts
import { create } from 'zustand'

export const useExampleStore = create((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  }))
}))

// In component
import { useExampleStore } from '@/store/example'

function MyComponent() {
  const items = useExampleStore(state => state.items)
  const addItem = useExampleStore(state => state.addItem)
  
  return <div>{/* ... */}</div>
}
```

---

## 📱 Responsive Breakpoints

```css
/* sm: 640px */
sm:text-sm

/* md: 768px */
md:grid-cols-2

/* lg: 1024px */
lg:grid-cols-3

/* xl: 1280px */
xl:grid-cols-4

/* 2xl: 1536px */
2xl:grid-cols-5
```

---

## 🔐 Authentication

```typescript
// Login demo credentials
Username: admin@erp.com
Password: admin123

// Check auth store
import { useAuthStore } from '@/store/auth'
const user = useAuthStore(state => state.user)
const token = useAuthStore(state => state.token)
```

---

## 🗄️ Database Connection

```
PostgreSQL://user:password@localhost:5432/erp_shop
```

**If connection fails:**
1. Check PostgreSQL running: `brew services start postgresql`
2. Verify database exists: `createdb erp_shop`
3. Check credentials in .env

---

## ✅ Before Creating PR

- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Test in browser works
- [ ] No console.log left
- [ ] No hardcoded values
- [ ] Tests added/updated
- [ ] Comments added for complex code
- [ ] Commit message meaningful

---

## 🐛 Common Issues Quick Fix

| Problem | Fix |
|---------|-----|
| Styles not working | Clear .next: `rm -rf .next` then restart |
| Module not found | Check import path and restart TS server |
| Port in use | Kill process: `lsof -i :3000` then `kill -9 <PID>` |
| API call 404 | Check backend running and endpoint correct |
| Dark mode broken | Check globals.css has dark: selector |
| Types error | Run: `npm run build` then restart VSCode |

---

## 📞 Quick Support

```
Stuck? Check order:
1. TROUBLESHOOTING.md (most issues covered)
2. QUICK_START.md (setup issues)
3. FILE_STRUCTURE.md (finding things)
4. Ask team on Slack/Discord
5. Create GitHub issue
```

---

## 🎯 Current Phase

```
Phase 1: ████████████████████ ✅ COMPLETE
Phase 2: ░░░░░░░░░░░░░░░░░░░░ ⏳ NEXT
Phase 3: ░░░░░░░░░░░░░░░░░░░░ Coming
Phase 4: ░░░░░░░░░░░░░░░░░░░░ Coming
```

**What to do now:**
1. Sync to GitHub (GITHUB_SETUP.md)
2. Start Phase 2 (PHASE2_GUIDE.md)

---

## 🌍 URLs

```
Local Frontend:     http://localhost:3000
Local Backend:      http://localhost:3001
Staging Frontend:   (set up in DEPLOYMENT.md)
Production Frontend: (set up in DEPLOYMENT.md)
```

---

## 📊 Tech Stack At-A-Glance

```
Frontend:  Next.js 14 + React 19 + TypeScript 5
Styling:   Tailwind CSS 3 + CSS Variables
State:     Zustand
HTTP:      Axios
Database:  PostgreSQL 15
Backend:   Express.js + Node.js 18
```

---

## 🚨 CRITICAL Reminders

- ⚠️ **Never commit .env with secrets**
- ⚠️ **Never console.log in production code**
- ⚠️ **Always validate user input**
- ⚠️ **Always handle API errors**
- ⚠️ **Always test before pushing**

---

## 🎓 30-Second Reminders

**Theme System:**
- Light/Dark/Auto modes
- Uses CSS variables
- Persists to localStorage
- Switch with `useTheme()` hook

**API Client:**
- Axios with JWT auth
- Auto adds Authorization header
- Handles 401 token refresh
- Use `api.get/post/put/delete()`

**Components:**
- Located in `components/ui/`
- TypeScript typed
- Tailwind styled
- Reusable and tested

**State Management:**
- Zustand stores in `store/`
- Use `useStore()` in components
- Subscribe to specific properties
- Persists to localStorage (auth/products)

---

**Print this page and keep at your desk! 📌**

**Last Updated:** Phase 1 Complete | **Next Update:** Phase 2 Start
