'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

interface Task {
    id: string;
    title: string;
    projectName?: string;
    status: string;
    priority: string;
    dueDate?: string;
    description?: string;
    assignedTo?: string;
}

interface TasksClientProps {
    tasks: Task[];
}

export function TasksClient({ tasks }: TasksClientProps) {
    const t = useTranslations('Projects.tasks');

    const columns: ColumnDef<Task>[] = [
        {
            accessorKey: 'title',
            header: ({ column }) => <SortableHeader column={column}>{t('taskTitle')}</SortableHeader>,
        },
        {
            accessorKey: 'projectName',
            header: t('project'),
            cell: ({ row }) => row.original.projectName || '-',
        },
        {
            accessorKey: 'priority',
            header: t('priority'),
            cell: ({ row }) => {
                const priority = row.original.priority;
                const variant = priority === 'high' ? 'error' : priority === 'medium' ? 'default' : 'secondary';
                return <Badge variant={variant}>{priority}</Badge>;
            },
        },
        {
            accessorKey: 'status',
            header: t('status'),
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'done' ? 'success' : 'default';
                return <Badge variant={variant}>{status}</Badge>;
            },
        },
        {
            accessorKey: 'dueDate',
            header: t('dueDate'),
            cell: ({ row }) => row.original.dueDate ? new Date(row.original.dueDate).toLocaleDateString() : '-',
        },
    ];

    return (
        <div className="space-y-6">
            <BackButton fallbackUrl="/dashboard" />
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                    <p className="text-muted-foreground">
                        {t('subtitle')}
                    </p>
                </div>
                <Link href="/dashboard/projects/tasks/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newTask')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={tasks}
                searchKey="title"
                searchPlaceholder={t('taskTitle')}
            />
        </div>
    );
}
