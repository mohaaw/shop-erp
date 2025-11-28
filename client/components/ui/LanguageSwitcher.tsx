'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLanguage = () => {
        const newLocale = locale === 'en' ? 'ar' : 'en';
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="w-full justify-start gap-3 px-3"
        >
            <Languages className="w-5 h-5" />
            <span>{locale === 'en' ? 'العربية' : 'English'}</span>
        </Button>
    );
}
