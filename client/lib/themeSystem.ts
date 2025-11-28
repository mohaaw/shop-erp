import { Theme, ThemeName, NeutralColor } from '@/types';

export type ThemeMode = Theme;

// Color palettes - each theme has ALL 11 shades (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
export const THEME_PALETTES: Record<ThemeName, Record<number, string>> = {
  blue: {
    50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD', 400: '#60A5FA',
    500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF', 900: '#1E3A8A', 950: '#172554'
  },
  green: {
    50: '#F0FDF4', 100: '#DCFCE7', 200: '#BBEF63', 300: '#86EFAC', 400: '#4ADE80',
    500: '#22C55E', 600: '#16A34A', 700: '#15803D', 800: '#166534', 900: '#145231', 950: '#052E16'
  },
  emerald: {
    50: '#F0FDF4', 100: '#DCFCE7', 200: '#BBEF63', 300: '#6EE7B7', 400: '#A7F3D0',
    500: '#10B981', 600: '#059669', 700: '#047857', 800: '#065F46', 900: '#064E3B', 950: '#022C1D'
  },
  teal: {
    50: '#F0FDFA', 100: '#CCFBF1', 200: '#99F6E4', 300: '#5EEAD4', 400: '#2DD4BF',
    500: '#14B8A6', 600: '#0D9488', 700: '#0F766E', 800: '#134E4A', 900: '#0D3E3A', 950: '#051F1F'
  },
  cyan: {
    50: '#ECFDF5', 100: '#CFFAFE', 200: '#A5F3FC', 300: '#67E8F9', 400: '#22D3EE',
    500: '#06B6D4', 600: '#0891B2', 700: '#0E7490', 800: '#155E75', 900: '#164E63', 950: '#082F49'
  },
  sky: {
    50: '#F0F9FF', 100: '#E0F2FE', 200: '#BAE6FD', 300: '#7DD3FC', 400: '#38BDF8',
    500: '#0EA5E9', 600: '#0284C7', 700: '#0369A1', 800: '#075985', 900: '#0C4A6E', 950: '#051E3E'
  },
  indigo: {
    50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC', 400: '#818CF8',
    500: '#6366F1', 600: '#4F46E5', 700: '#4338CA', 800: '#3730A3', 900: '#312E81', 950: '#1E1B4B'
  },
  violet: {
    50: '#F5F3FF', 100: '#EDE9FE', 200: '#DDD6FE', 300: '#C4B5FD', 400: '#A78BFA',
    500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9', 800: '#5B21B6', 900: '#4C1D95', 950: '#2E1065'
  },
  purple: {
    50: '#FAF5FF', 100: '#F3E8FF', 200: '#E9D5FF', 300: '#D8B4FE', 400: '#C084FC',
    500: '#A855F7', 600: '#9333EA', 700: '#7E22CE', 800: '#6B21A8', 900: '#581C87', 950: '#3F0F5C'
  },
  pink: {
    50: '#FDF2F8', 100: '#FCE7F3', 200: '#FBCFE8', 300: '#F8B4D6', 400: '#F472B6',
    500: '#EC4899', 600: '#DB2777', 700: '#BE185D', 800: '#9D174D', 900: '#831843', 950: '#500724'
  },
  rose: {
    50: '#FDF2F8', 100: '#FCE7F3', 200: '#FBCFE8', 300: '#F8B4D6', 400: '#F472B6',
    500: '#F43F5E', 600: '#E11D48', 700: '#BE123C', 800: '#9F1239', 900: '#881337', 950: '#500720'
  },
  red: {
    50: '#FEF2F2', 100: '#FEE2E2', 200: '#FECACA', 300: '#FCA5A5', 400: '#F87171',
    500: '#EF4444', 600: '#DC2626', 700: '#B91C1C', 800: '#991B1B', 900: '#7F1D1D', 950: '#450A0A'
  },
  orange: {
    50: '#FFF7ED', 100: '#FFEDD5', 200: '#FED7AA', 300: '#FDBA74', 400: '#FB923C',
    500: '#F97316', 600: '#EA580C', 700: '#C2410C', 800: '#9A3412', 900: '#7C2D12', 950: '#431407'
  },
  amber: {
    50: '#FFFAEB', 100: '#FCEFC7', 200: '#F8E295', 300: '#F3D262', 400: '#EBC038',
    500: '#D4AF37', 600: '#AA8C2C', 700: '#806921', 800: '#554616', 900: '#2B230B', 950: '#151105'
  },
  yellow: {
    50: '#FEFCE8', 100: '#FFFACD', 200: '#FFFF99', 300: '#FFFF66', 400: '#FFFF33',
    500: '#FACC15', 600: '#EAB308', 700: '#CA8A04', 800: '#A16207', 900: '#713F12', 950: '#422006'
  }
};

