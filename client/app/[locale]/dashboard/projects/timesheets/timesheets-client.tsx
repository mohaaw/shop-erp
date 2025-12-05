'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

interface Timesheet {
    id: string;
    projectName?: string;
    taskTitle?: string;
    date: string;
    hours: number;
    description?: string;
}

interface TimesheetsClientProps {
    timesheets: Timesheet[];
}

export function TimesheetsClient({ timesheets }: TimesheetsClientProps) {
    const t = useTranslations('Projects.timesheets');

    const columns: ColumnDef<Timesheet>[] = [
        {
            accessorKey: 'date',
            header: ({ column }) => <SortableHeader column={column}>{t('date')}</SortableHeader>,
            cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
        },
        {
            accessorKey: 'projectName',
            header: t('project'),
            cell: ({ row }) => row.original.projectName || '-',
        },
        {
            accessorKey: 'taskTitle',
            header: t('task'),
            cell: ({ row }) => row.original.taskTitle || '-',
        },
        {
            accessorKey: 'hours',
            header: t('hours'),
        },
        {
            accessorKey: 'description',
            header: t('description'),
            cell: ({ row }) => row.original.description || '-',
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
                <Link href="/dashboard/projects/timesheets/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newTimesheet')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={timesheets}
                searchKey="projectName"
                searchPlaceholder={t('project')}
            />
        </div>
    );
}
