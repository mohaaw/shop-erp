'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Zap,
  Shield,
  Globe,
  Smartphone,
} from 'lucide-react';

const features = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    description: 'Real-time KPIs and business analytics',
  },
  {
    icon: Package,
    title: 'Product Management',
    description: 'Complete product catalog with variants',
  },
  {
    icon: ShoppingCart,
    title: 'Sales & Orders',
    description: 'Order management and invoicing',
  },
  {
    icon: Users,
    title: 'Customer CRM',
    description: 'Manage customer relationships',
  },
  {
    icon: Zap,
    title: 'Point of Sale',
    description: 'Fast, touch-optimized POS interface',
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Role-based access and audit trails',
  },
  {
    icon: Globe,
    title: 'Multi-Location',
    description: 'Support for multiple stores',
  },
  {
    icon: Smartphone,
    title: 'Responsive',
    description: 'Works on all devices',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-secondary-200 dark:border-secondary-800 bg-white/80 dark:bg-secondary-900/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">ES</span>
            </div>
            <span className="font-bold text-secondary-900 dark:text-white">ERP-SHOP</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 dark:text-white">
            Enterprise Resource Planning for{' '}
            <span className="text-primary-600">Retail</span>
          </h1>
          <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
            Complete ERP system for managing modern retail businesses with beautiful Nuxt UI-inspired design
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg">Get Started</Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 dark:text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-secondary-600 dark:text-secondary-400">
            Everything you need to run a modern retail business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="font-semibold text-secondary-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-r from-primary-600 to-primary-800 border-0">
          <CardContent className="py-16">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Transform Your Retail Business?
              </h2>
              <p className="text-primary-100 text-lg max-w-2xl mx-auto">
                Start managing your entire retail operation with ERP-SHOP today
              </p>
              <Link href="/dashboard">
                <Button size="lg" variant="secondary">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-secondary-200 dark:border-secondary-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-secondary-600 dark:text-secondary-400">
            <p>© 2025 ERP-SHOP. All rights reserved.</p>
            <p className="text-sm mt-2">Enterprise Resource Planning for Retail Shops</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
