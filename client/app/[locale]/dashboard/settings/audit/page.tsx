'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, ShieldAlert, UserCheck } from 'lucide-react';

export default function AuditSettingsPage() {
    const t = useTranslations('Settings.audit');

    const logs = [
        { id: 1, action: 'Login', user: 'Admin User', ip: '192.168.1.1', time: '2 mins ago', status: 'success' },
        { id: 2, action: 'Update Settings', user: 'Admin User', ip: '192.168.1.1', time: '1 hour ago', status: 'success' },
        { id: 3, action: 'Failed Login', user: 'Unknown', ip: '10.0.0.5', time: '3 hours ago', status: 'error' },
        { id: 4, action: 'Export Data', user: 'Admin User', ip: '192.168.1.1', time: '1 day ago', status: 'success' },
        { id: 5, action: 'Update Profile', user: 'Admin User', ip: '192.168.1.1', time: '2 days ago', status: 'success' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">{t('title')}</h2>
                <p className="text-secondary-600 dark:text-secondary-400">
                    {t('subtitle')}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="w-5 h-5 text-primary-600" />
                        {t('activityLog')}
                    </CardTitle>
                    <CardDescription>{t('activityLogDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {logs.map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${log.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {log.status === 'success' ? <UserCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-secondary-900 dark:text-white">{log.action}</p>
                                        <p className="text-sm text-secondary-500">{log.user} • {log.ip}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant={log.status === 'success' ? 'success' : 'error'}>
                                        {log.status}
                                    </Badge>
                                    <p className="text-xs text-secondary-400 mt-1">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
