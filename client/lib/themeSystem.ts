/**
 * Complete Theme System
 * Handles light/dark mode AND primary/neutral color selection
 * Works without ThemeProvider context - fully independent
 */

export type ThemeMode = 'light' | 'dark' | 'auto';

export const PRIMARY_COLORS = [
  { name: 'Red', value: 'red', hex: '#EF4444' },
  { name: 'Orange', value: 'orange', hex: '#F97316' },
  { name: 'Amber', value: 'amber', hex: '#FBBF24' },
  { name: 'Yellow', value: 'yellow', hex: '#FACC15' },
  { name: 'Lime', value: 'lime', hex: '#84CC16' },
  { name: 'Green', value: 'green', hex: '#22C55E' },
  { name: 'Emerald', value: 'emerald', hex: '#10B981' },
  { name: 'Teal', value: 'teal', hex: '#14B8A6' },
  { name: 'Cyan', value: 'cyan', hex: '#06B6D4' },
  { name: 'Sky', value: 'sky', hex: '#0EA5E9' },
  { name: 'Blue', value: 'blue', hex: '#3B82F6' },
  { name: 'Indigo', value: 'indigo', hex: '#6366F1' },
  { name: 'Violet', value: 'violet', hex: '#8B5CF6' },
  { name: 'Purple', value: 'purple', hex: '#A855F7' },
  { name: 'Fuchsia', value: 'fuchsia', hex: '#D946EF' },
  { name: 'Pink', value: 'pink', hex: '#EC4899' },
  { name: 'Rose', value: 'rose', hex: '#F43F5E' },
];

export const NEUTRAL_COLORS = [
  { name: 'Slate', value: 'slate', hex: '#64748B' },
  { name: 'Gray', value: 'gray', hex: '#6B7280' },
  { name: 'Zinc', value: 'zinc', hex: '#71717A' },
  { name: 'Neutral', value: 'neutral', hex: '#737373' },
  { name: 'Stone', value: 'stone', hex: '#78716C' },
];

/**
 * Get current theme mode from localStorage
 */
export function getThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'auto';
  return (localStorage.getItem('theme-mode') as ThemeMode) || 'auto';
}

/**
 * Set theme mode and apply it to DOM
 */
export function setThemeMode(mode: ThemeMode): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem('theme-mode', mode);

  const html = document.documentElement;
  const isDark = mode === 'dark' || 
    (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

/**
 * Get current primary color from localStorage
 */
export function getPrimaryColor(): string {
  if (typeof window === 'undefined') return 'blue';
  return localStorage.getItem('theme-primary') || 'blue';
}

/**
 * Get current neutral color from localStorage
 */
export function getNeutralColor(): string {
  if (typeof window === 'undefined') return 'slate';
  return localStorage.getItem('theme-neutral') || 'slate';
}

/**
 * Set primary color and apply CSS variables
 */
export function setPrimaryColor(color: string): void {
  if (typeof window === 'undefined') return;

  const colorObj = PRIMARY_COLORS.find(c => c.value === color);
  if (!colorObj) return;

  localStorage.setItem('theme-primary', color);
  applyCSSVariables();
}

/**
 * Set neutral color and apply CSS variables
 */
export function setNeutralColor(color: string): void {
  if (typeof window === 'undefined') return;

  const colorObj = NEUTRAL_COLORS.find(c => c.value === color);
  if (!colorObj) return;

  localStorage.setItem('theme-neutral', color);
  applyCSSVariables();
}

/**
 * Apply all CSS variables to root element
 */
export function applyCSSVariables(): void {
  if (typeof window === 'undefined') return;

  const primary = getPrimaryColor();
  const neutral = getNeutralColor();

  const primaryColor = PRIMARY_COLORS.find(c => c.value === primary);
  const neutralColor = NEUTRAL_COLORS.find(c => c.value === neutral);

  if (!primaryColor || !neutralColor) return;

  const root = document.documentElement;
  root.style.setProperty('--color-primary', primaryColor.hex);
  root.style.setProperty('--color-neutral', neutralColor.hex);
}

/**
 * Initialize theme system on app load
 */
export function initThemeSystem(): void {
  if (typeof window === 'undefined') return;

  // Apply theme mode
  const themeMode = getThemeMode();
  setThemeMode(themeMode);

  // Apply colors
  applyCSSVariables();

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = () => {
    const mode = getThemeMode();
    if (mode === 'auto') {
      setThemeMode('auto');
    }
  };

  mediaQuery.addEventListener('change', handleChange);
}

