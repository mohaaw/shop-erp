import "server-only";


import { db } from '@/lib/db';
import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string; // Optional link for the notification
}

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  link?: string;
}

/**
 * Create a new notification
 */
export function createNotification(data: CreateNotificationData): string {
  const id = randomUUID();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO Notification (id, userId, title, message, type, read, createdAt, link)
    VALUES (?, ?, ?, ?, ?, 0, ?, ?)
  `);

  stmt.run(
    id,
    data.userId,
    data.title,
    data.message,
    data.type || 'info',
    now,
    data.link || null
  );

  // Revalidate any pages that might show notifications
  revalidatePath(`/dashboard`);

  return id;
}

/**
 * Get notifications for a user
 */
export function getUserNotifications(userId: string, limit: number = 20, offset: number = 0): Notification[] {
  return db.prepare(`
    SELECT * FROM Notification
    WHERE userId = ?
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `).all(userId, limit, offset) as Notification[];
}

/**
 * Get unread notifications count for a user
 */
export function getUnreadNotificationsCount(userId: string): number {
  const result = db.prepare(`
    SELECT COUNT(*) as count FROM Notification
    WHERE userId = ? AND read = 0
  `).get(userId) as { count: number };

  return result?.count || 0;
}

/**
 * Mark a notification as read
 */
export function markNotificationAsRead(notificationId: string, userId: string): boolean {
  const result = db.prepare(`
    UPDATE Notification
    SET read = 1
    WHERE id = ? AND userId = ?
  `).run(notificationId, userId);

  revalidatePath(`/dashboard`);
  return result.changes > 0;
}

/**
 * Mark all notifications for a user as read
 */
export function markAllNotificationsAsRead(userId: string): boolean {
  const result = db.prepare(`
    UPDATE Notification
    SET read = 1
    WHERE userId = ? AND read = 0
  `).run(userId);

  revalidatePath(`/dashboard`);
  return result.changes > 0;
}

/**
 * Delete a notification
 */
export function deleteNotification(notificationId: string, userId: string): boolean {
  const result = db.prepare(`
    DELETE FROM Notification
    WHERE id = ? AND userId = ?
  `).run(notificationId, userId);

  revalidatePath(`/dashboard`);
  return result.changes > 0;
}

/**
 * Get recent notifications for dashboard
 */
export function getRecentNotifications(userId: string, limit: number = 5): Notification[] {
  return db.prepare(`
    SELECT * FROM Notification
    WHERE userId = ?
    ORDER BY createdAt DESC
    LIMIT ?
  `).all(userId, limit) as Notification[];
}

// Create a table for notifications if it doesn't exist (migration)
export function ensureNotificationTable() {
  const createNotificationTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS Notification (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      read INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      link TEXT,
      FOREIGN KEY (userId) REFERENCES User(id)
    )
  `);
  createNotificationTable.run();
}