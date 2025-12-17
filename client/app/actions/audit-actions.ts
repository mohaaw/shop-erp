'use server';

// import { revalidatePath } from 'next/cache';
import {
  getRecentAuditLogs,
  getAuditLogsByUser,
  getAuditLogsByEntity,
  getAuditLogs as getAllAuditLogs,
  logAuditEvent,
  logEntityChange,
  AuditLogEntry
} from '@/lib/services/audit-service';

export async function logAuditAction(data: AuditLogEntry) {
  try {
    const id = logAuditEvent(data);
    // No need to revalidate as this is just logging
    return { success: true, id };
  } catch (error) {
    console.error('Error logging audit event:', error);
    return { success: false, error: 'Failed to log audit event' };
  }
}

export async function getRecentAuditLogsAction(limit: number = 10) {
  try {
    // Dynamically import removed as service handles it


    const logs = getRecentAuditLogs(limit);
    return { success: true, data: logs };
  } catch (error) {
    console.error('Error fetching recent audit logs:', error);
    return { success: false, error: 'Failed to fetch audit logs' };
  }
}

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

    const logs = getAllAuditLogs(filters);
    return { success: true, data: logs };
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return { success: false, error: 'Failed to fetch audit logs' };
  }
}

export async function getAuditLogsByUserAction(userId: string, limit: number = 50) {
  try {

    const logs = getAuditLogsByUser(userId, limit);
    return { success: true, data: logs };
  } catch (error) {
    console.error('Error fetching user audit logs:', error);
    return { success: false, error: 'Failed to fetch user audit logs' };
  }
}

export async function getAuditLogsByEntityAction(entity: string, entityId: string) {
  try {

    const logs = getAuditLogsByEntity(entity, entityId);
    return { success: true, data: logs };
  } catch (error) {
    console.error('Error fetching entity audit logs:', error);
    return { success: false, error: 'Failed to fetch entity audit logs' };
  }
}

export async function logEntityChangeAction(
  userId: string,
  action: string,
  entity: string,
  entityId: string,
  oldValues?: Record<string, unknown>,
  newValues?: Record<string, unknown>,

  ipAddress?: string,
  userAgent?: string
) {
  try {
    const id = logEntityChange(userId, action, entity, entityId, oldValues, newValues, ipAddress, userAgent);
    // No need to revalidate as this is just logging
    return { success: true, id };
  } catch (error) {
    console.error('Error logging entity change:', error);
    return { success: false, error: 'Failed to log entity change' };
  }
}