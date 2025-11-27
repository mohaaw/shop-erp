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
import {
  getThemeMode,
  setThemeMode,
  getPrimaryColor,
  getNeutralColor,
  PRESET_THEMES,
  applyPresetTheme,
  initializeTheme,
  type ThemeMode,
} from '@/lib/themeSystem';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [currentTheme, setCurrentTheme] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    initializeTheme();

    const mode = getThemeMode();
    const primary = getPrimaryColor();
    const neutral = getNeutralColor();

    setThemeModeState(mode);

    // Find matching preset theme
    const matching = PRESET_THEMES.find(
      t => t.mode === mode && t.primary === primary && t.neutral === neutral
    );
    setCurrentTheme(matching?.name || '');

    console.log('✅ UserMenu initialized:', { mode, primary, neutral, theme: matching?.name });
  }, []);

  // Handle preset theme selection
  const handlePresetTheme = (themeName: string) => {
    applyPresetTheme(themeName);
    setCurrentTheme(themeName);
    console.log('✅ Applied preset theme:', themeName);
  };

  // Handle manual theme mode change (Light/Dark/Auto buttons)
  const handleThemeModeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    setThemeModeState(mode);
    // Clear preset theme when manually changing mode
    setCurrentTheme('');
  };

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
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
        title="User Menu"
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-primary-600 flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: 'var(--primary-600)' }}
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
          className="absolute bottom-full left-0 mb-2 w-72 bg-white dark:bg-secondary-900 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 p-2 z-50"
        >
          {/* User Profile */}
          <div className="px-3 py-2 border-b border-secondary-200 dark:border-secondary-700 mb-2">
            <p className="font-semibold text-secondary-900 dark:text-secondary-50">Admin User</p>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">admin@example.com</p>
          </div>

          {/* Menu Items */}
          <button className="w-full text-left px-3 py-2 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors flex items-center gap-2 text-secondary-900 dark:text-secondary-50">
            <User size={16} /> Profile
          </button>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors flex items-center gap-2 text-secondary-900 dark:text-secondary-50">
            <Settings size={16} /> Settings
          </button>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors flex items-center gap-2 text-secondary-900 dark:text-secondary-50">
            <FileText size={16} /> Documentation
          </button>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors flex items-center gap-2 text-secondary-900 dark:text-secondary-50">
            <MessageSquare size={16} /> Feedback
          </button>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors flex items-center gap-2 text-secondary-900 dark:text-secondary-50">
            <HelpCircle size={16} /> Help
          </button>

          {/* Divider */}
          <div className="border-t border-secondary-200 dark:border-secondary-700 my-2" />

          {/* Appearance Section */}
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-secondary-600 dark:text-secondary-400 mb-2 flex items-center gap-1">
              <Palette size={14} /> Themes
            </p>

            {/* Preset Themes Grid */}
            <div className="grid grid-cols-2 gap-1 mb-3">
              {PRESET_THEMES.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => handlePresetTheme(theme.name)}
                  className={cn(
                    'px-2 py-1.5 text-xs rounded border transition-all',
                    currentTheme === theme.name
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 border-secondary-300 dark:border-secondary-600 hover:border-primary-400'
                  )}
                >
                  {theme.name}
                </button>
              ))}
            </div>

            {/* Quick Theme Mode Buttons */}
            <div className="flex gap-1">
              <button
                onClick={() => handleThemeModeChange('light')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs rounded transition-all',
                  themeMode === 'light'
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 hover:bg-secondary-200'
                )}
                title="Light Mode"
              >
                <Sun size={14} /> Light
              </button>
              <button
                onClick={() => handleThemeModeChange('dark')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs rounded transition-all',
                  themeMode === 'dark'
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 hover:bg-secondary-200'
                )}
                title="Dark Mode"
              >
                <Moon size={14} /> Dark
              </button>
              <button
                onClick={() => handleThemeModeChange('auto')}
                className={cn(
                  'flex-1 px-2 py-1.5 text-xs rounded transition-all',
                  themeMode === 'auto'
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 hover:bg-secondary-200'
                )}
                title="Auto Mode"
              >
                Auto
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
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
