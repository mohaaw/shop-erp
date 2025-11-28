import { useTranslations } from 'next-intl';
import { AppearanceSettings } from '@/components/ui/appearance-settings';
import { Separator } from '@/components/ui/separator';

export default function AppearancePage() {
    const t = useTranslations('Settings.appearance');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">{t('title')}</h2>
                <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                    {t('subtitle')}
                </p>
            </div>

            <Separator />

            <div className="max-w-4xl">
                <AppearanceSettings />
            </div>
        </div>
    );
}
