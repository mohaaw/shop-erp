'use server';

import { auditService } from '@/lib/services/audit-service';

export async function getAuditLogsAction(filters: {
  userId?: string;
  action?: string;
  entity?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
} = {}) {
  try {
    const logs = auditService.getAuditLogs(filters);
    return { success: true, data: logs };
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return { success: false, error: 'Failed to fetch audit logs' };
  }
}

export async function getRecentAuditLogsAction() {
  try {
    const logs = auditService.getRecentAuditLogs();
    return { success: true, data: logs };
  } catch (error) {
    console.error('Failed to fetch recent audit logs:', error);
    return { success: false, error: 'Failed to fetch recent audit logs' };
  }
}