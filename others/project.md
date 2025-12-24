# Project Prompt: ERP-SHOP - Complete Next.js ERP System Rebuild

## Core Objective
Build a comprehensive, modern ERP (Enterprise Resource Planning) system named "ERP-SHOP" using React + Next.js, Tailwind CSS, and a Nuxt UI-inspired design system. The application should replicate and enhance the Nuxt UI dashboard's aesthetic with superior theming capabilities and full enterprise functionality, including all modules required for comprehensive retail business management.

## Name: ERP-SHOP
Enterprise Resource Planning for Retail Shops - A complete solution for managing modern retail businesses.

## Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand
- **Component Library**: Headless UI components with Radix UI Primitives
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **File Upload**: UploadThing or Multer
- **Deployment**: Vercel (recommended) or self-hosted

## Core Design Philosophy
- **Nuxt UI Aesthetics**: Clean, minimalist interface with rounded elements (0.5rem radius)
- **Modern Color System**: Blue primary (#3B82F6) with full slate palette
- **Consistent Spacing**: 4px grid system with standardized padding/margin scale
- **Subtle Shadows**: Layered depth with 0.5-1px shadows
- **Typography Scale**: Inter font with proper hierarchy (H1-H6)
- **Accessibility**: WCAG 2.1 AA compliant throughout
- **Responsive Design**: Mobile-first with desktop-optimized layouts

## Theming System Requirements
1. **Dynamic Theme Engine**: Runtime theme switching without reload
2. **Multiple Themes**: Light, Dark, Auto (matches system), and custom themes
3. **Theme Persistence**: Save preferences to localStorage with system preference fallback
4. **Component Integration**: All UI components must respond to theme changes instantly
5. **Accessibility**: WCAG 2.1 AA compliant color contrast ratios
6. **Theme Editor**: Admin panel to customize primary colors, spacing, etc.
7. **Global Theme Switching**: Ability to change themes for all users or specific teams
8. **Theme Presets**: Multiple preset themes (Corporate, Modern, Creative, etc.)

## Complete Application Pages and Modules

### 1. Dashboard Module
- **Main Dashboard**: Real-time KPIs (Sales, Orders, Revenue, Customers)
- **Interactive charts and graphs**: Recharts with drill-down capabilities
- **Recent activity feed**: With filterable events and actions
- **Quick action widgets**: Customizable dashboard widgets
- **Performance metrics**: Revenue trends, growth indicators
- **Inventory alerts**: Low stock warnings and critical alerts
- **Customizable layout**: Drag-and-drop widget positioning
- **Multi-location view**: Aggregate data from multiple store locations

### 2. Product Management Module
- **Product Catalog**: Grid/list view with filtering and sorting
- **Product Variants**: Size, color, SKU management
- **Inventory Tracking**: Real-time stock levels with notifications
- **Categories & Tags**: Hierarchical categorization system
- **Barcode/QR Support**: UPC/EAN scanning integration
- **Bulk Import/Export**: CSV/Excel integration with templates
- **Product Lifecycle**: Draft, active, discontinued states
- **Image Management**: Multi-image upload with gallery view
- **SEO Tools**: Meta description, keywords, slug management
- **Pricing Matrix**: Dynamic pricing based on customer groups, regions, etc.

### 3. Inventory Management Module
- **Stock Level Tracking**: Real-time inventory with location tracking
- **Stock Movement History**: In/out transactions with reasons
- **Low Stock Alerts**: Configurable thresholds and notifications
- **Stock Transfers**: Between warehouses/locations
- **Vendor Stock**: Consignment and vendor-managed inventory
- **Automated Reorder Points**: Intelligent restocking triggers
- **Batch/Lot Tracking**: For expiry date management
- **Cycle Counting**: Periodic stock verification processes
- **Serial Number Tracking**: Individual product identification
- **Demand Forecasting**: Predictive analytics for inventory planning

### 4. Point of Sale (POS) Module
- **Touch-Optimized Interface**: Large buttons and intuitive layout
- **Offline Capability**: Functionality during network outages
- **Payment Processing**: Multiple gateways (Stripe, Square, PayPal)
- **Receipt Generation**: Print and email receipts with templates
- **Loyalty Integration**: Points, discounts, membership tiers
- **Barcode Scanning**: Built-in camera scanner
- **Split Payments**: Partial payments and combined payment types
- **Customer Facing Display**: Separate display for customers
- **Kitchen/Preparation Orders**: Order routing to kitchen staff
- **Gift Cards**: Issue, redeem, and manage gift cards

### 5. Sales Management Module
- **Sales Orders**: Create, edit, track orders
- **Invoicing**: Professional invoice generation and sending
- **Returns/Refunds**: Process returns and refunds efficiently
- **Sales Representatives**: Assign and track sales rep performance
- **Commission Management**: Calculate and track commissions
- **Sales Pipeline**: Visual sales funnel and opportunity tracking
- **Quotation System**: Create and manage quotes
- **Customer Orders**: Track customer order history and preferences
- **Abandoned Cart Recovery**: Follow-up system for incomplete orders

### 6. Customer Relationship Management (CRM)
- **Customer Profiles**: Detailed customer information and history
- **Contact Management**: Multiple contacts per business
- **Interaction History**: All customer interactions and notes
- **Communication Tools**: Email integration and campaigns
- **Loyalty Programs**: Tiered membership systems
- **Customer Segmentation**: Group customers by behavior/purchase patterns
- **Support Tickets**: Customer service portal
- **Birthday/Affinity Tracking**: Special offers and promotions
- **Communication Preferences**: Opt-out management
- **Customer Lifetime Value**: Analytics and predictions

### 7. Supplier Management Module
- **Supplier Directory**: Contact details and performance metrics
- **Purchase Orders**: Create and manage procurement orders
- **Supplier Performance**: Rating system and analytics
- **Contracts Management**: Terms, agreements, and negotiations
- **Price Negotiation**: Track discount arrangements
- **Delivery Tracking**: Monitor shipping and receipt
- **Quality Control**: Defect tracking and ratings
- **RFQ System**: Request for quotation workflow
- **Supplier Portal**: Self-service portal for suppliers

### 8. Employee Management Module
- **Employee Profiles**: Personal details and emergency contacts
- **Role Management**: Position and department assignments
- **Time Tracking**: Clock in/out and timesheet management
- **Payroll Integration**: Salary calculations and pay stubs
- **Performance Reviews**: Evaluation system and goals
- **Training Records**: Certification and skill tracking
- **Attendance Management**: Leave tracking and scheduling
- **Access Levels**: Permission-based system access
- **Shift Scheduling**: Rotating shifts and coverage planning

### 9. Financial Management Module
- **General Ledger**: Chart of accounts and transactions
- **Accounts Receivable**: Invoice tracking and collections
- **Accounts Payable**: Expense tracking and payment processing
- **Financial Reporting**: Income, balance sheet, cash flow statements
- **Tax Management**: Automatic tax calculation and reporting
- **Budget Planning**: Budget creation and variance analysis
- **Expense Tracking**: Employee expense submissions
- **Asset Management**: Track company assets and depreciation
- **Multi-Currency**: Foreign exchange and conversion tracking

### 10. Reporting & Analytics Module
- **Custom Report Builder**: Drag-and-drop report creation
- **Real-time Dashboards**: Live KPI monitoring
- **Scheduled Reports**: Automated email delivery
- **Export Capabilities**: PDF, Excel, CSV formats
- **Comparative Analysis**: Year-over-year, seasonal comparisons
- **Predictive Analytics**: Sales forecasting and trend analysis
- **Customer Analytics**: Purchase patterns and profitability
- **Inventory Analytics**: Turnover rates and optimization
- **Sales Analytics**: Performance metrics and territory analysis
- **Financial Analytics**: Profitability, margin analysis

### 11. Settings & Administration Module
- **Multi-Location Support**: Manage multiple store locations
- **Tax Configuration**: Regional tax laws and rates
- **Payment Methods**: Setup and management
- **User Management**: Create, edit, deactivate users
- **Role-Based Permissions**: Granular access controls
- **Company Information**: Legal details and branding
- **Backup & Recovery**: Data backup and restore utilities
- **System Logs**: Audit trail and error monitoring
- **Integration Hub**: Connect third-party services
- **Email Templates**: Customize communication templates

### 12. Advanced Features
- **Multi-Currency Support**: Real-time currency conversion
- **Multi-Language**: Internationalization (i18n) support
- **Advanced Permissions**: Role-based and attribute-based access
- **Audit Logging**: Comprehensive system activity logs
- **API Integration**: RESTful API for external connections
- **Third-Party Connectors**: Shopify, Amazon, eBay integration
- **Mobile App**: Native mobile application (future phase)
- **Cloud Sync**: Real-time synchronization across devices
- **Machine Learning**: Demand forecasting and recommendations
- **Barcoding System**: Complete inventory barcode management

## Admin Panel Features
- **User Management**: Create, edit, deactivate system users
- **Role-Based Access Control (RBAC)**: Fine-grained permissions
- **System Monitoring**: Server health and performance metrics
- **Data Import/Export Tools**: Comprehensive data management
- **Custom Field Creation**: Add custom attributes to entities
- **Workflow Automation**: Business process automation tools
- **Notification Manager**: Configure system notifications
- **Backup & Restore Utilities**: Complete data management tools
- **Performance Analytics**: System and user performance
- **Security Configuration**: Password policies, login attempts
- **API Key Management**: Secure API access control
- **Integration Hub**: Third-party service connectors
- **System Maintenance**: Cache clearing, optimization tools

## Theming Architecture
### Theme Provider
- Context API for theme state management
- CSS variable generation for all theme properties
- Theme persistence using localStorage
- System preference detection

### Theme Structure
```
Theme = {
  colors: {
    primary: { 50-950 },
    secondary: { 50-950 },
    success: { 50-950 },
    warning: { 50-950 },
    error: { 50-950 },
    info: { 50-950 },
    background: string,
    foreground: string
  },
  spacing: {
    xs: string,
    sm: string,
    md: string,
    lg: string,
    xl: string,
    '2xl': string
  },
  radius: {
    xs: string,
    sm: string,
    md: string,
    lg: string,
    xl: string,
    '2xl': string,
    full: string
  },
  shadows: {
    xs: string,
    sm: string,
    md: string,
    lg: string,
    xl: string
  },
  typography: {
    fontFamily: string,
    sizes: {
      xs: string,
      sm: string,
      md: string,
      lg: string,
      xl: string
    }
  }
}
```

### Theme Switching Mechanism
- CSS variables applied at root level for instant updates
- Component-specific theme classes that respond to theme changes
- Smooth transitions for theme switches
- Animation preservation across theme changes

## Component Library Requirements

### Core UI Components:
1. **Card**: With header, content, footer sections and variants
2. **Button**: All variants (primary, secondary, outline, ghost, icon, link) with loading states
3. **Input**: Text, number, email, password, date, with validation and error states
4. **Select**: Single, multi, searchable, grouped options
5. **DataTable**: With sorting, filtering, pagination, row selection
6. **Dialog**: Modal dialogs with backdrop and transitions
7. **Dropdown**: Menu with arrow and positioning
8. **Tabs**: With icons, indicators, and controlled state
9. **Badge**: Success, warning, error, info, outline variants
10. **Alert**: With dismissible options and severity levels
11. **Skeleton**: Loading placeholders with shimmer effect
12. **Avatar**: Profile pictures with initials fallback
13. **Tooltip**: Interactive tooltips with positioning
14. **Progress**: Linear and circular progress indicators
15. **Pagination**: Advanced pagination controls
16. **Switch**: Toggle controls with labels
17. **Checkbox & Radio**: Accessible form controls
18. **Accordion**: Expandable/collapsible sections
19. **Breadcrumb**: Navigation breadcrumbs
20. **Navigation Menu**: Sidebar and horizontal navigation

### Business-Specific Components:
1. **InventoryCard**: Shows product stock levels and status
2. **CustomerCard**: Displays customer information and stats
3. **TransactionSummary**: Financial transaction overview
4. **ProductGrid**: Responsive product display grid
5. **POSKeyboard**: Touch-optimized numeric keyboard
6. **ChartCard**: Standardized chart containers with controls
7. **KPIWidget**: Key performance indicator display
8. **UserPermissionSelector**: RBAC permission matrix
9. **FileUpload**: Drag-and-drop file upload with previews
10. **ImageCropper**: Image editing for product photos

### Higher-Order Components:
1. **ThemeProvider**: Manages current theme and provides context
2. **ThemeSetter**: Allows users to modify theme properties
3. **ResponsiveSidebar**: Collapsible with pin functionality
4. **DynamicDashboard**: Adapts layout based on screen size
5. **PermissionGuard**: Route protection based on user permissions
6. **AuthGuard**: Session management and authentication
7. **ErrorBoundary**: Global error handling and reporting
8. **DataTableWithFilters**: Integrated filtering and sorting
9. **CRUDOperations**: Create, read, update, delete interfaces
10. **ExportManager**: Data export functionality

## Dashboard Features
1. **Navigation Management**:
   - Collapsible sidebar that remembers state
   - Active route highlighting with progress indicators
   - Nested menu expansion with badges
   - Mobile-responsive hamburger menu
   - Quick access menu with favorites
   - Breadcrumb navigation with contextual links

2. **Data Management**:
   - Real-time data synchronization
   - Optimistic UI updates with rollback capability
   - Caching strategies for performance
   - Search and filter across all modules
   - Bulk operations for efficiency
   - Data validation and error handling
   - Audit trail for all changes

3. **Visual Hierarchy**:
   - Proper spacing and alignment with visual rhythm
   - Consistent typography across all modules
   - Meaningful color application for data representation
   - Clear call-to-action buttons with priority
   - Status indicators and progress tracking
   - Visual feedback for user interactions

4. **Performance Optimization**:
   - Code splitting at module level
   - Image optimization with next/image
   - Efficient state updates with proper normalization
   - Memoization strategies for computations
   - Virtual scrolling for large datasets
   - Progressive loading for heavy pages

## Implementation Phases

### Phase 1: Foundation (Week 1-3)
- Set up Next.js project with TypeScript and database
- Configure Tailwind CSS with custom Nuxt-inspired design tokens
- Create ThemeProvider and basic theme structure
- Build foundational UI components (buttons, cards, etc.)
- Implement basic theming functionality
- Set up authentication system
- Create core data models and relationships

### Phase 2: Layout System (Week 4-6)  
- Build responsive sidebar with pin functionality
- Create top navigation bar with theme switcher
- Develop dashboard grid system with drag-and-drop
- Implement responsive breakpoints for all devices
- Set up routing system for all modules
- Create shared layouts and page templates

### Phase 3: Core Modules (Week 7-12)
- Build Product Management module with full CRUD
- Create Inventory Management module with tracking
- Develop Sales Management module
- Implement Customer Management system
- Build POS interface with payment processing
- Develop dashboard with KPIs and widgets
- Create reporting infrastructure

### Phase 4: Advanced Modules (Week 13-18)
- Build Supplier Management module
- Create Employee Management system
- Develop Financial Management tools
- Implement CRM features
- Build comprehensive reporting system
- Add advanced analytics capabilities
- Create settings and admin interfaces

### Phase 5: Advanced Features (Week 19-24)
- Theme customization panel
- Advanced dashboard layouts with drag-and-drop
- Real-time notifications system
- API integration capabilities
- File upload and management
- Advanced search functionality
- Machine learning features (predictions)

### Phase 6: Polish & Deployment (Week 25-28)
- Accessibility audit and improvements
- Cross-browser testing and fixes
- Performance optimization and audits
- Security hardening
- Documentation creation
- Production deployment preparation
- User training materials

## Expected Deliverables
- Fully responsive ERP dashboard
- Dynamic theme system with customization options
- Comprehensive component library reusable across features
- Complete business module implementations
- Advanced reporting and analytics system
- Mobile-responsive interface
- Comprehensive theming documentation
- Performance-optimized production build
- Accessible, WCAG-compliant interface
- Multi-language support
- API documentation and integration guides

## Success Criteria
- Theme switching feels instantaneous (<50ms)
- All components adapt seamlessly to theme changes
- Mobile-responsive with touch-optimized controls
- Page load times <2 seconds on 3G connection
- 100/100 Lighthouse scores
- WCAG 2.1 AA compliance
- Cross-browser compatibility (Chrome, FF, Safari, Edge)
- Professional, modern aesthetic matching Nuxt UI standards
- Comprehensive business functionality matching ERP requirements
- Scalable architecture supporting 10k+ products and customers
- Real-time data synchronization across all modules
- Intuitive user experience with minimal learning curve
- Comprehensive security with role-based access control
- Extensive reporting and analytics capabilities
- Reliable offline functionality for critical features
- Multi-location support for franchise/chain businesses
- Complete audit trail for compliance requirements

## ERP-SHOP: The Ultimate Retail ERP Solution
This comprehensive rebuild will transform your application into ERP-SHOP - a world-class enterprise resource planning system that combines the beautiful Nuxt UI aesthetic with robust business functionality. The system will serve as a complete solution for modern retail businesses of all sizes, from single-store operations to multi-location franchises. The advanced theming system will provide the dynamic, professional appearance you demand, while the comprehensive functionality will meet all operational requirements of a modern retail environment.