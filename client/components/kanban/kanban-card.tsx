import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface KanbanCardProps {
    id: string;
    children: React.ReactNode;
    className?: string;
}

export function KanbanCard({ id, children, className }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn('relative group', isDragging && 'opacity-50 z-50')}
            {...attributes}
        >
            <div
                className={cn(
                    "mb-3 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
                    className
                )}
            >
                <div
                    {...listeners}
                    className="absolute top-2 right-2 p-1 text-secondary-400 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing hover:bg-secondary-100 rounded"
                >
                    <GripVertical size={14} />
                </div>
                {children}
            </div>
        </div>
    );
}

export function KanbanCardContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("p-3", className)}>{children}</div>;
}
