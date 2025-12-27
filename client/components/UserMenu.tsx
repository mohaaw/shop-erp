'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  FileText,
  MessageSquare,
  HelpCircle,
  ChevronUp,
  Palette,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations('UserMenu');


  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors w-full"
        title="User Menu"
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-primary-600 flex items-center justify-center text-xs font-bold text-white bg-primary-600"
        >
          AD
        </div>
        <ChevronUp
          size={16}
          className={cn(
            'transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute bottom-full start-0 mb-2 w-72 bg-white dark:bg-secondary-900 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 p-2 z-50"
        >
          {/* User Profile */}
          <div className="px-3 py-2 border-b border-secondary-200 dark:border-secondary-700 mb-2">
            <p className="font-semibold text-secondary-900 dark:text-secondary-50">{t('adminUser')}</p>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">{t('adminEmail')}</p>
          </div>

          {/* Menu Items */}
          <button className="w-full text-left px-3 py-2 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors flex items-center gap-2 text-secondary-900 dark:text-secondary-50">
            <User size={16} /> {t('profile')}
          </button>
          <Link href="/dashboard/settings" className="w-full text-left px-3 py-2 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors flex items-center gap-2 text-secondary-900 dark:text-secondary-50">
            <Settings size={16} /> {t('settings')}
          </Link>
          <div className="px-3 py-2">
            <LanguageSwitcher />
          </div>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors flex items-center gap-2 text-secondary-900 dark:text-secondary-50">
            <FileText size={16} /> {t('documentation')}
          </button>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors flex items-center gap-2 text-secondary-900 dark:text-secondary-50">
            <MessageSquare size={16} /> {t('feedback')}
          </button>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors flex items-center gap-2 text-secondary-900 dark:text-secondary-50">
            <HelpCircle size={16} /> {t('help')}
          </button>

          {/* Divider */}
          <div className="border-t border-secondary-200 dark:border-secondary-700 my-2" />

          {/* Appearance Section */}
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-secondary-600 dark:text-secondary-400 mb-2 flex items-center gap-1">
              <Palette size={14} /> {t('themes')}
            </p>

            {/* Quick Theme Mode Buttons */}
            <div className="flex gap-1">
              <button
                onClick={() => setTheme('light')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs rounded transition-all',
                  theme === 'light'
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 hover:bg-secondary-200'
                )}
                title="Light Mode"
              >
                <Sun size={14} /> {t('light')}
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs rounded transition-all',
                  theme === 'dark'
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 hover:bg-secondary-200'
                )}
                title="Dark Mode"
              >
                <Moon size={14} /> {t('dark')}
              </button>
              <button
                onClick={() => setTheme('system')}
                className={cn(
                  'flex-1 px-2 py-1.5 text-xs rounded transition-all',
                  theme === 'system'
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 hover:bg-secondary-200'
                )}
                title="Auto Mode"
              >
                {t('auto')}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-secondary-200 dark:border-secondary-700 my-2" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 text-red-600 dark:text-red-400"
          >
            <LogOut size={16} /> {t('logout')}
          </button>
        </div>
      )}
    </div>
  );
}
