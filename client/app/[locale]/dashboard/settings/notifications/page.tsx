import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function NotificationsSettingsPage() {
    const t = useTranslations('Settings.notifications');
    const tGeneral = useTranslations('Settings.general');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">{t('title')}</h2>
                <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                    {t('subtitle')}
                </p>
            </div>

            <Separator />

            <div className="space-y-8 max-w-2xl">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-white">{t('emailNotifications')}</h3>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">{t('orderUpdates')}</Label>
                            <p className="text-sm text-secondary-500">Receive emails about new orders and status changes.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">{t('securityAlerts')}</Label>
                            <p className="text-sm text-secondary-500">Receive emails about suspicious activity.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-white">{t('pushNotifications')}</h3>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">{t('orderUpdates')}</Label>
                            <p className="text-sm text-secondary-500">Receive push notifications for new orders.</p>
                        </div>
                        <Switch />
                    </div>
                </div>

                <div className="pt-4">
                    <Button>{tGeneral('save')}</Button>
                </div>
            </div>
        </div>
    );
}
