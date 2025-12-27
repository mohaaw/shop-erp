import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
    id: string;
    title: string;
    count?: number;
    children: React.ReactNode;
    className?: string;
    items: string[]; // IDs of items in this column for SortableContext
}

export function KanbanColumn({ id, title, count, children, className, items }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-secondary-900 dark:text-white">{title}</h3>
                    {count !== undefined && (
                        <span className="bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 text-xs px-2 py-0.5 rounded-full font-medium">
                            {count}
                        </span>
                    )}
                </div>
            </div>

            {/* Droppable Area */}
            <div
                ref={setNodeRef}
                className="flex-1 bg-secondary-50/50 dark:bg-secondary-900/50 rounded-xl p-2 border border-secondary-200 dark:border-secondary-800"
            >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-0 min-h-[150px]">
                        {children}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
}
