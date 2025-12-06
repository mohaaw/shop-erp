'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useSettingsStore } from '@/lib/stores/settings-store';
import { updateSettingsAction, getSettingsAction } from '@/app/actions/settings-actions';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function GeneralSettingsPage() {
    const t = useTranslations('Settings.general');
    const { storeName, setSettings } = useSettingsStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        supportEmail: '',
        currency: 'usd',
        timezone: 'utc',
    });

    useEffect(() => {
        const fetchSettings = async () => {
            const settings = await getSettingsAction();
            if (settings) {
                setSettings(settings);
                setFormData({
                    supportEmail: settings.supportEmail || '',
                    currency: settings.currency,
                    timezone: settings.timezone,
                });
            }
        };
        fetchSettings();
    }, [setSettings]);

    const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({ storeName: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const result = await updateSettingsAction({
                storeName,
                ...formData,
            });

            if (result.success) {
                toast.success('Settings saved successfully');
            } else {
                toast.error('Failed to save settings');
            }
        } catch {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

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
                    <Input
                        id="storeName"
                        value={storeName}
                        onChange={handleStoreNameChange}
                        placeholder="My Awesome Store"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="supportEmail">{t('supportEmail')}</Label>
                    <Input
                        id="supportEmail"
                        type="email"
                        value={formData.supportEmail}
                        onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                        placeholder="support@example.com"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="currency">{t('currency')}</Label>
                        <Select
                            value={formData.currency}
                            onValueChange={(val) => setFormData({ ...formData, currency: val })}
                        >
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
                        <Select
                            value={formData.timezone}
                            onValueChange={(val) => setFormData({ ...formData, timezone: val })}
                        >
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
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : t('save')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
