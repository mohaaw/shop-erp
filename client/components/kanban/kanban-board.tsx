'use client';

import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    DragStartEvent,
    DragEndEvent,
    closestCorners
} from '@dnd-kit/core';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface KanbanBoardProps {
    children: React.ReactNode;
    onDragEnd: (event: DragEndEvent) => void;
    overlay?: React.ReactNode; // Optional custom overlay
}

export function KanbanBoard({ children, onDragEnd, overlay }: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Start dragging after 5px movement
            },
        })
    );

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveId(null);
        onDragEnd(event);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full gap-4 overflow-x-auto pb-4">
                {children}
            </div>

            {/* Drag Overlay */}
            {typeof window !== 'undefined' && createPortal(
                <DragOverlay>
                    {activeId && overlay}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
}
