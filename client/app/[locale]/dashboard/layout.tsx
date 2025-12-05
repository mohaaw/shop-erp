'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  Menu,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Box,
  DollarSign,
  Briefcase,
  Users2,
  PlusCircle,
} from 'lucide-react';
import { UserMenu } from '@/components/UserMenu';

import { useSettingsStore } from '@/lib/stores/settings-store';
import { useEffect } from 'react';
import { getSettingsAction } from '@/app/actions/settings-actions';

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Common');
  const isRtl = locale === 'ar';
  const { storeName, setStoreName } = useSettingsStore();

  // Fetch settings on mount
  useEffect(() => {
    getSettingsAction().then((settings) => {
      if (settings?.storeName) {
        setStoreName(settings.storeName);
      }
    });
  }, [setStoreName]);

  const initials = storeName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const menuItems = [
    { label: t('dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { label: t('products'), href: '/dashboard/products', icon: Package },
    { label: t('inventory'), href: '/dashboard/inventory', icon: Box },
    { label: t('sales'), href: '/dashboard/sales', icon: ShoppingCart },
    { label: t('customers'), href: '/dashboard/customers', icon: Users },
    { label: t('pos'), href: '/dashboard/pos', icon: PlusCircle },
    { label: t('suppliers'), href: '/dashboard/suppliers', icon: Briefcase },
    { label: t('employees'), href: '/dashboard/employees', icon: Users2 },
    { label: t('finance'), href: '/dashboard/finance', icon: DollarSign },
    { label: t('reports'), href: '/dashboard/reports', icon: BarChart3 },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 h-screen w-64 bg-white dark:bg-secondary-900 border-secondary-200 dark:border-secondary-800 transform transition-transform duration-300 z-40 md:static md:translate-x-0',
          isRtl ? 'right-0 border-l' : 'left-0 border-r',
          isOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-800">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">{initials}</span>
              </div>
              <div>
                <p className="font-bold text-secondary-900 dark:text-white text-sm">{storeName}</p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">{t('retailErp')}</p>
              </div>
            </Link>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-900 dark:bg-primary-800 dark:text-white'
                      : 'text-secondary-700 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-800'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer: User Menu */}
          <div className="border-t border-secondary-200 dark:border-secondary-800 p-3 bg-secondary-50/50 dark:bg-secondary-900/50">
            <UserMenu />
          </div>
        </div>
      </aside>
    </>
  );
}

function TopNav({ onMenuOpen }: { onMenuOpen: () => void }) {
  const t = useTranslations('Common');

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-800">
      <div className="px-4 py-3 flex items-center justify-between">
        <button
          onClick={onMenuOpen}
          className="md:hidden p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-secondary-900 dark:text-white" />
        </button>

        <div className="flex-1 md:flex-none md:ml-auto flex items-center gap-4">
          <div className="text-sm font-medium text-secondary-900 dark:text-white">
            {t('welcomeAdmin')}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-secondary-50 dark:bg-secondary-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav onMenuOpen={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
