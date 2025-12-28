import { AuditLogTable } from '@/components/audit/audit-log-table';
import { getAuditLogsAction } from '@/app/actions/audit-actions';
// import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AuditPage() {
    // const t = await getTranslations('Settings.audit');
    const logsResult = await getAuditLogsAction({ limit: 50 });

    const logs = logsResult.success && logsResult.data ? logsResult.data : [];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">Audit Log</h2>
                <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                    View and track system activity and changes.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                    <CardDescription>Recent system events and changes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AuditLogTable logs={logs} />
                </CardContent>
            </Card>
        </div>
    );
}
