'use server';

import {
  createNotification,
  getUserNotifications,

  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getRecentNotifications,
  CreateNotificationData
} from '@/lib/services/notification-service';
// import { revalidatePath } from 'next/cache';

export async function createNotificationAction(data: CreateNotificationData) {
  try {
    const id = createNotification(data);

    return { success: true, id };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: 'Failed to create notification' };
  }
}

export async function getUserNotificationsAction(userId: string, limit: number = 20, offset: number = 0) {
  try {


    const notifications = getUserNotifications(userId, limit, offset);
    return { success: true, data: notifications };
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    return { success: false, error: 'Failed to fetch notifications' };
  }
}

export async function getUnreadNotificationsCountAction(userId: string) {
  try {


    const count = getUnreadNotificationsCount(userId);
    return { success: true, count };
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    return { success: false, error: 'Failed to fetch notifications count' };
  }
}

export async function markNotificationAsReadAction(notificationId: string, userId: string) {
  try {


    const success = markNotificationAsRead(notificationId, userId);
    if (success) {
      return { success: true };
    } else {
      return { success: false, error: 'Notification not found or already read' };
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: 'Failed to mark notification as read' };
  }
}

export async function markAllNotificationsAsReadAction(userId: string) {
  try {


    const success = markAllNotificationsAsRead(userId);
    if (success) {
      return { success: true };
    } else {
      return { success: false, error: 'Failed to mark all notifications as read' };
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error: 'Failed to mark all notifications as read' };
  }
}

export async function deleteNotificationAction(notificationId: string, userId: string) {
  try {
    // import removed


    const success = deleteNotification(notificationId, userId);
    if (success) {
      return { success: true };
    } else {
      return { success: false, error: 'Notification not found' };
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { success: false, error: 'Failed to delete notification' };
  }
}

export async function getRecentNotificationsAction(userId: string, limit: number = 5) {
  try {


    const notifications = getRecentNotifications(userId, limit);
    return { success: true, data: notifications };
  } catch (error) {
    console.error('Error fetching recent notifications:', error);
    return { success: false, error: 'Failed to fetch recent notifications' };
  }
}