import { getOpportunitiesAction } from '@/app/actions/crm-actions';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Opportunity } from '@/lib/services/crm-service';
import { getTranslations } from 'next-intl/server';

export default async function OpportunitiesPage() {
    const t = await getTranslations('CRM.opportunities');
    const opportunities = await getOpportunitiesAction();

    const columns: ColumnDef<Opportunity>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => <SortableHeader column={column}>{t('newOpportunity').split(' ')[1] || 'Name'}</SortableHeader>,
        },
        {
            accessorKey: 'stage',
            header: t('stage'),
            cell: ({ row }) => {
                const stage = row.original.stage;
                return <Badge>{stage}</Badge>;
            },
        },
        {
            accessorKey: 'expectedRevenue',
            header: t('expectedRevenue'),
            cell: ({ row }) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(row.original.expectedRevenue);
            },
        },
        {
            accessorKey: 'probability',
            header: t('probability'),
            cell: ({ row }) => `${row.original.probability}%`,
        },
        {
            accessorKey: 'expectedCloseDate',
            header: t('expectedClose'),
            cell: ({ row }) => {
                const date = row.original.expectedCloseDate;
                return date ? new Date(date).toLocaleDateString() : '-';
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
                <Link href="/dashboard/crm/opportunities/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newOpportunity')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={opportunities}
                searchKey="name"
                searchPlaceholder={t('title')}
            />
        </div>
    );
}
