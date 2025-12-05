'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

interface Activity {
    id: string;
    subject: string;
    type: string;
    date: string;
    status: string;
    leadName?: string;
    customerName?: string;
    description?: string;
}

interface ActivitiesClientProps {
    activities: Activity[];
}

export function ActivitiesClient({ activities }: ActivitiesClientProps) {
    const t = useTranslations('CRM.activities');

    const columns: ColumnDef<Activity>[] = [
        {
            accessorKey: 'subject',
            header: ({ column }) => <SortableHeader column={column}>{t('subject')}</SortableHeader>,
        },
        {
            accessorKey: 'type',
            header: t('type'),
        },
        {
            accessorKey: 'leadName',
            header: t('lead'),
            cell: ({ row }) => row.original.leadName || '-',
        },
        {
            accessorKey: 'customerName',
            header: t('customer'),
            cell: ({ row }) => row.original.customerName || '-',
        },
        {
            accessorKey: 'date',
            header: t('date'),
            cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
        },
        {
            accessorKey: 'status',
            header: t('status'),
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'completed' ? 'success' : 'default';
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
                <Link href="/dashboard/crm/activities/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newActivity')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={activities}
                searchKey="subject"
                searchPlaceholder={t('subject')}
            />
        </div>
    );
}
