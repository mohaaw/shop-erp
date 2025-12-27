PROJECT CONTEXT: ERP-SHOP
Role: Senior Full-Stack Architect
Target: Next.js 14, SQLite, Shadcn UI, TypeScript
Architecture Overview
This is a Monorepo ERP system.

/client: Next.js 14 App Router (Frontend)
/server: Express.js + Prisma (Backend)
Database: SQLite (better-sqlite3)
Known Issues & Constraints (CRITICAL)
BUILD ERROR: The build fails because better-sqlite3 (native module) is being bundled in the Next.js client.
FIX: Ensure NO client-side component imports @prisma/client or server-side libs directly. Use Server Actions or API calls.
THEME CONFLICT: Three different theme systems exist.
FIX: Delete lib/theme.tsx and lib/themeSystem.ts. Use ONLY components/theme-provider.tsx (next-themes).
Design Standards
UI Framework: Shadcn/Radix UI (located in components/ui/)
State: Zustand
Styling: Tailwind CSS
Icons: Lucide React
No any types allowed.
Goal: "Ultimate Enterprise" Upgrade
Implement the remaining features from Batch 16 with zero friction.

🚀 MISSION COMMANDS (Paste these one by one into Antigravity)
Command 1: Fix the Build & Database Boundary
Copy/Paste this into Antigravity Chat:

"Analyze the codebase to identify why better-sqlite3 is causing build failures. Check all files in /client/app for direct imports of @prisma/client or database utilities. Refactor any client components to use Server Actions (in actions/) or API calls to the Express server (/server). Ensure the database is accessed ONLY on the server side."

Command 2: Clean up Theme System
Copy/Paste this into Antigravity Chat:

"Unify the theme system. 1. Delete files lib/theme.tsx and lib/themeSystem.ts. 2. Update components/UserMenu.tsx and any other components using the old theme logic to strictly use useTheme from next-themes (imported from components/theme-provider.tsx). 3. Verify the theme persists on reload and flickering is gone."

Command 3: Implement Kanban Board (Drag & Drop)
Copy/Paste this into Antigravity Chat:

"Create a reusable Kanban Board component. 1. Install @dnd-kit/core and @dnd-kit/sortable and @dnd-kit/utilities. 2. Create components/kanban/kanban-board.tsx. 3. Create a page at /client/app/[locale]/dashboard/crm/opportunities/page.tsx that uses this board to manage CRM opportunities (Lead, Qualified, Won, Lost). 4. Implement optimistic updates using Zustand or React Query so dragging a card updates the UI instantly before the DB saves."

Command 4: Implement Global Calendar
Copy/Paste this into Antigravity Chat:

"Create a Global Calendar module. 1. Install react-big-calendar and date-fns. 2. Create components/calendar/global-calendar.tsx. 3. Fetch events from the server (Leave, Tasks, Deadlines) and display them on the calendar. 4. Enable 'Drag-and-Drop' to reschedule events. 5. Style it to match our Tailwind dark/light theme."

Command 5: Add Two-Factor Authentication (2FA)
Copy/Paste this into Antigravity Chat:

"Add Two-Factor Authentication (2FA) to the User Profile settings. 1. Install qrcode.react. 2. Create a UI flow in /client/app/[locale]/dashboard/settings/profile to enable 2FA: generate a QR code, input the verification code, and display backup codes. 3. Update the backend login logic to check for the TOTP code."

Command 6: Audit Log & Diff Viewer
Copy/Paste this into Antigravity Chat:

"Enhance the Audit Log system. 1. Install react-diff-viewer-continued. 2. In /client/app/[locale]/dashboard/settings/audit, create a detailed view that shows user actions. 3. When a record is updated (e.g., Product Price), show a 'Diff' modal comparing the old value vs the new value."

Command 7: System Health Monitor
Copy/Paste this into Antigravity Chat:

"Create a System Health Monitor page. 1. Use the existing WebSocket connection in server.js. 2. Create /client/app/[locale]/dashboard/monitor/page.tsx. 3. Display real-time CPU and RAM usage charts using recharts. 4. Show a live status indicator (Green/Red) for the Database connection."