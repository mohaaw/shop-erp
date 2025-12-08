# Task List: ERP-SHOP UI Implementation

## Batch 0: Global Error Resolution (Completed)
- [x] Fix JSON syntax errors in `ar.json` and `en.json`.
- [x] Resolve runtime errors (e.g., `getLowStockProductsAction`).
- [x] Fix linting errors (replace `any` types, fix `useEffect` deps, etc.).
- [x] Verify production build.

## Batch 1: Core Entities (SCM & CRM)
- [x] **SCM: Suppliers**
    - [x] Create `client/app/[locale]/dashboard/scm/suppliers/page.tsx`
    - [x] Implement `SuppliersClient` component (already existed)
    - [x] Verify data fetching (`getSuppliersAction`)
- [x] **SCM: Purchase Orders**
    - [x] Create `client/app/[locale]/dashboard/scm/purchase-orders/page.tsx`
    - [x] Verify data fetching (`getPurchaseOrdersAction`)
- [x] **CRM: Customers**
    - [x] Create `client/app/[locale]/dashboard/crm/customers/page.tsx`
    - [x] Verify data fetching (`getCustomersAction`)
- [x] **CRM: Activities**
    - [x] Create `client/app/[locale]/dashboard/crm/activities/page.tsx`
    - [x] Verify data fetching (`getActivitiesAction`)
- [x] **CRM: Support Tickets**
    - [x] Create `client/app/[locale]/dashboard/crm/tickets/page.tsx`
    - [x] Verify data fetching (`getTicketsAction`)

## Batch 2: Operations (Inventory & Manufacturing)
- [x] **Inventory: Warehouses**
    - [x] Create `client/app/[locale]/dashboard/inventory/warehouses/page.tsx`
- [x] **Inventory: Stock Transfers**
    - [x] Create `client/app/[locale]/dashboard/inventory/stock-transfers/page.tsx`
- [x] **Inventory: Adjustments**
    - [x] Create `client/app/[locale]/dashboard/inventory/adjustments/page.tsx`
- [x] **Manufacturing: Workstations**
    - [x] Create `client/app/[locale]/dashboard/manufacturing/workstations/page.tsx`
- [x] **Manufacturing: Job Cards**
    - [x] Create `client/app/[locale]/dashboard/manufacturing/job-cards/page.tsx`

## Batch 3: HR & Projects
- [x] **HCM: Attendance**
    - [x] Create `client/app/[locale]/dashboard/hcm/attendance/page.tsx`
- [x] **HCM: Leave**
    - [x] Create `client/app/[locale]/dashboard/hcm/leave/page.tsx`
- [x] **HCM: Payroll**
    - [x] Create `client/app/[locale]/dashboard/hcm/payroll/page.tsx`
- [x] **Projects: Tasks**
    - [x] Create `client/app/[locale]/dashboard/projects/tasks/page.tsx`
- [x] **Projects: Timesheets**
    - [x] Create `client/app/[locale]/dashboard/projects/timesheets/page.tsx`

## Batch 4: Finance
- [x] **Finance: Payments**
    - [x] Create `client/app/[locale]/dashboard/finance/payments/page.tsx`
- [x] **Finance: Tax Rates**
    - [x] Create `client/app/[locale]/dashboard/finance/tax-rates/page.tsx`

## Batch 5: Forms & Functionality (Missing Pages)
- [x] **SCM Forms**
    - [x] `scm/suppliers/new/page.tsx`
    - [x] `scm/purchase-orders/new/page.tsx`
- [x] **CRM Forms**
    - [x] `crm/customers/new/page.tsx`
    - [x] `crm/activities/new/page.tsx`
    - [x] `crm/tickets/new/page.tsx`
- [x] **Inventory Forms**
    - [x] `inventory/warehouses/new/page.tsx`
    - [x] `inventory/stock-transfers/new/page.tsx`
    - [x] `inventory/adjustments/new/page.tsx`
- [x] **HCM Forms**
    - [x] `hcm/attendance/new/page.tsx`
    - [x] `hcm/leave/new/page.tsx`
    - [x] `hcm/payroll/new/page.tsx`
- [x] **Manufacturing Forms**
    - [x] `manufacturing/workstations/new/page.tsx`
    - [x] `manufacturing/job-cards/new/page.tsx`
- [x] **Projects Forms**
    - [x] `projects/tasks/new/page.tsx`
    - [x] `projects/timesheets/new/page.tsx`
- [x] **Finance Forms**
    - [x] `finance/payments/new/page.tsx`
    - [x] `finance/tax-rates/new/page.tsx`

## Batch 6: Ultimate Performance Optimization
- [x] **Parallel Data Fetching** (Completed for CRM, Inventory, Manufacturing, Projects, Finance)
- [x] **Instant Feedback (Loading States)**
    - [x] Create `loading.tsx` for all module roots
