# ERP-SHOP Master Task List & Roadmap

This document serves as the central blueprint for the ERP-SHOP project, synthesizing requirements from `project.md`, `MASTER_CHECKLIST.md`, and `future.md`.

## ✅ Phase 1: Foundation & Architecture (Completed)
- [x] **Project Setup**
    - [x] Next.js 14 + TypeScript + Tailwind CSS
    - [x] Directory structure (client/server separation)
    - [x] Configuration (.env, package.json, tsconfig)
- [x] **Design System**
    - [x] Dynamic Theme System (Light/Dark/Auto)
    - [x] Theme persistence (localStorage)
    - [x] Core UI Components (Button, Card, Input, Badge, Alert)
    - [x] 100+ Design Tokens
- [x] **Core Infrastructure**
    - [x] Zustand State Management
    - [x] Axios API Client
    - [x] Express.js Backend with SQLite (better-sqlite3)
    - [x] Mock Authentication Flow (JWT)
- [x] **Documentation**
    - [x] Comprehensive README & Guides
    - [x] AI Agent Guide
- [x] **Initial Data Connection**
    - [x] Connect Dashboard to Real Data (SQLite)
    - [x] Enhance Product Schema and Form
    - [x] Add Brand, Model, Specs, Warranty fields
    - [x] Update Product Form UI
    - [x] Update Product Service and Actions
    - [x] Connect Products to Real Data
    - [x] Connect Customers/Sales to Real Data
    - [x] Implement Basic Server Actions

## 🚧 Phase 2: Core Modules & Data Integrity (Current Focus)
- [ ] **Inventory Management (Priority)**
    - [x] Implement `StockQuant` model updates
    - [x] Stock adjustment functionality (In/Out)
    - [x] Real-time stock calculation triggers
    - [x] Low stock alerts logic
- [x] **Product Management Enhancements**
    - [x] Product Delete Functionality
    - [x] Bulk Product Operations (Delete, Update)
    - [x] Advanced Product Filtering & Search
    - [x] Image Upload Handling (Multer/UploadThing)
    - [x] **Code Audit & Quality Check**
    - [x] Review previous steps for errors <!-- id: 9 -->
    - [x] Fix type safety issues (Order/Product types) <!-- id: 10 -->
    - [x] Fix lint errors (unused vars, any types) <!-- id: 11 -->
    - [x] Verify build success <!-- id: 12 -->
    - [x] **Industry Suitability Audit**
        - [x] Tech/PC: Verified `attributes` for specs, `tracking` for serials.
        - [x] Clothing: Verified `variants` for size/color.
- [x] **Sales & Orders (POS Foundation)**
    - [x] Order Creation Logic (Backend)
    - [x] "New Order" / POS Interface (Frontend)
    - [x] Order Status Workflow (Pending -> Paid -> Shipped)
    - [x] Order History & Details View
    - [x] Invoice Generation (PDF)
- [x] **Authentication Consolidation**
    - [x] Migrate Users from Mock Array to SQLite Database
    - [x] Implement Registration Flow
    - [x] Update NextAuth to use local DB(RBAC) Middleware

## 🏢 Phase 3: Enterprise ERP Modules (ERPNext Parity)
*Goal: Match and exceed ERPNext functionality with a modern tech stack.*

### 3.1 Financial Management Module
- [ ] **Accounting Core**
    - [ ] Chart of Accounts (Tree View)
    - [ ] Journal Entries & General Ledger
    - [ ] Multi-Currency Support (Real-time rates)
    - [ ] Fiscal Years & Period Closing
- [ ] **Receivables & Payables**
    - [ ] Sales Invoices & Payment Entries
    - [ ] Purchase Invoices & Payment Requests
    - [ ] Aging Reports (AR/AP)
    - [ ] Dunning Management
- [ ] **Banking & Tax**
    - [ ] Bank Reconciliation Tool
    - [ ] Tax Rules & Templates (Regional)
    - [ ] Payment Gateway Integration (Stripe/PayPal)
- [ ] **Financial Reporting**
    - [ ] Balance Sheet, P&L, Cash Flow
    - [ ] Cost Centers & Budgeting
    - [ ] Asset Management (Depreciation Schedules)

### 3.2 Supply Chain Management (SCM)
- [ ] **Advanced Inventory**
    - [ ] Multi-Warehouse Management (Zones/Bins)
    - [ ] Serial No. & Batch Tracking
    - [ ] Barcode/QR Code Scanning (Mobile Support)
    - [ ] Stock Valuation (FIFO/Moving Average)
- [ ] **Procurement**
    - [ ] Supplier Portal
    - [ ] Request for Quotation (RFQ)
    - [ ] Purchase Orders & Receipts
    - [ ] Quality Inspections on Receipt
