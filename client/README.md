# ERP-SHOP Client

Enterprise Resource Planning for Retail Shops - Next.js Frontend Application

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Create `.env.local` file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Development

Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Demo Credentials
- Email: `admin@example.com`
- Password: `password123`

## Project Structure

```
client/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages and layout
│   ├── login/            # Authentication pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # Reusable React components
│   └── ui/              # UI component library
├── lib/                 # Utility functions
│   ├── api.ts          # API client
│   ├── theme.tsx       # Theme provider
│   └── utils.ts        # Helper utilities
├── types/              # TypeScript type definitions
├── store/              # Zustand state management
├── hooks/              # Custom React hooks
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
├── next.config.js      # Next.js configuration
└── package.json        # Dependencies and scripts
```

## Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Radix UI + Custom components
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Animations**: Framer Motion
- **HTTP Client**: Axios

## Features

### Current
- ✅ Modern, responsive UI with Nuxt-inspired design
- ✅ Dynamic theme switching (light/dark/auto)
- ✅ Complete dashboard layout
- ✅ Navigation system for all modules
- ✅ Login page with authentication
- ✅ UI component library

### Planned
- 📋 Product Management with CRUD
- 📦 Inventory Tracking
- 💳 Point of Sale (POS)
- 👥 Customer CRM
- 🛒 Sales & Orders
- 📊 Analytics & Reporting
- 👔 Employee Management
- 💰 Financial Management
- 🏢 Multi-location Support
- ⚙️ Admin Settings Panel

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:3001`)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## License

ISC
