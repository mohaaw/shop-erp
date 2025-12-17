'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSocket } from '@/lib/socket-provider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';

interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: string;
    link?: string;
}

import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { getRecentNotificationsAction, markAllNotificationsAsReadAction, markNotificationAsReadAction } from '@/app/actions/notification-actions';

export function NotificationCenter() {
    const t = useTranslations('Notifications');
    const { data: session } = useSession();
    const { socket } = useSocket();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchData = async () => {
            try {
                const result = await getRecentNotificationsAction(session.user.id);
                if (result.success && result.data) {
                    setNotifications(result.data);
                    // Count unread notifications
                    const unread = result.data.filter(n => !n.read).length;
                    setUnreadCount(unread);
                } else {
                    setNotifications([]);
                    setUnreadCount(0);
                }
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        fetchData();
    }, [session]);

    useEffect(() => {
        if (!socket || !session?.user?.id) return;

        socket.on('receive_notification', (notification: Notification) => {
            setNotifications((prev) => [notification, ...prev.slice(0, 9)]); // Keep only 10 latest
            setUnreadCount((prev) => prev + 1);
        });

        return () => {
            socket.off('receive_notification');
        };
    }, [socket, session]);

    const markAllAsRead = async () => {
        if (!session?.user?.id) return;

        try {
            const result = await markAllNotificationsAsReadAction(session.user.id);
            if (result.success) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Failed to mark notifications as read:', error);
        }
    };

    const markOneAsRead = async (notificationId: string) => {
        try {
            const result = await markNotificationAsReadAction(notificationId, session!.user.id);
            if (result.success) {
                setNotifications(prev =>
                    prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        markOneAsRead(notification.id);
        if (notification.link) {
            router.push(notification.link);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="error"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>{t('title')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-xs text-muted-foreground">
                        {notifications.length} {t('notifications')}
                    </span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="h-auto p-1 text-xs"
                        >
                            {t('markAllRead')}
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            {t('empty')}
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!notification.read ? 'bg-secondary-100 dark:bg-secondary-700/50' : ''}`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <div className={`w-2 h-2 rounded-full ${!notification.read ? 'bg-primary' : 'bg-transparent'}`}></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{notification.title}</div>
                                    </div>
                                    <Badge variant={notification.type} size="sm">
                                        {notification.type}
                                    </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground w-full pr-6">
                                    {notification.message}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1 w-full">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="w-full text-center cursor-pointer justify-center text-primary"
                    onClick={() => router.push('/dashboard/team')}
                >
                    {t('viewAll')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
