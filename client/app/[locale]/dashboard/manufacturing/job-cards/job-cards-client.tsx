'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

interface JobCard {
    id: string;
    productionOrderNumber?: string;
    workstationName?: string;
    operation?: string;
    status: string;
    startTime?: string;
    endTime?: string;
}
interface JobCardsClientProps {
    jobCards: JobCard[];
}

export function JobCardsClient({ jobCards }: JobCardsClientProps) {
    const t = useTranslations('Manufacturing.jobCards');

    const columns: ColumnDef<JobCard>[] = [
        {
            accessorKey: 'productionOrderNumber',
            header: ({ column }) => <SortableHeader column={column}>{t('productionOrder')}</SortableHeader>,
            cell: ({ row }) => row.original.productionOrderNumber || '-',
        },
        {
            accessorKey: 'workstationName',
            header: t('workstation'),
            cell: ({ row }) => row.original.workstationName || '-',
        },
        {
            accessorKey: 'operation',
            header: t('operation'),
            cell: ({ row }) => row.original.operation || '-',
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
                <Link href="/dashboard/manufacturing/job-cards/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newJobCard')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={jobCards}
                searchKey="productionOrderNumber"
                searchPlaceholder={t('productionOrder')}
            />
        </div>
    );
}
