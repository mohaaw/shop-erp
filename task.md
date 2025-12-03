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
- [ ] **Product Management Enhancements**
    - [x] Product Delete Functionality
    - [x] Bulk Product Operations (Delete, Update)
    - [x] Advanced Product Filtering & Search
    - [x] Image Upload Handling (Multer/UploadThing)
- [ ] **Sales & Orders (POS Foundation)**
    - [x] Order Creation Logic (Backend)
    - [x] "New Order" / POS Interface (Frontend)
    - [x] Order Status Workflow (Pending -> Paid -> Shipped)
    - [ ] Invoice Generation (PDF)
- [ ] **Authentication Consolidation**
    - [ ] Migrate Users from Mock Array to SQLite Database
    - [ ] Implement Registration Flow
    - [ ] Role-Based Access Control (RBAC) Middleware

## 📋 Phase 3: Advanced UI & Experience
- [ ] **Advanced Components**
    - [ ] **DataTable**: Sorting, Pagination, Filtering, Row Selection
    - [ ] **Forms**: Select with Search, DatePicker, FileUpload, RichText Editor
    - [ ] **Overlays**: Dialog/Modal System, Slide-over Panels
- [ ] **Dashboard Enhancements**
    - [ ] Interactive Charts (Recharts) for Sales/Revenue
    - [ ] Draggable Widgets
    - [ ] Date Range Pickers for Stats
- [ ] **UX Polish**
    - [ ] Skeleton Loading States
    - [ ] Toast Notifications (Success/Error feedback)
    - [ ] Keyboard Shortcuts
    - [ ] Breadcrumb Navigation

## 💼 Phase 4: Business Logic Expansion
- [ ] **Customer Relationship Management (CRM)**
    - [ ] Customer Profiles with Order History
    - [ ] Customer Notes & Interaction Logs
    - [ ] Loyalty Points System
- [ ] **Financial Module**
    - [ ] Expense Tracking
    - [ ] Profit/Loss Calculation
    - [ ] Tax Management & Calculation
- [ ] **Supplier Management**
    - [ ] Supplier Directory
    - [ ] Purchase Orders (Restocking)
    - [ ] Supplier Performance Metrics

## 🚀 Phase 5: Production Readiness & Scale
- [ ] **Security Hardening**
    - [ ] Rate Limiting
    - [ ] Input Validation (Zod everywhere)
    - [ ] Security Headers (Helmet)
    - [ ] Audit Logging
- [ ] **Performance Optimization**
    - [ ] Image Optimization (next/image)
    - [ ] Database Indexing
    - [ ] Caching Strategy (Redis/In-memory)
- [ ] **Testing**
    - [ ] Unit Tests (Jest/Vitest)
    - [ ] E2E Tests (Playwright/Cypress)
- [ ] **Deployment**
    - [ ] Docker Containerization
    - [ ] CI/CD Pipeline (GitHub Actions)

## 🔮 Phase 6: God-Tier Vision (Long Term)
*Derived from `future.md`*
- [ ] **AI Integration**
    - [ ] Demand Forecasting (ML)
    - [ ] Smart Inventory Recommendations
    - [ ] Natural Language Search
- [ ] **Omnichannel**
    - [ ] E-commerce Integration (Shopify/WooCommerce Sync)
    - [ ] Mobile App (React Native)
- [ ] **Advanced Tech**
    - [ ] Real-time Collaboration (WebSockets)
    - [ ] Blockchain Supply Chain Tracking (Optional)
    - [ ] Voice Commands for POS

---
**Current Status**: Transitioning from Phase 1 to Phase 2.
**Immediate Next Step**: Implement Inventory Management (`StockQuant` updates).
