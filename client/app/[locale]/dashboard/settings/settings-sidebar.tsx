'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import {
    Settings,
    Palette,
    User,
    Bell,
    Shield,
    ChevronRight,
    Webhook,
    Database,
    History,
    Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsSidebar() {
    const t = useTranslations('Settings.nav');
    const pathname = usePathname();

    const navItems = [
        {
            label: t('general'),
            href: '/dashboard/settings/general',
            icon: Settings,
        },
        {
            label: t('appearance'),
            href: '/dashboard/settings/appearance',
            icon: Palette,
        },
        {
            label: t('profile'),
            href: '/dashboard/settings/profile',
            icon: User,
        },
        {
            label: t('notifications'),
            href: '/dashboard/settings/notifications',
            icon: Bell,
        },
        {
            label: t('integrations'),
            href: '/dashboard/settings/integrations',
            icon: Webhook,
        },
        {
            label: t('data'),
            href: '/dashboard/settings/data',
            icon: Database,
        },
        {
            label: t('audit'),
            href: '/dashboard/settings/audit',
            icon: History,
        },
        {
            label: t('translations'),
            href: '/dashboard/settings/translations',
            icon: Globe,
        },
        {
            label: t('security'),
            href: '/dashboard/settings/security',
            icon: Shield,
        },
    ];

    return (
        <aside className="w-full lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
                                isActive
                                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                                    : "text-secondary-600 hover:bg-secondary-50 dark:text-secondary-400 dark:hover:bg-secondary-800/50"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("w-5 h-5", isActive ? "text-primary-600 dark:text-primary-400" : "text-secondary-400")} />
                                <span>{item.label}</span>
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4 text-primary-500" />}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
