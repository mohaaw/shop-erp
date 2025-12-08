'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface DashboardWidgetProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    style?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMouseDown?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMouseUp?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onTouchEnd?: any;
}

export function DashboardWidget({
    title,
    children,
    className,
    style,
    onMouseDown,
    onMouseUp,
    onTouchEnd,
    ...props
}: DashboardWidgetProps) {
    return (
        <Card
            className={cn('h-full flex flex-col', className)}
            style={style}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchEnd={onTouchEnd}
            {...props}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-move drag-handle">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <GripVertical className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-auto">
                {children}
            </CardContent>
        </Card>
    );
}
