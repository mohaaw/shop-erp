'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/lib/stores/settings-store';
import { applyTheme } from '@/lib/theme-generator';

export function ThemeManager() {
    const { primaryColor, secondaryColor } = useSettingsStore();

    useEffect(() => {
        applyTheme(primaryColor, secondaryColor);
    }, [primaryColor, secondaryColor]);

    return null;
}
