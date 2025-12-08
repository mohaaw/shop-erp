'use client';

import { Responsive, WidthProvider } from 'react-grid-layout';
import { useState, useEffect } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface WidgetGridProps {
    children: React.ReactNode;
}

export function WidgetGrid({ children }: WidgetGridProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Default layout for 3 columns (lg)
    const defaultLayout = [
        { i: 'stats', x: 0, y: 0, w: 12, h: 4 },
        { i: 'sales-chart', x: 0, y: 4, w: 8, h: 10 },
        { i: 'recent-orders', x: 8, y: 4, w: 4, h: 10 },
        { i: 'quick-actions', x: 0, y: 14, w: 12, h: 3 },
    ];

    const layouts = {
        lg: defaultLayout,
        md: defaultLayout,
        sm: defaultLayout,
    };

    if (!mounted) return null;

    return (
        <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}
            draggableHandle=".drag-handle"
            isDraggable={true}
            isResizable={true}
            margin={[16, 16]}
        >
            {children}
        </ResponsiveGridLayout>
    );
}
