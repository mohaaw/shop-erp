'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Download, Upload, Trash2 } from 'lucide-react';

export default function DataSettingsPage() {
    const t = useTranslations('Settings.data');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">{t('title')}</h2>
                <p className="text-secondary-600 dark:text-secondary-400">
                    {t('subtitle')}
                </p>
            </div>

            <div className="grid gap-6">
                {/* Export Data */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="w-5 h-5 text-primary-600" />
                            {t('exportData')}
                        </CardTitle>
                        <CardDescription>{t('exportDataDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
                            <p className="text-sm text-secondary-600 dark:text-secondary-300">
                                {t('exportNote')}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline">{t('exportCSV')}</Button>
                            <Button variant="outline">{t('exportJSON')}</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Import Data */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="w-5 h-5 text-primary-600" />
                            {t('importData')}
                        </CardTitle>
                        <CardDescription>{t('importDataDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border-2 border-dashed border-secondary-200 dark:border-secondary-700 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                            <p className="text-sm text-secondary-600 dark:text-secondary-400">
                                {t('dragDrop')}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200 dark:border-red-900/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <Trash2 className="w-5 h-5" />
                            {t('dangerZone')}
                        </CardTitle>
                        <CardDescription>{t('dangerZoneDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="danger">{t('deleteAccount')}</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
