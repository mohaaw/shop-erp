# ERP-SHOP - Complete Retail ERP System

A comprehensive, modern Enterprise Resource Planning system for retail shops built with **Next.js 14**, **React**, **TypeScript**, **Tailwind CSS**, and inspired by **Nuxt UI** design principles.

## 📁 Project Structure

```
shop-erp/
├── server/              # Express.js backend API
│   ├── server.js
│   ├── package.json
│   └── README.md
├── client/              # Next.js frontend application
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── store/
│   ├── types/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── README.md
├── project.md           # Main project specification
├── suggestion.md        # Technology recommendations
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm**, **yarn**, or **pnpm**

### Backend Setup (Express)

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm run dev
```

Backend runs on: `http://localhost:3001`

### Frontend Setup (Next.js)

1. In a new terminal, navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` (copy from `.env.example`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

### Demo Credentials
- **Email**: `admin@example.com`
- **Password**: `password123`

## ✨ Features Implemented

### ✅ Core Infrastructure
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS with Nuxt UI-inspired design tokens
- Dynamic theme system (light/dark/auto)
- Theme persistence with localStorage
- Responsive mobile-first design
- Zustand state management

### ✅ User Interface
- **Button**: Multiple variants (primary, secondary, outline, ghost, danger, success)
- **Card**: With header, title, description, content, footer
- **Input**: With labels, error states, and validation
- **Badge**: Multiple color variants
- **Alert**: Dismissible alerts with variants
- **Navigation**: Sidebar with collapsible menu
- **Top Navigation**: Header with theme switcher and user menu

### ✅ Pages & Modules
- Home page with feature showcase
- Login page with demo credentials
- Dashboard with KPI cards and quick actions
- Placeholder pages for all modules:
  - Products Management
  - Inventory Tracking
  - Sales & Orders
  - Customer CRM
  - Point of Sale (POS)
  - Supplier Management
  - Employee Management
  - Finance & Accounting
  - Reports & Analytics
  - Settings & Administration

### ✅ Design System
- Nuxt UI-inspired aesthetics
- Consistent color palette
- Responsive typography
- Smooth animations and transitions
- Dark/Light theme support
- Accessible components (WCAG 2.1 AA)

### Product Management
- Add, edit, and delete products
- Product categories
- Stock level tracking
### ✅ Design System
- Nuxt UI-inspired aesthetics
- Consistent color palette
- Responsive typography
- Smooth animations and transitions
- Dark/Light theme support
- Accessible components (WCAG 2.1 AA)

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | Next.js 14 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 |
| **State Management** | Zustand |
| **UI Components** | Radix UI + Custom |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Authentication** | JWT + NextAuth ready |
| **Backend** | Express.js |
| **Database** | PostgreSQL (Prisma ready) |

## 📚 Comprehensive Module Features

### 1. Dashboard Module ✅
- Real-time KPIs (Sales, Orders, Revenue, Customers)
- Interactive charts and graphs
- Recent activity feed
- Quick action widgets
- Performance metrics
- Inventory alerts

### 2. Product Management 🔜
- Product catalog with grid/list view
- Product variants (size, color, SKU)
- Real-time inventory tracking
- Categories & tags
- Barcode/QR support
- Bulk import/export
- Product lifecycle management

### 3. Inventory Management 🔜
- Real-time stock tracking
- Stock movement history
- Low stock alerts
- Stock transfers between locations
- Automated reorder points

### 4. Point of Sale (POS) 🔜
- Touch-optimized interface
- Multiple payment gateways
- Receipt generation
- Loyalty integration
- Barcode scanning

### 5. Sales Management 🔜
- Sales orders
- Invoicing
- Returns/refunds
- Sales representatives
- Commission management

### 6. Customer CRM 🔜
- Customer profiles
- Interaction history
- Loyalty programs
- Customer segmentation
- Support tickets

### 7. Supplier Management 🔜
- Supplier directory
- Purchase orders
- Supplier performance tracking
- Contract management

### 8. Employee Management 🔜
- Employee profiles
- Time tracking
- Payroll integration
- Performance reviews
- Shift scheduling

### 9. Financial Management 🔜
- General ledger
- Accounts receivable/payable
- Financial reporting
- Budget planning
- Expense tracking

### 10. Reports & Analytics 🔜
- Custom reports
- Real-time dashboards
- Export capabilities
- Comparative analysis

## 🎨 Theme System

The application features a powerful, instant theme system:

```tsx
import { useTheme } from '@/lib/theme';

export function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme('dark')}>
      Switch Theme
    </button>
  );
}
```

**Features:**
- ✅ Three modes: Light, Dark, Auto
- ✅ Instant switching
- ✅ Persistent storage
- ✅ CSS variables
- ✅ System preference detection

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-optimized interface
- Flexible grid layouts
- Breakpoints: sm, md, lg, xl

## 🔐 Security

- JWT-based authentication
- Protected API routes
- Role-based access control ready
- CORS configuration
- Audit logging ready

## 📊 Project Phases

### ✅ Phase 1: Foundation (COMPLETED)
- [x] Next.js 14 setup
- [x] TypeScript configuration
- [x] Tailwind CSS
- [x] Theme system
- [x] UI components
- [x] Dashboard layout
- [x] Navigation
- [x] Login page
- [x] State management

### 📋 Phase 2: Core Modules (NEXT)
- [ ] Product CRUD
- [ ] Inventory
- [ ] Sales & Orders
- [ ] Customer CRM
- [ ] Data tables
- [ ] Forms

### 🔜 Phase 3: Advanced Features
- [ ] POS Interface
- [ ] Supplier Management
- [ ] Employee Management
- [ ] Financial Tools
- [ ] Advanced Reports

### 🔜 Phase 4: Enterprise
- [ ] Multi-currency
- [ ] Multi-language
- [ ] Advanced RBAC
- [ ] API integrations
- [ ] Mobile app

## 🚀 Development Scripts

### Frontend (client/)
```bash
npm run dev          # Development server
npm run build        # Build for production
npm start           # Production server
npm run lint        # Linting
npm run format      # Code formatting
npm run type-check  # TypeScript check
```

### Backend (server/)
```bash
npm run dev         # Development server
npm start          # Production server
```

## 📦 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Current user

### Products
- `GET /products` - List products
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Customers
- `GET /customers` - List customers
- `POST /customers` - Create customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Orders
- `GET /orders` - List orders
- `POST /orders` - Create order
- `PUT /orders/:id` - Update order
- `DELETE /orders/:id` - Delete order

### Dashboard
- `GET /dashboard/stats` - Dashboard statistics
- `GET /dashboard/sales-chart` - Sales data
- `GET /dashboard/recent-orders` - Recent orders

## 📚 Full Documentation

- **project.md** - Complete project specification
- **suggestion.md** - Technology recommendations
- **server/README.md** - Backend setup
- **client/README.md** - Frontend setup

## 🎯 Success Criteria

- ✅ Theme switching <50ms
- ✅ Mobile responsive
- ✅ Page load <2 seconds
- ✅ WCAG 2.1 AA compliant
- ✅ Cross-browser compatible
- ✅ Professional UI
- ✅ Scalable architecture

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use existing components
3. Maintain responsive design
4. Add type definitions
5. Update documentation

## 📄 License

ISC

---

**Built with ❤️ for modern retail businesses**

Latest Update: November 2025
Version: 1.0.0 (Alpha)
