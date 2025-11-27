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
import {
  getThemeMode,
  setThemeMode,
  getPrimaryColor,
  setPrimaryColor,
  getNeutralColor,
  setNeutralColor,
  PRIMARY_COLORS,
  NEUTRAL_COLORS,
  type ThemeMode,
  applyCSSVariables,
} from '@/lib/themeSystem';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [primaryColor, setPrimaryColorState] = useState('blue');
  const [neutralColor, setNeutralColorState] = useState('slate');
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Initialize from localStorage on mount AND apply colors
  useEffect(() => {
    setMounted(true);
    
    // Load saved values
    const savedTheme = getThemeMode();
    const savedPrimary = getPrimaryColor();
    const savedNeutral = getNeutralColor();
    
    setThemeModeState(savedTheme);
    setPrimaryColorState(savedPrimary);
    setNeutralColorState(savedNeutral);
    
    // IMPORTANT: Apply CSS variables immediately
    applyCSSVariables();
  }, []);

  // Handle theme mode change
  const handleThemeModeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    setThemeModeState(mode);
  };

  // Handle primary color change - MUST apply CSS variables
  const handlePrimaryColorChange = (color: string) => {
    setPrimaryColor(color);
    setPrimaryColorState(color);
    // Force CSS variables to update
    setTimeout(() => applyCSSVariables(), 0);
  };

  // Handle neutral color change - MUST apply CSS variables
  const handleNeutralColorChange = (color: string) => {
    setNeutralColor(color);
    setNeutralColorState(color);
    // Force CSS variables to update
    setTimeout(() => applyCSSVariables(), 0);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
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
          'transition-colors',
          isOpen && 'bg-secondary-100 dark:bg-secondary-800'
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
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
            'rounded-lg shadow-lg',
            'min-w-[260px] max-h-[600px] overflow-y-auto'
          )}
        >
          {/* ======================
              THEME MODE SECTION - SMALLER BUTTONS
              ====================== */}
          <div className="px-2 py-2 border-b border-secondary-200 dark:border-secondary-800">
            <div className="text-xs font-semibold text-secondary-600 dark:text-secondary-300 px-1 mb-1.5">
              THEME
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleThemeModeChange('light')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all',
                  themeMode === 'light'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700'
                )}
              >
                <Sun className="w-3 h-3" />
                Light
              </button>
              <button
                onClick={() => handleThemeModeChange('dark')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all',
                  themeMode === 'dark'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700'
                )}
              >
                <Moon className="w-3 h-3" />
                Dark
              </button>
              <button
                onClick={() => handleThemeModeChange('auto')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all',
                  themeMode === 'auto'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700'
                )}
              >
                <Sun className="w-3 h-3" />
                Auto
              </button>
            </div>
          </div>

          {/* ======================
              PRIMARY COLOR SECTION
              ====================== */}
          <div className="px-2 py-2 border-b border-secondary-200 dark:border-secondary-800">
            <div className="text-xs font-semibold text-secondary-600 dark:text-secondary-300 px-1 mb-1.5">
              PRIMARY
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {PRIMARY_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handlePrimaryColorChange(color.value)}
                  title={color.name}
                  className={cn(
                    'w-full aspect-square rounded-md transition-all cursor-pointer relative',
                    'hover:scale-105 hover:shadow-md',
                    primaryColor === color.value && 'ring-2 ring-offset-1 ring-blue-600'
                  )}
                  style={{ backgroundColor: color.hex }}
                >
                  {primaryColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-md">
                      <div className="text-white font-bold text-xs">✓</div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ======================
              NEUTRAL COLOR SECTION
              ====================== */}
          <div className="px-2 py-2 border-b border-secondary-200 dark:border-secondary-800">
            <div className="text-xs font-semibold text-secondary-600 dark:text-secondary-300 px-1 mb-1.5">
              NEUTRAL
            </div>
            <div className="flex gap-1.5">
              {NEUTRAL_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleNeutralColorChange(color.value)}
                  title={color.name}
                  className={cn(
                    'flex-1 h-8 rounded-md transition-all cursor-pointer relative',
                    'hover:scale-105 hover:shadow-md',
                    neutralColor === color.value && 'ring-2 ring-offset-1 ring-blue-600'
                  )}
                  style={{ backgroundColor: color.hex }}
                >
                  {neutralColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-md">
                      <div className="text-white font-bold text-xs">✓</div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ======================
              MENU ITEMS SECTION
              ====================== */}
          <div className="px-2 py-1.5 border-b border-secondary-200 dark:border-secondary-800">
            <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors text-left text-sm">
              <User className="w-4 h-4 text-secondary-600 dark:text-secondary-400 flex-shrink-0" />
              <span className="text-secondary-700 dark:text-secondary-300">Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors text-left text-sm">
              <Settings className="w-4 h-4 text-secondary-600 dark:text-secondary-400 flex-shrink-0" />
              <span className="text-secondary-700 dark:text-secondary-300">Settings</span>
            </button>
          </div>

          {/* ======================
              SUPPORT SECTION
              ====================== */}
          <div className="px-2 py-1.5 border-b border-secondary-200 dark:border-secondary-800">
            <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors text-left text-sm">
              <FileText className="w-4 h-4 text-secondary-600 dark:text-secondary-400 flex-shrink-0" />
              <span className="text-secondary-700 dark:text-secondary-300">Documentation</span>
            </button>
            <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors text-left text-sm">
              <MessageSquare className="w-4 h-4 text-secondary-600 dark:text-secondary-400 flex-shrink-0" />
              <span className="text-secondary-700 dark:text-secondary-300">Feedback</span>
            </button>
            <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors text-left text-sm">
              <HelpCircle className="w-4 h-4 text-secondary-600 dark:text-secondary-400 flex-shrink-0" />
              <span className="text-secondary-700 dark:text-secondary-300">Help & Support</span>
            </button>
          </div>

          {/* ======================
              LOGOUT SECTION
              ====================== */}
          <div className="px-2 py-1.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-2 py-1.5 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left text-sm"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
