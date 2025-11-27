'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import {
  Theme,
  ResolvedTheme,
  ThemeContextType,
  ThemeName,
  NeutralColor
} from '@/types';
import {
  getThemeMode,
  setThemeMode,
  getPrimaryColor,
  setPrimaryColor as setSystemPrimaryColor,
  getNeutralColor,
  setNeutralColor as setSystemNeutralColor,
  initializeTheme
} from './themeSystem';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [primaryColor, setPrimaryColorState] = useState<ThemeName>('blue');
  const [neutralColor, setNeutralColorState] = useState<NeutralColor>('slate');
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    initializeTheme();

    setThemeState(getThemeMode());
    setPrimaryColorState(getPrimaryColor());
    setNeutralColorState(getNeutralColor());

    // Initial resolution
    const isDark = getThemeMode() === 'dark' ||
      (getThemeMode() === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setResolvedTheme(isDark ? 'dark' : 'light');
  }, []);

  // Handle system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'auto') {
        const isDark = mediaQuery.matches;
        setResolvedTheme(isDark ? 'dark' : 'light');
        // Re-apply to ensure correct class is set if needed, though themeSystem handles this
        setThemeMode('auto');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setThemeMode(newTheme);

    // Update resolved theme
    const isDark = newTheme === 'dark' ||
      (newTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setResolvedTheme(isDark ? 'dark' : 'light');
  };

  const setPrimaryColor = (color: ThemeName) => {
    setPrimaryColorState(color);
    setSystemPrimaryColor(color);
  };

  const setNeutralColor = (color: NeutralColor) => {
    setNeutralColorState(color);
    setSystemNeutralColor(color);
  };

  // Always render the provider to ensure context is available
  // Hydration mismatch is handled by the initial state matching server (auto)


  return (
    <ThemeContext.Provider value={{
      theme,
      resolvedTheme,
      setTheme,
      primaryColor,
      setPrimaryColor,
      neutralColor,
      setNeutralColor
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
