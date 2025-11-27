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
} from 'lucide-react';

const primaryColors = [
  { name: 'Red', value: 'red', color: '#EF4444' },
  { name: 'Orange', value: 'orange', color: '#F97316' },
  { name: 'Amber', value: 'amber', color: '#FBBF24' },
  { name: 'Yellow', value: 'yellow', color: '#FACC15' },
  { name: 'Lime', value: 'lime', color: '#84CC16' },
  { name: 'Green', value: 'green', color: '#22C55E' },
  { name: 'Emerald', value: 'emerald', color: '#10B981' },
  { name: 'Teal', value: 'teal', color: '#14B8A6' },
  { name: 'Cyan', value: 'cyan', color: '#06B6D4' },
  { name: 'Sky', value: 'sky', color: '#0EA5E9' },
  { name: 'Blue', value: 'blue', color: '#3B82F6' },
  { name: 'Indigo', value: 'indigo', color: '#6366F1' },
  { name: 'Violet', value: 'violet', color: '#8B5CF6' },
  { name: 'Purple', value: 'purple', color: '#A855F7' },
  { name: 'Fuchsia', value: 'fuchsia', color: '#D946EF' },
  { name: 'Pink', value: 'pink', color: '#EC4899' },
  { name: 'Rose', value: 'rose', color: '#F43F5E' },
];

const neutralColors = [
  { name: 'Slate', value: 'slate', color: '#64748B' },
  { name: 'Gray', value: 'gray', color: '#6B7280' },
  { name: 'Zinc', value: 'zinc', color: '#71717A' },
  { name: 'Neutral', value: 'neutral', color: '#737373' },
  { name: 'Stone', value: 'stone', color: '#78716C' },
];

// Apply accent colors via CSS variables
function applyAccentColors(primary: string, neutral: string) {
  const primaryColor = primaryColors.find(c => c.value === primary)?.color || '#3B82F6';
  const neutralColor = neutralColors.find(c => c.value === neutral)?.color || '#64748B';
  
  const root = document.documentElement;
  root.style.setProperty('--accent-primary', primaryColor);
  root.style.setProperty('--accent-neutral', neutralColor);
}

// Safely get theme from context, avoiding hydration issues
function useThemeSafe() {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'auto'>('auto');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' || 'auto';
    setThemeState(savedTheme);

    // Apply theme
    const html = document.documentElement;
    html.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
      html.classList.add('dark');
    } else if (savedTheme === 'light') {
      html.classList.remove('dark');
    }
  }, []);

  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    const html = document.documentElement;
    html.setAttribute('data-theme', newTheme);
    
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else if (newTheme === 'light') {
      html.classList.remove('dark');
    } else {
      // auto mode
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  };

  return { theme, setTheme, mounted };
}

export function UserMenu() {
  const { theme, setTheme, mounted } = useThemeSafe();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrimary, setSelectedPrimary] = useState('blue');
  const [selectedNeutral, setSelectedNeutral] = useState('slate');
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Initialize colors from localStorage on mount
  useEffect(() => {
    if (!mounted) return;
    
    const savedPrimary = localStorage.getItem('accentColor-primary') || 'blue';
    const savedNeutral = localStorage.getItem('accentColor-neutral') || 'slate';
    setSelectedPrimary(savedPrimary);
    setSelectedNeutral(savedNeutral);
    applyAccentColors(savedPrimary, savedNeutral);
  }, [mounted]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
  };

  const handlePrimaryColorChange = (color: string) => {
    setSelectedPrimary(color);
    localStorage.setItem('accentColor-primary', color);
    applyAccentColors(color, selectedNeutral);
  };

  const handleNeutralColorChange = (color: string) => {
    setSelectedNeutral(color);
    localStorage.setItem('accentColor-neutral', color);
    applyAccentColors(selectedPrimary, color);
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (!mounted) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative">
      {/* User Profile Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg',
          'hover:bg-secondary-100 dark:hover:bg-secondary-800',
          'transition-colors group',
          isOpen && 'bg-secondary-100 dark:bg-secondary-800'
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">AD</span>
          </div>
          <div className="text-left min-w-0">
            <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
              Admin User
            </p>
            <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
              admin@erp.com
            </p>
          </div>
        </div>
        <ChevronUp
          className={cn(
            'w-4 h-4 flex-shrink-0 text-secondary-500 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={cn(
            'absolute bottom-full left-0 right-0 mb-2 z-50',
            'bg-white dark:bg-secondary-900',
            'border border-secondary-200 dark:border-secondary-800',
            'rounded-lg shadow-lg overflow-hidden',
            'min-w-[240px]'
          )}
        >
          {/* Profile Section */}
          <div className="px-3 py-2 border-b border-secondary-200 dark:border-secondary-800">
            <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
              <User className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
              <span className="text-sm text-secondary-700 dark:text-secondary-300">Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
              <Settings className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
              <span className="text-sm text-secondary-700 dark:text-secondary-300">Settings</span>
            </button>
          </div>

          {/* Appearance Section */}
          <div className="px-3 py-2 border-b border-secondary-200 dark:border-secondary-800">
            <div className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 px-2 py-1.5">
              Appearance
            </div>

            {/* Theme */}
            <div className="px-2 py-1.5 space-y-1">
              <div className="text-xs font-medium text-secondary-600 dark:text-secondary-300 mb-1">
                Theme
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition-colors',
                    theme === 'light'
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700'
                  )}
                >
                  <Sun className="w-3 h-3" />
                  Light
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition-colors',
                    theme === 'dark'
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700'
                  )}
                >
                  <Moon className="w-3 h-3" />
                  Dark
                </button>
              </div>
            </div>

            {/* Primary Color */}
            <div className="px-2 py-1.5">
              <div className="text-xs font-medium text-secondary-600 dark:text-secondary-300 mb-1.5">
                Primary
              </div>
              <div className="grid grid-cols-6 gap-1">
                {primaryColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handlePrimaryColorChange(color.value)}
                    title={color.name}
                    className={cn(
                      'w-6 h-6 rounded transition-all hover:scale-110',
                      'border-2 border-secondary-200 dark:border-secondary-700',
                      selectedPrimary === color.value && 'ring-2 ring-primary-500 ring-offset-1 dark:ring-offset-secondary-900'
                    )}
                    style={{ backgroundColor: color.color }}
                  />
                ))}
              </div>
            </div>

            {/* Neutral Color */}
            <div className="px-2 py-1.5">
              <div className="text-xs font-medium text-secondary-600 dark:text-secondary-300 mb-1.5">
                Neutral
              </div>
              <div className="flex gap-1">
                {neutralColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleNeutralColorChange(color.value)}
                    title={color.name}
                    className={cn(
                      'flex-1 h-5 rounded transition-all hover:scale-110',
                      'border border-secondary-200 dark:border-secondary-700',
                      selectedNeutral === color.value && 'ring-2 ring-primary-500 ring-offset-1 dark:ring-offset-secondary-900'
                    )}
                    style={{ backgroundColor: color.color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="px-3 py-2 border-b border-secondary-200 dark:border-secondary-800">
            <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
              <FileText className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
              <span className="text-sm text-secondary-700 dark:text-secondary-300">Documentation</span>
            </button>
            <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
              <MessageSquare className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
              <span className="text-sm text-secondary-700 dark:text-secondary-300">Feedback</span>
            </button>
            <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
              <HelpCircle className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
              <span className="text-sm text-secondary-700 dark:text-secondary-300">Help & Support</span>
            </button>
          </div>

          {/* Logout */}
          <div className="px-3 py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
