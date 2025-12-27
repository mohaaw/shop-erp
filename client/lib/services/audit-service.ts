import "server-only";


import { db } from '@/lib/db';
import { randomUUID } from 'crypto';

// Define types for audit logging
export interface AuditLog {
  id: string;
  userId: string;
  action: string; // e.g. 'CREATE', 'UPDATE', 'DELETE', 'READ'
  entity: string; // e.g. 'Product', 'Order', 'Customer'
  entityId: string;
  changes?: string; // JSON string of changes
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface AuditLogEntry {
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: Record<string, unknown>; // Object will be stringified

  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log an audit event
 */
export function logAuditEvent(data: AuditLogEntry): string {
  const id = randomUUID();
  const timestamp = new Date().toISOString();

  // Stringify changes object if it exists
  const changesStr = data.changes ? JSON.stringify(data.changes) : null;

  const stmt = db.prepare(`
    INSERT INTO AuditLog (id, userId, action, entity, entityId, changes, ipAddress, userAgent, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    data.userId,
    data.action,
    data.entity,
    data.entityId,
    changesStr,
    data.ipAddress || null,
    data.userAgent || null,
    timestamp
  );

  return id;
}

/**
 * Get audit logs for a specific entity
 */
export function getAuditLogsByEntity(entity: string, entityId: string): AuditLog[] {
  return db.prepare(`
    SELECT * FROM AuditLog 
    WHERE entity = ? AND entityId = ? 
    ORDER BY timestamp DESC
  `).all(entity, entityId) as AuditLog[];
}

/**
 * Get audit logs for a specific user
 */
export function getAuditLogsByUser(userId: string, limit: number = 50): AuditLog[] {
  return db.prepare(`
    SELECT * FROM AuditLog 
    WHERE userId = ? 
    ORDER BY timestamp DESC
    LIMIT ?
  `).all(userId, limit) as AuditLog[];
}

/**
 * Get recent audit logs (for dashboard)
 */
export function getRecentAuditLogs(limit: number = 10): AuditLog[] {
  return db.prepare(`
    SELECT * FROM AuditLog 
    ORDER BY timestamp DESC
    LIMIT ?
  `).all(limit) as AuditLog[];
}

/**
 * Get audit logs with filters
 */
export function getAuditLogs(filters: {
  userId?: string;
  action?: string;
  entity?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
} = {}): AuditLog[] {
  let query = `
    SELECT al.*, u.name as userName 
    FROM AuditLog al
    LEFT JOIN User u ON al.userId = u.id
  `;

  const conditions: string[] = [];
  const params: (string | number)[] = [];


  if (filters.userId) {
    conditions.push('al.userId = ?');
    params.push(filters.userId);
  }

  if (filters.action) {
    conditions.push('al.action = ?');
    params.push(filters.action);
  }

  if (filters.entity) {
    conditions.push('al.entity = ?');
    params.push(filters.entity);
  }

  if (filters.startDate) {
    conditions.push('al.timestamp >= ?');
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    conditions.push('al.timestamp <= ?');
    params.push(filters.endDate);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY al.timestamp DESC';

  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(filters.limit);

    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }
  }

  return db.prepare(query).all(...params) as AuditLog[];
}

/**
 * Log a change to an entity with detailed changes
 */
export function logEntityChange(userId: string, action: string, entity: string, entityId: string, oldValues?: Record<string, unknown>, newValues?: Record<string, unknown>, ipAddress?: string, userAgent?: string) {
  let changes: Record<string, unknown> | undefined = undefined;

  if (oldValues && newValues) {
    // Calculate what changed
    changes = {};
    const allKeys = new Set([...Object.keys(oldValues || {}), ...Object.keys(newValues || {})]);

    for (const key of allKeys) {
      const oldValue = oldValues?.[key];
      const newValue = newValues?.[key];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes[key] = {
          old: oldValue,
          new: newValue
        };
      }
    }
  } else if (newValues) {
    // For create operations
    changes = { ...newValues };
  }

  return logAuditEvent({
    userId,
    action,
    entity,
    entityId,
    changes,
    ipAddress,
    userAgent
  });
}

/**
 * Get audit trail for an entity with formatted changes
 */
export function getEntityAuditTrail(entity: string, entityId: string) {
  const logs = getAuditLogsByEntity(entity, entityId);

  return logs.map(log => ({
    ...log,
    changesObj: log.changes ? JSON.parse(log.changes) : null
  }));
}