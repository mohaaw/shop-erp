import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export default function GeneralSettingsPage() {
    const t = useTranslations('Settings.general');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">{t('title')}</h2>
                <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                    {t('subtitle')}
                </p>
            </div>

            <Separator />

            <div className="space-y-6 max-w-2xl">
                <div className="space-y-2">
                    <Label htmlFor="storeName">{t('storeName')}</Label>
                    <Input id="storeName" defaultValue="My Awesome Store" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="supportEmail">{t('supportEmail')}</Label>
                    <Input id="supportEmail" type="email" defaultValue="support@example.com" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="currency">{t('currency')}</Label>
                        <Select defaultValue="usd">
                            <SelectTrigger id="currency">
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="usd">USD ($)</SelectItem>
                                <SelectItem value="eur">EUR (€)</SelectItem>
                                <SelectItem value="sar">SAR (﷼)</SelectItem>
                                <SelectItem value="aed">AED (د.إ)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="timezone">{t('timezone')}</Label>
                        <Select defaultValue="utc">
                            <SelectTrigger id="timezone">
                                <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                                <SelectItem value="est">EST (GMT-5)</SelectItem>
                                <SelectItem value="pst">PST (GMT-8)</SelectItem>
                                <SelectItem value="ast">AST (GMT+3)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="pt-4">
                    <Button>{t('save')}</Button>
                </div>
            </div>
        </div>
    );
}