- [x] **Database Optimization**
    - [x] Verify WAL mode (Completed)
    - [x] Add indices for foreign keys (Existing indices verified)
- [x] **App Configuration**
    - [x] Optimize `next.config.js` (compression, caching headers)

## Batch 7: Dynamic Configuration
- [x] **Store Name Settings**
    - [x] Add `Settings` model to Prisma
    - [x] Create `settings-store` (Zustand)
    - [x] Update `Settings` page to persist data
    - [x] Update `Sidebar` to reflect store name dynamically

## Batch 8: Server Optimization (Maxed Out)
- [x] **Architecture Upgrade**
    - [x] Modularize `server.js` into routes and controllers
    - [x] Implement `helmet` for security
    - [x] Implement `compression` for performance
    - [x] Add `morgan` for logging
    - [x] Add rate limiting
- [x] **Database Integration**
    - [x] Ensure server uses shared `dev.db` (Verified)
    - [x] Add API endpoints for Settings

## Batch 9: Team Hub (Real-time)
- [x] **Database Schema**
    - [x] Add `Message`, `Announcement`, `Notification` models to Prisma
- [x] **Backend (Socket.io)**
    - [x] Install `socket.io`
    - [x] Initialize Socket.io in `server.js`
    - [x] Implement socket handlers for chat and notifications
    - [x] Add API endpoints for history/announcements
- [x] **Frontend (Client)**
    - [x] Install `socket.io-client`
    - [x] Create `SocketProvider`
    - [x] Create `TeamHub` page (`/dashboard/team`)
    - [x] Implement `Chat` component
    - [x] Implement `Announcements` component
    - [x] Add `NotificationCenter` to TopNav

## Batch 10: Comprehensive Upgrade
- [x] **Dashboard Overhaul**
    - [x] Install `recharts`
    - [x] Create `SalesChart` component
    - [x] Implement `getRecentOrders` action
    - [x] Wire up real data to Dashboard
- [x] **Navigation & UX**
    - [x] Install `cmdk` (if not present via shadcn)
    - [x] Create `CommandMenu` component
    - [x] Create `ThemeToggle` component
    - [x] Add `CommandMenu` and `ThemeToggle` to `TopNav`
- [x] **Final Polish**
    - [x] Verify `NotificationCenter` in `TopNav`
## Batch 11: Theme Center
- [x] **Database & State**
    - [x] Update `Settings` model in Prisma
    - [x] Update `settings-store.ts`
    - [x] Create `theme-generator.ts` utility
- [x] **Theme Logic**
    - [x] Create `ThemeManager` component
    - [x] Integrate `ThemeManager` into root layout
- [x] **UI Implementation**
    - [x] Create `ColorPicker` component
    - [x] Create `Appearance` settings page
    - [x] Implement Presets logic
- [x] **Verification**
    - [x] Verify color changes reflect instantly
    - [x] Verify persistence after reload
## Batch 12: Audit Fixes (Critical Gaps)
- [x] **Architectural Fixes**
    - [x] Create root `package.json` with `concurrently`
    - [x] Update `server/package.json` with Redis dependencies
    - [x] Update `HOW_TO_RUN.md` with correct instructions
- [x] **Data Flow Fixes (List Views)**
    - [x] Verify/Update `client/components/ui/data-table.tsx`
    - [x] Implement `Suppliers` List View (`columns.tsx`, `page.tsx`)
- [x] **Core Logic Fixes (Manufacturing)**
    - [x] Implement `BOM` Creation Page (`bom/new/page.tsx`)

## Verification
- [x] Verify `npm run build` passes
- [x] Verify `npm run lint` passes
- [x] Verify Translation Completeness (POS, TeamHub, Notifications)

## Batch 13: Missing List Views (Audit Fixes II)
- [x] **Fix Build Errors**
    - [x] Fix `BOMForm` button variant error
- [x] **Inventory: Stock Adjustments**
    - [x] Implement `getStockAdjustmentsAction`
    - [x] Implement `StockAdjustmentsClient` with `DataTable`
    - [x] Update `StockAdjustmentsPage` to fetch data
- [x] **Verification**
    - [x] Verify List Views exist for:
        - [x] CRM (Customers, Activities, Tickets)
        - [x] SCM (Suppliers, Purchase Orders)
        - [x] Inventory (Warehouses, Stock Transfers, Products)
        - [x] Manufacturing (Workstations, Job Cards, Production Orders, BOMs)
        - [x] HR (Employees, Attendance, Leave, Payroll)
        - [x] Projects (Tasks, Timesheets)
        - [x] Finance (Payments, Tax Rates)

## Batch 14: Profile Settings (Real Implementation)
- [x] **Database Schema**
    - [x] Add `avatar` and `bio` columns to `User` table
