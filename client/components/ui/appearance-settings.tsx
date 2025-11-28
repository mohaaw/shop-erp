'use client';

import React, { useState } from 'react';
import { useTheme } from '@/lib/theme';
import { THEME_PALETTES, NEUTRAL_PALETTES } from '@/lib/themeSystem';
import { ThemeName, NeutralColor } from '@/types';
import { cn } from '@/lib/utils';
import {
    Moon,
    Sun,
    Monitor,
    ChevronRight,
    Check,
    Paintbrush
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AppearanceSettingsProps {
    className?: string;
}

export function AppearanceSettings({ className }: AppearanceSettingsProps) {
    const { theme, setTheme, primaryColor, setPrimaryColor, neutralColor, setNeutralColor } = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeSection, setActiveSection] = useState<'theme' | 'primary' | 'neutral' | null>(null);
    const t = useTranslations('Appearance');
    const tCommon = useTranslations('Common');

    // Toggle main section
    const toggleExpanded = () => setIsExpanded(!isExpanded);

    // Toggle subsections
    const toggleSection = (section: 'theme' | 'primary' | 'neutral') => {
        setActiveSection(activeSection === section ? null : section);
    };

    return (
        <div className={cn('space-y-1', className)}>
            <button
                onClick={toggleExpanded}
                className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isExpanded
                        ? 'bg-primary-50 text-primary-900 dark:bg-primary-800 dark:text-white'
                        : 'text-secondary-700 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-800'
                )}
            >
                <Paintbrush className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 text-left">{t('title')}</span>
                <ChevronRight className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-90")} />
            </button>

            {isExpanded && (
                <div className="pl-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {/* Theme Mode */}
                    <div className="space-y-1">
                        <button
                            onClick={() => toggleSection('theme')}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-200 transition-colors"
                        >
                            <span>{t('themeMode')}</span>
                            <ChevronRight className={cn("w-3 h-3 transition-transform", activeSection === 'theme' && "rotate-90")} />
                        </button>

                        {activeSection === 'theme' && (
                            <div className="grid grid-cols-3 gap-1 px-2 pb-2">
                                {[
                                    { mode: 'light', icon: Sun, label: tCommon('light') },
                                    { mode: 'dark', icon: Moon, label: tCommon('dark') },
                                    { mode: 'auto', icon: Monitor, label: tCommon('system') },
                                ].map(({ mode, icon: Icon, label }) => (
                                    <button
                                        key={mode}
                                        onClick={() => setTheme(mode as any)}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-1 p-2 rounded-md border text-xs font-medium transition-all",
                                            theme === mode
                                                ? "bg-primary-100 border-primary-500 text-primary-900 dark:bg-primary-900 dark:border-primary-400 dark:text-white shadow-sm"
                                                : "bg-white border-secondary-200 text-secondary-600 hover:bg-secondary-50 dark:bg-secondary-900 dark:border-secondary-800 dark:text-secondary-400 dark:hover:bg-secondary-800"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Primary Color */}
                    <div className="space-y-1">
                        <button
                            onClick={() => toggleSection('primary')}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-200 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <span>{t('primaryColor')}</span>
                                <div className="w-2 h-2 rounded-full bg-primary-500" />
                            </div>
                            <ChevronRight className={cn("w-3 h-3 transition-transform", activeSection === 'primary' && "rotate-90")} />
                        </button>

                        {activeSection === 'primary' && (
                            <div className="grid grid-cols-5 gap-1 px-2 pb-2">
                                {Object.keys(THEME_PALETTES).map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setPrimaryColor(color as ThemeName)}
                                        className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                                            primaryColor === color ? "ring-2 ring-offset-1 ring-primary-500 dark:ring-offset-secondary-900" : ""
                                        )}
                                        style={{ backgroundColor: THEME_PALETTES[color as ThemeName][500] }}
                                        title={color}
                                    >
                                        {primaryColor === color && <Check className="w-3 h-3 text-white" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Neutral Color */}
                    <div className="space-y-1">
                        <button
                            onClick={() => toggleSection('neutral')}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-200 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <span>{t('neutralColor')}</span>
                                <div className="w-2 h-2 rounded-full bg-secondary-500" />
                            </div>
                            <ChevronRight className={cn("w-3 h-3 transition-transform", activeSection === 'neutral' && "rotate-90")} />
                        </button>

                        {activeSection === 'neutral' && (
                            <div className="grid grid-cols-5 gap-1 px-2 pb-2">
                                {Object.keys(NEUTRAL_PALETTES).map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setNeutralColor(color as NeutralColor)}
                                        className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                                            neutralColor === color ? "ring-2 ring-offset-1 ring-secondary-500 dark:ring-offset-secondary-900" : ""
                                        )}
                                        style={{ backgroundColor: NEUTRAL_PALETTES[color as NeutralColor][500] }}
                                        title={color}
                                    >
                                        {neutralColor === color && <Check className="w-3 h-3 text-white" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
