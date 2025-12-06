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
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

import { useTranslations } from 'next-intl';

export function NotificationCenter() {
    const t = useTranslations('Notifications');
    const { socket } = useSocket();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (!socket) return;

        socket.on('receive_notification', (notification: Notification) => {
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((prev) => prev + 1);
        });

        return () => {
            socket.off('receive_notification');
        };
    }, [socket]);

    const markAsRead = () => {
        setUnreadCount(0);
        // TODO: Call API to mark as read
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" onClick={markAsRead}>
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="error"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>{t('title')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            {t('empty')}
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                                onClick={() => router.push('/dashboard/team')}
                            >
                                <div className="font-medium">{notification.title}</div>
                                <div className="text-sm text-muted-foreground">
                                    {notification.message}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {new Date(notification.createdAt).toLocaleTimeString()}
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
