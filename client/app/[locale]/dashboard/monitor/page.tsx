'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { SystemHealthCharts } from '@/components/monitor/system-health-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Database, Server, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface SystemStats {
    cpu: number;
    ram: number;
    ramUsed: number;
    ramTotal: number;
    db: 'connected' | 'disconnected' | 'error';
    timestamp: string;
}

interface ChartDataPoint {
    time: string;
    value: number;
}

export default function MonitorPage() {
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [cpuHistory, setCpuHistory] = useState<ChartDataPoint[]>([]);
    const [ramHistory, setRamHistory] = useState<ChartDataPoint[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Connect to the backend socket
        // Assuming backend is running on port 3001
        const socket = io('http://localhost:3001', {
            withCredentials: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to system monitor socket');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from system monitor socket');
            setIsConnected(false);
        });

        socket.on('system_stats', (data: SystemStats) => {
            setStats(data);
            const timeLabel = format(new Date(data.timestamp), 'HH:mm:ss');

            setCpuHistory((prev) => {
                const newData = [...prev, { time: timeLabel, value: data.cpu }];
                return newData.slice(-30); // Keep last 30 data points
            });

            setRamHistory((prev) => {
                const newData = [...prev, { time: timeLabel, value: data.ram }];
                return newData.slice(-30); // Keep last 30 data points
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">System Monitor</h2>
                <p className="text-muted-foreground">
                    Real-time metrics from the application server.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Server Status</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isConnected ? (
                                <span className="text-green-500">Online</span>
                            ) : (
                                <span className="text-destructive">Offline</span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Socket connection state
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Database</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.db === 'connected' ? (
                                <Badge variant="success">Connected</Badge>
                            ) : stats?.db === 'error' ? (
                                <Badge variant="error">Error</Badge>
                            ) : (
                                <Badge variant="secondary">Unknown</Badge>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            SQLite Connection
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats ? `${stats.ramUsed} MB` : '-'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            of {stats ? stats.ramTotal : '-'} MB Total
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Update</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats ? format(new Date(stats.timestamp), 'HH:mm:ss') : '-'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Server Time
                        </p>
                    </CardContent>
                </Card>
            </div>

            <SystemHealthCharts cpuData={cpuHistory} ramData={ramHistory} />
        </div>
    );
}
