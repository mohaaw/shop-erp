'use client';

import { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/lib/socket-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Bell, User as UserIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Message {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    createdAt: string;
}

interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: 'normal' | 'high' | 'urgent';
    createdAt: string;
}

import { useTranslations } from 'next-intl';

export default function TeamHubPage() {
    const t = useTranslations('TeamHub');
    const { socket, isConnected } = useSocket();
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!socket) return;

        socket.on('receive_message', (message: Message) => {
            setMessages((prev) => [...prev, message]);
            // Scroll to bottom
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        });

        socket.on('receive_announcement', (announcement: Announcement) => {
            setAnnouncements((prev) => [announcement, ...prev]);
        });

        return () => {
            socket.off('receive_message');
            socket.off('receive_announcement');
        };
    }, [socket]);

    const sendMessage = () => {
        if (!newMessage.trim() || !socket || !session?.user) return;

        const messageData = {
            content: newMessage,
            senderId: session.user.id || 'anonymous',
            senderName: session.user.name || 'Anonymous',
        };

        socket.emit('send_message', messageData);
        setNewMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 h-[calc(100vh-4rem)]">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{t('title')}</h1>
                <Badge variant={isConnected ? 'default' : 'error'}>
                    {isConnected ? t('connected') : t('disconnected')}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100%-4rem)]">
                {/* Chat Section */}
                <Card className="md:col-span-2 flex flex-col h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5" />
                            {t('chatTitle')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                        <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3 ${msg.senderId === session?.user?.id ? 'flex-row-reverse' : ''
                                            }`}
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{msg.senderName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div
                                            className={`rounded-lg p-3 max-w-[80%] ${msg.senderId === session?.user?.id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'
                                                }`}
                                        >
                                            <p className="text-xs opacity-70 mb-1">{msg.senderName}</p>
                                            <p className="text-sm">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>
                        <div className="flex gap-2 pt-4 border-t">
                            <Input
                                placeholder={t('placeholder')}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <Button onClick={sendMessage} size="icon">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Announcements Section */}
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            {t('announcements')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full pr-4">
                            <div className="space-y-4">
                                {announcements.length === 0 && (
                                    <p className="text-muted-foreground text-center py-8">
                                        {t('noAnnouncements')}
                                    </p>
                                )}
                                {announcements.map((announcement) => (
                                    <Card key={announcement.id} className="bg-muted/50">
                                        <CardContent className="p-4 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold">{announcement.title}</h3>
                                                <Badge
                                                    variant={
                                                        announcement.priority === 'urgent'
                                                            ? 'error'
                                                            : announcement.priority === 'high'
                                                                ? 'default'
                                                                : 'secondary'
                                                    }
                                                >
                                                    {announcement.priority}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {announcement.content}
                                            </p>
                                            <p className="text-xs text-muted-foreground pt-2">
                                                {new Date(announcement.createdAt).toLocaleDateString()}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