- [ ] **Logistics**
    - [ ] Shipment Tracking
    - [ ] Delivery Trips & Driver Management
    - [ ] Landed Cost Vouchers

### 3.3 Customer Relationship Management (CRM)
- [ ] **Sales Pipeline**
    - [ ] Lead Management & Scoring
    - [ ] Opportunity Tracking (Kanban View)
    - [ ] Customer 360 View (History, Notes, Issues)
- [ ] **Communication**
    - [ ] Email Integration (Inbox/Sent)
    - [ ] Activity Logging (Calls, Meetings)
    - [ ] Newsletter & Campaign Management
- [ ] **Support**
    - [ ] Help Desk / Ticketing System
    - [ ] Knowledge Base
    - [ ] Service Level Agreements (SLA)

### 3.4 Human Capital Management (HCM)
- [ ] **Employee Lifecycle**
    - [ ] Employee Database & Profiles
    - [ ] Onboarding/Offboarding Workflows
    - [ ] Department & Designation Tree
- [ ] **Operations**
    - [ ] Attendance Tracking (Check-in/out)
    - [ ] Leave Management (Applications/Approvals)
    - [ ] Shift Management
- [ ] **Payroll**
    - [ ] Salary Structures & Components
    - [ ] Payroll Processing & Slips
    - [ ] Expense Claims

### 3.5 Manufacturing Execution System (MES)
- [ ] **Production Planning**
    - [ ] Bill of Materials (BOM) - Multi-level
    - [ ] Work Stations & Operations
    - [ ] Production Orders
- [ ] **Execution**
    - [ ] Job Cards & Time Logs
    - [ ] Material Requests for Production
    - [ ] Scrap & Waste Management
    - [ ] Capacity Planning

### 3.6 Project Portfolio Management (PPM)
- [ ] **Project Management**
    - [ ] Projects & Tasks (Gantt/Kanban)
    - [ ] Time Tracking & Timesheets
    - [ ] Project Costing & Profitability
- [ ] **Collaboration**
    - [ ] Team Chat / Discussions
    - [ ] File Sharing & Document Management

### 3.7 Digital Commerce & Web Presence
- [ ] **Online Store**
    - [ ] Product Catalog & Search
    - [ ] Shopping Cart & Checkout
    - [ ] Customer Portal (Orders, Invoices, Issues)
- [ ] **Content Management**
    - [ ] Blog & Pages
    - [ ] Web Forms

## 🎨 Phase 4: Advanced UI & Experience
- [ ] **Advanced Components**
    - [ ] **DataTable**: Sorting, Pagination, Filtering, Row Selection, Export
    - [ ] **Forms**: Select with Search, DatePicker, FileUpload, RichText Editor
    - [ ] **Overlays**: Dialog/Modal System, Slide-over Panels, Command Palette (Ctrl+K)
- [ ] **Dashboard Enhancements**
    - [ ] Interactive Charts (Recharts) for Sales/Revenue/Inventory
    - [ ] Draggable/Resizable Widgets
    - [ ] Global Date Range Pickers
- [ ] **UX Polish**
    - [ ] Skeleton Loading States
    - [ ] Toast Notifications (Success/Error feedback)
    - [ ] Keyboard Shortcuts (Global)
    - [ ] Breadcrumb Navigation

## 🚀 Phase 5: Production Readiness & Scale
- [ ] **Security Hardening**
    - [ ] Rate Limiting (Redis)
    - [ ] Input Validation (Zod everywhere)
    - [ ] Security Headers (Helmet)
    - [ ] Audit Logging (Middleware)
- [ ] **Performance Optimization**
    - [ ] Image Optimization (next/image)
    - [ ] Database Indexing & Query Optimization
    - [ ] Caching Strategy (Redis/In-memory)
- [ ] **Testing**
    - [ ] Unit Tests (Jest/Vitest)
    - [ ] E2E Tests (Playwright/Cypress)
- [ ] **Deployment**
    - [ ] Docker Containerization
    - [ ] CI/CD Pipeline (GitHub Actions)

## 🔮 Phase 6: Future Innovation
*Derived from `future.md`*
- [ ] **AI Integration**
    - [ ] Demand Forecasting (ML)
    - [ ] Smart Inventory Recommendations
    - [ ] Natural Language Search / Chat with Data
- [ ] **Omnichannel**
    - [ ] E-commerce Integration (Shopify/WooCommerce Sync)
    - [ ] Mobile App (React Native)
- [ ] **Advanced Tech**
    - [ ] Real-time Collaboration (WebSockets)
    - [ ] Blockchain Supply Chain Tracking (Optional)
    - [ ] Voice Commands for POS

---
**Current Status**: Completed Phase 2. Starting Phase 3 (ERPNext Parity).
**Immediate Next Step**: Begin Phase 3.1 - Financial Management (Accounting Core).
