'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

interface LeaveApplication {
    id: string;
    employeeName?: string;
    type: string;
    startDate: string;
    endDate: string;
    reason?: string;
    status: string;
}

interface LeaveClientProps {
    leaves: LeaveApplication[];
}

export function LeaveClient({ leaves }: LeaveClientProps) {
    const t = useTranslations('HCM.leave');

    const columns: ColumnDef<LeaveApplication>[] = [
        {
            accessorKey: 'employeeName',
            header: ({ column }) => <SortableHeader column={column}>{t('employee')}</SortableHeader>,
            cell: ({ row }) => row.original.employeeName || '-',
        },
        {
            accessorKey: 'type',
            header: t('type'),
        },
        {
            accessorKey: 'startDate',
            header: t('startDate'),
            cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString(),
        },
        {
            accessorKey: 'endDate',
            header: t('endDate'),
            cell: ({ row }) => new Date(row.original.endDate).toLocaleDateString(),
        },
        {
            accessorKey: 'status',
            header: t('status'),
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'default';
                return <Badge variant={variant}>{status}</Badge>;
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
                <Link href="/dashboard/hcm/leave/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newLeave')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={leaves}
                searchKey="employeeName"
                searchPlaceholder={t('employee')}
            />
        </div>
    );
}
