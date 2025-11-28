import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function SecuritySettingsPage() {
    const t = useTranslations('Settings.security');
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
                {/* Change Password */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-white">{t('changePassword')}</h3>

                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">{t('currentPassword')}</Label>
                        <Input id="currentPassword" type="password" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">{t('newPassword')}</Label>
                            <Input id="newPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                            <Input id="confirmPassword" type="password" />
                        </div>
                    </div>

                    <Button variant="outline">{t('changePassword')}</Button>
                </div>

                <Separator />

                {/* 2FA */}
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base">{t('twoFactor')}</Label>
                        <p className="text-sm text-secondary-500">Add an extra layer of security to your account.</p>
                    </div>
                    <Switch />
                </div>

                <Separator />

                {/* Active Sessions */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-white">{t('activeSessions')}</h3>
                    <div className="bg-secondary-50 dark:bg-secondary-800/50 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <div>
                                <p className="text-sm font-medium text-secondary-900 dark:text-white">Windows PC - Chrome</p>
                                <p className="text-xs text-secondary-500">Cairo, Egypt • Active now</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Revoke</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