// Neutral palettes
export const NEUTRAL_PALETTES: Record<NeutralColor, Record<number, string>> = {
  slate: {
    50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8',
    500: '#64748B', 600: '#475569', 700: '#334155', 800: '#1E293B', 900: '#0F172A', 950: '#020617'
  },
  gray: {
    50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB', 300: '#D1D5DB', 400: '#9CA3AF',
    500: '#6B7280', 600: '#4B5563', 700: '#374151', 800: '#1F2937', 900: '#111827', 950: '#030712'
  },
  zinc: {
    50: '#FAFAFA', 100: '#F4F4F5', 200: '#E4E4E7', 300: '#D4D4D8', 400: '#A1A1AA',
    500: '#71717A', 600: '#52525B', 700: '#3F3F46', 800: '#27272A', 900: '#18181B', 950: '#09090B'
  },
  neutral: {
    50: '#FAFAFA', 100: '#F5F5F5', 200: '#E5E5E5', 300: '#D4D4D4', 400: '#A3A3A3',
    500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', 950: '#0A0A0A'
  },
  stone: {
    50: '#FAFAF9', 100: '#F5F5F4', 200: '#E7E5E4', 300: '#D6D3D1', 400: '#A8A29E',
    500: '#78716C', 600: '#57534E', 700: '#44403C', 800: '#292524', 900: '#1C1917', 950: '#0C0A09'
  }
};

// Preset themes combining primary + neutral + mode
export const PRESET_THEMES = [
  { name: 'Light Blue', mode: 'light' as const, primary: 'blue' as const, neutral: 'slate' as const },
  { name: 'Dark Blue', mode: 'dark' as const, primary: 'blue' as const, neutral: 'slate' as const },
  { name: 'Light Green', mode: 'light' as const, primary: 'green' as const, neutral: 'slate' as const },
  { name: 'Dark Green', mode: 'dark' as const, primary: 'green' as const, neutral: 'slate' as const },
  { name: 'Dark Gold', mode: 'dark' as const, primary: 'amber' as const, neutral: 'slate' as const },
  { name: 'Light Purple', mode: 'light' as const, primary: 'purple' as const, neutral: 'slate' as const },
  { name: 'Dark Purple', mode: 'dark' as const, primary: 'purple' as const, neutral: 'slate' as const },
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
export function getPrimaryColor(): ThemeName {
  if (typeof window === 'undefined') return 'blue';
  return (localStorage.getItem('theme-primary') as ThemeName) || 'blue';
}

/**
 * Get current neutral color from localStorage
 */
export function getNeutralColor(): keyof typeof NEUTRAL_PALETTES {
  if (typeof window === 'undefined') return 'slate';
  return (localStorage.getItem('theme-neutral') as any) || 'slate';
}

/**
 * Apply ALL CSS variables for primary and neutral colors (ALL 11 shades each)
 * This is the CORE of the theme system - sets --primary-50 through --primary-950, etc.
 */
export function applyCSSVariables(): void {
  if (typeof window === 'undefined') return;

  const primaryTheme = getPrimaryColor();
  const neutralTheme = getNeutralColor();

  const primaryPalette = THEME_PALETTES[primaryTheme];
  const neutralPalette = NEUTRAL_PALETTES[neutralTheme];

  if (!primaryPalette || !neutralPalette) {
    console.warn('Invalid theme colors:', { primaryTheme, neutralTheme });
    return;
  }

  const root = document.documentElement;

  // Apply ALL primary color shades (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
  Object.entries(primaryPalette).forEach(([shade, hex]) => {
    root.style.setProperty(`--primary-${shade}`, hex);
  });

  // Apply ALL neutral color shades
  Object.entries(neutralPalette).forEach(([shade, hex]) => {
    root.style.setProperty(`--secondary-${shade}`, hex);
  });

  console.log('✅ Theme applied:', { primaryTheme, neutralTheme });
}

/**
 * Set primary color and apply all CSS variables
 */
export function setPrimaryColor(color: ThemeName): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme-primary', color);
  applyCSSVariables();
}

/**
 * Set neutral color and apply all CSS variables
 */
export function setNeutralColor(color: keyof typeof NEUTRAL_PALETTES): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme-neutral', color);
  applyCSSVariables();
}

/**
 * Apply a preset theme (like "Dark Green", "Dark Gold", etc.)
 * This sets theme mode, primary color, and neutral color all at once
 */
export function applyPresetTheme(themeName: string): void {
  if (typeof window === 'undefined') return;

  const preset = PRESET_THEMES.find(t => t.name === themeName);
  if (!preset) {
    console.warn('Preset theme not found:', themeName);
    return;
  }

  setThemeMode(preset.mode);
  setPrimaryColor(preset.primary);
  setNeutralColor(preset.neutral);

  console.log('✅ Preset theme applied:', themeName);
}

/**
 * Initialize theme system on app load
 * Applies saved theme or defaults
 */
export function initializeTheme(): void {
  if (typeof window === 'undefined') return;

  // Apply theme mode first
  setThemeMode(getThemeMode());

  // Apply saved colors
  applyCSSVariables();

  console.log('✅ Theme initialized');
}