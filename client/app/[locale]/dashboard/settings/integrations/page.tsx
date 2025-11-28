'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Webhook, Key, Plug } from 'lucide-react';

export default function IntegrationsSettingsPage() {
    const t = useTranslations('Settings.integrations');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">{t('title')}</h2>
                <p className="text-secondary-600 dark:text-secondary-400">
                    {t('subtitle')}
                </p>
            </div>

            <div className="grid gap-6">
                {/* API Keys */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="w-5 h-5 text-primary-600" />
                            {t('apiKeys')}
                        </CardTitle>
                        <CardDescription>{t('apiKeysDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                            <div>
                                <p className="font-medium text-secondary-900 dark:text-white">Public API Key</p>
                                <p className="text-sm text-secondary-500 font-mono mt-1">pk_live_...</p>
                            </div>
                            <Button variant="outline" size="sm">{t('regenerate')}</Button>
                        </div>
                        <Button>{t('createNewKey')}</Button>
                    </CardContent>
                </Card>

                {/* Webhooks */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Webhook className="w-5 h-5 text-primary-600" />
                            {t('webhooks')}
                        </CardTitle>
                        <CardDescription>{t('webhooksDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-secondary-500">
                            {t('noWebhooks')}
                        </div>
                        <Button variant="outline" fullWidth>{t('addWebhook')}</Button>
                    </CardContent>
                </Card>

                {/* Connected Apps */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plug className="w-5 h-5 text-primary-600" />
                            {t('connectedApps')}
                        </CardTitle>
                        <CardDescription>{t('connectedAppsDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {['Shopify', 'Stripe', 'Slack'].map((app) => (
                            <div key={app} className="flex items-center justify-between p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-800 rounded-lg flex items-center justify-center">
                                        <span className="font-bold text-secondary-600 dark:text-secondary-400">{app[0]}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-secondary-900 dark:text-white">{app}</p>
                                        <p className="text-sm text-secondary-500">{t('notConnected')}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">{t('connect')}</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
