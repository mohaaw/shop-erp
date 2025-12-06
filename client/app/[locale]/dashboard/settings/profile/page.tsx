import { getTranslations } from 'next-intl/server';
import { Separator } from '@/components/ui/separator';
import { ProfileForm } from './profile-form';
import { getCurrentUserAction } from '@/app/actions/user-actions';

export default async function ProfileSettingsPage() {
    const t = await getTranslations('Settings.profile');
    const user = await getCurrentUserAction();

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">{t('title')}</h2>
                <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                    {t('subtitle')}
                </p>
            </div>

            <Separator />

            <ProfileForm user={user} />
        </div>
    );
}