- [x] **Backend**
    - [x] Create `user-service.ts`
    - [x] Create `user-actions.ts` (`getCurrentUser`, `updateProfile`)
- [x] **Frontend**
    - [x] Create `ProfileForm` component
    - [x] Update `ProfileSettingsPage` to be dynamic
    - [x] Implement Avatar URL input
    - [x] Implement Avatar File Upload

## Batch 15: Translations Settings (Odoo-like)
- [x] **Backend**
    - [x] Rewrite `translation-service.ts` to use JSON files
    - [x] Update `translation-actions.ts`
- [x] **Frontend**
    - [x] Update `TranslationEditor` to show Source/Target columns
    - [x] Verify persistence to JSON files


## Batch 16: Ultimate Enterprise Dashboard Upgrade (The "Best in World" Plan)
- [x] **1. Advanced Analytics Dashboard**
    - [x] Draggable/Resizable Widget Grid (`react-grid-layout`)
    - [x] Real-time KPI Cards with Sparklines
    - [x] Customizable Date Ranges per Widget
- [x] **2. Global Command Palette (Enhanced)**
    - [x] Deep Search (Orders, Customers, Products, Settings)
    - [x] Quick Actions (e.g., "Create Invoice", "Add User")
    - [x] Recent History & Favorites
- [ ] **3. Role-Based Access Control (RBAC)**
    - [ ] Visual Permission Editor (Matrix View)
    - [ ] Custom Role Creation
    - [ ] Field-level Security Settings
- [ ] **4. Kanban Board View**
    - [ ] Drag-and-Drop Kanban for CRM Opportunities
    - [ ] Kanban for Project Tasks
    - [ ] Swimlanes by User/Status
- [ ] **5. Integrated Calendar System**
    - [ ] Unified Calendar (Leave, Tasks, Production)
    - [ ] Drag-and-Drop Rescheduling
    - [ ] iCal/Google Calendar Sync Integration
- [ ] **6. Notification Center 2.0**
    - [ ] Grouped Notifications
    - [ ] "Mark All Read" & Filtering
    - [ ] User Preferences (Email vs Push vs In-App)
- [ ] **7. Audit Log Viewer (Forensics)**
    - [ ] Detailed Timeline of User Actions
    - [ ] Diff Viewer for Record Changes
    - [ ] Export Logs to CSV/PDF
- [ ] **8. Data Import/Export Center**
    - [ ] Unified UI for Bulk Operations
    - [ ] Template Downloads
    - [ ] Validation Pre-check & Error Reporting
- [ ] **9. API Key Management**
    - [ ] Generate/Revoke API Keys
    - [ ] Scoped Permissions for Keys
    - [ ] Usage Analytics per Key
- [ ] **10. Webhook Configuration**
    - [ ] UI to Manage Webhooks
    - [ ] Event Triggers Selection
    - [ ] Delivery Logs & Retry Logic
- [ ] **11. System Health Monitoring**
    - [ ] Server Stats (CPU, RAM) via WebSocket
    - [ ] Database Connection Status
    - [ ] Error Rate Monitoring
- [ ] **12. User Presence & Status**
    - [ ] Online/Away/Busy Indicators
    - [ ] "Last Seen" Timestamps
    - [ ] Live Typing Indicators in Chat
- [ ] **13. Quick Notes / Scratchpad**
    - [ ] Persistent Per-User Notes (Sidebar/Floating)
    - [ ] Markdown Support
- [ ] **14. Favorites & Pinned Items**
    - [ ] Pin Pages to Sidebar
    - [ ] "My Workspace" Section
- [ ] **15. Dynamic Breadcrumbs**
    - [ ] Interactive Breadcrumb Trail
    - [ ] Dropdowns for Sibling Navigation
- [ ] **16. Keyboard Shortcuts Manager**
    - [ ] View All Shortcuts (Modal)
    - [ ] Custom Keybinding Editor
- [ ] **17. Onboarding & Tours**
    - [ ] Interactive Walkthrough for New Users (`driver.js`)
    - [ ] Feature Highlights
- [ ] **18. Session Management**
    - [ ] View Active Sessions (Device/IP)
    - [ ] Remote Logout Capability
- [ ] **19. Two-Factor Authentication (UI)**
    - [ ] QR Code Setup
    - [ ] Backup Codes Generation
- [ ] **20. Advanced Theme Customization**
    - [ ] Custom Accent Colors (Hex Picker)
    - [ ] Font Size/Density Settings
    - [ ] High Contrast Mode
- [ ] **21. File Manager**
    - [ ] Centralized Asset Library
    - [ ] Drag-and-Drop Uploads
    - [ ] Image Editor (Crop/Resize)
- [ ] **22. Report Builder**
    - [ ] Custom Report Generator
    - [ ] Schedule Reports via Email
