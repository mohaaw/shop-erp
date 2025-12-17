'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardWidget } from './dashboard-widget';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { getRecentAuditLogsAction } from '@/app/actions/audit-actions';

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  userName?: string;
  timestamp: string;
}

export function AuditTrailWidget() {
  const t = useTranslations('Dashboard');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const result = await getRecentAuditLogsAction();
        if (result.success && result.data) {
          setAuditLogs(result.data);
        } else {
          setAuditLogs([]);
        }
      } catch (error) {
        console.error('Failed to fetch audit logs:', error);
        setAuditLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  const getActionColor = (action: string) => {
    switch (action?.toUpperCase()) {
      case 'CREATE':
        return 'success';
      case 'UPDATE':
        return 'warning';
      case 'DELETE':
        return 'error';
      default:
        return 'secondary';
    }
  };

  return (
    <DashboardWidget title={t('auditTrail.title')}>
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-sm text-muted-foreground">{t('loading')}</div>
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Activity className="w-8 h-8 text-muted-foreground mb-2" />
            <h4 className="font-semibold text-secondary-900 dark:text-white">
              {t('auditTrail.noActivity')}
            </h4>
            <p className="text-sm text-secondary-500 mt-1">
              {t('auditTrail.noActivityDesc')}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-1.5 bg-secondary-100 dark:bg-secondary-700 rounded-full mt-0.5">
                      <Activity className="w-3 h-3 text-secondary-600 dark:text-secondary-300" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-secondary-900 dark:text-white truncate">
                          {log.userName || `User ${log.userId.substring(0, 8)}`}
                        </span>
                        <Badge variant={getActionColor(log.action)} size="sm">
                          {log.action}
                        </Badge>
                      </div>
                      <p className="text-xs text-secondary-500 truncate">
                        {log.entity} #{log.entityId}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-xs text-secondary-500">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </DashboardWidget>
  );
}