'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Project } from '@/lib/services/project-service';
import { useTranslations } from 'next-intl';

interface ProjectsClientProps {
    projects: Project[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
    const t = useTranslations('Projects');

    const columns: ColumnDef<Project>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => <SortableHeader column={column}>{t('newProject').split(' ')[1] || 'Name'}</SortableHeader>,
        },
        {
            accessorKey: 'status',
            header: t('status'),
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'completed' ? 'success' : status === 'in_progress' ? 'default' : 'secondary';
                return <Badge variant={variant}>{status}</Badge>;
            },
        },
        {
            accessorKey: 'startDate',
            header: t('startDate'),
            cell: ({ row }) => {
                const date = row.original.startDate;
                return date ? new Date(date).toLocaleDateString() : '-';
            },
        },
        {
            accessorKey: 'endDate',
            header: t('endDate'),
            cell: ({ row }) => {
                const date = row.original.endDate;
                return date ? new Date(date).toLocaleDateString() : '-';
            },
        },
        {
            accessorKey: 'budget',
            header: t('budget'),
            cell: ({ row }) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(row.original.budget);
            },
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
                <Link href="/dashboard/projects/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newProject')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={projects}
                searchKey="name"
                searchPlaceholder={t('title')}
            />
        </div>
    );
}
