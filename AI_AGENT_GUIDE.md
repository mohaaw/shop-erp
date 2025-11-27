# 🤖 AI Agent Guide - Shop ERP Vue

This document is designed to provide an AI agent with a complete understanding of the **Shop ERP Vue** project, its architecture, current state, known issues, and how to work with it.

---

## 1. 📋 Project Overview

**Shop ERP Vue** is a comprehensive Enterprise Resource Planning (ERP) system for managing shop operations.
*   **Frontend**: Vue 3 (Composition API), Vite, Pinia, Vue Router, Tailwind CSS (custom config).
*   **Backend**: Node.js with Express (currently using **mock data** in memory).
*   **Authentication**: JWT-based (mock implementation).

### Key Features
*   **Dashboard**: Real-time analytics, sales summary, inventory status.
*   **POS (Point of Sale)**: Cart functionality, checkout, receipt generation.
*   **Management**: Products, Customers, Sales, Inventory.
*   **Reporting**: Sales reports, stock movement.

---

## 2. 🏗️ Architecture & Structure

### Directory Structure
```
shop-erp-vue/
├── server/                    # Backend API Server (Node.js/Express)
│   ├── server.js             # Main Express application (contains MOCK DATA)
│   ├── package.json          # Backend dependencies
│   └── .env                  # Environment variables (PORT, JWT_SECRET)
├── client/                    # Frontend Application (Vue 3)
│   ├── src/                  # Source code
│   │   ├── components/       # Vue components (atomic designish)
│   │   ├── pages/            # Page components (routed views)
│   │   ├── stores/           # Pinia state management (business logic here)
│   │   ├── services/         # API services (Axios wrapper)
│   │   └── router/           # Vue Router configuration
│   ├── vite.config.js        # Vite build config (includes proxy)
│   └── .env                  # Environment variables (VITE_API_BASE_URL)
└── AI_AGENT_GUIDE.md         # This file
```

### State Management (Pinia)
*   **userStore**: Auth state, login/register logic.
*   **productStore**: Product data, stock levels.
*   **cartStore**: POS cart management.
*   **salesStore**: Sales history, revenue calculations.
*   **settingsStore**: App preferences, theme.

### Backend (Mock)
*   The backend (`server/server.js`) uses in-memory arrays (`MOCK_USERS`, etc.) to simulate a database.
*   **Restarting the server resets the data.**
*   Authentication is real JWT but against mock users.

---

## 3. 🚀 Setup & Execution

### Prerequisites
*   **Node.js**: v20.x LTS or v22.x LTS or v24.x (⚠️ **Do not use v25+** - has compatibility issues with Vite/Rollup)
*   **npm**: 10.x or higher

> [!IMPORTANT]
> **Node.js v25+ Compatibility Issue**  
> Node.js v25.2.1 and newer versions cause Vite/Rollup to fail with `SyntaxError: Unexpected token '{'`.  
> Always use LTS versions (v20, v22, or v24) for stable development.

### Running the Application
You need **two terminal instances**.

**Terminal 1: Backend**
```bash
cd server
npm install
npm run dev
# Runs on http://localhost:3001
```

**Terminal 2: Frontend**
```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

### Credentials (Mock)
*   **Admin**: `admin@example.com` / `password123`
*   **Staff**: `staff@example.com` / `password123`

---

## 4. ✨ Recent Improvements (2025-11-27)

### Code Quality ✅
*   **ESLint Status**: 0 errors, 0 warnings (all 20+ errors fixed)
*   **Cleaned Files**: 12 Vue components updated
*   **Removed**:
    - 20+ unused variables and parameters
    - 8 empty CSS rulesets
    - Unused imports (`onUnmounted`, `computed`, `watch`, `ref`)
*   **Fixed**: Corrupted `ProductDetailModal.vue` file

### Node.js Compatibility ✅
*   **Resolved**: Node.js v25.2.1 breaking Vite/Rollup
*   **Current Version**: Node.js v24.11.1
*   **Dependencies**: 310 packages, 0 vulnerabilities
*   **Dev Server**: Running successfully on http://localhost:5174/

---

## 5. 🐛 Known Issues & Roadmap

### Critical Issues
1.  **Data Persistence**: Backend data is lost on restart (Mock DB).
2.  **Stock Value Calculation**: Currently uses selling price, should use cost price.
3.  **Performance**: Large datasets (products/sales) are not paginated.
4.  **Form Validation**: Some forms (Customer) have weak validation regex.

### UI/UX Improvements Needed
1.  **Empty States**: Missing visual feedback for empty tables/lists.
2.  **Loading States**: Skeleton loaders missing in Dashboard.
3.  **Accessibility**: Color contrast in dark mode needs review.
4.  **Responsive Design**: Dashboard columns on tablet size need adjustment.

### Missing Features
1.  **Backend DB**: Integration with MongoDB or PostgreSQL.
2.  **Bulk Operations**: Delete/Edit multiple items.
3.  **Advanced Reporting**: Export to PDF, email reports.
4.  **Tax Calculation**: No tax logic in POS.

---

## 6. 🛠️ Troubleshooting

### "Failed to Fetch" / 404 Login Error ✅ FIXED
*   **Cause**: Frontend cannot reach backend.
*   **Fix**:
    1.  Ensure `server` is running on port 3001.
    2.  Check `client/.env` has `VITE_API_BASE_URL=http://localhost:3001/api`.
    3.  Check `client/vite.config.js` has proxy configured for `/api`.

### CORS Errors
*   **Cause**: Backend not allowing frontend origin.
*   **Fix**: Check `server/server.js` CORS configuration. It should allow `http://localhost:5173`.

### Node.js v25+ Compatibility Error ✅ FIXED
*   **Error**: `SyntaxError: Unexpected token '{'` in Rollup
*   **Cause**: Node.js v25+ has breaking changes incompatible with current Vite/Rollup
*   **Fix**:
    1.  Downgrade to Node.js LTS (v20, v22, or v24)
    2.  Delete `node_modules` and `package-lock.json`
    3.  Run `npm install`
    4.  Restart dev server

### ESLint Errors ✅ FIXED
*   **Status**: All lint errors have been resolved
*   **Run linter**: `cd client && npm run lint:eslint`
*   **Expected result**: 0 errors, 0 warnings

---

## 7. 🔄 Development Workflow

1.  **Modify**: Edit files in `client/src` or `server/server.js`.
2.  **Test**:
    *   Frontend hot-reloads automatically.
    *   **Backend must be restarted** manually for changes to take effect (`Ctrl+C` -> `npm run dev`).
3.  **Lint**: Run `npm run lint:eslint` in `client` directory to check for code style issues.
    *   **Current Status**: ✅ 0 errors, 0 warnings
4.  **Build**: Run `npm run build` in `client` to create production bundle.

---
**End of Guide**
