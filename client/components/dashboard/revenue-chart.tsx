'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
    data: Array<{ name: string; revenue: number }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
