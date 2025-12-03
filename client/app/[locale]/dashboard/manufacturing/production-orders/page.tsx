import { getProductionOrdersAction } from '@/app/actions/manufacturing-actions';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { ProductionOrder } from '@/lib/services/manufacturing-service';
import { getTranslations } from 'next-intl/server';

export default async function ProductionOrdersPage() {
    const t = await getTranslations('Manufacturing.productionOrders');
    const orders = await getProductionOrdersAction();

    const columns: ColumnDef<ProductionOrder>[] = [
        {
            accessorKey: 'number',
            header: ({ column }) => <SortableHeader column={column}>{t('orderNumber')}</SortableHeader>,
        },
        {
            accessorKey: 'productName',
            header: 'Product', // Need to add key if missing, or reuse BOM product key
        },
        {
            accessorKey: 'quantity',
            header: 'Quantity',
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
            accessorKey: 'plannedStartDate',
            header: t('plannedStart'),
            cell: ({ row }) => {
                const date = row.original.plannedStartDate;
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
                <Link href="/dashboard/manufacturing/production-orders/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newOrder')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={orders}
                searchKey="number"
                searchPlaceholder={t('title')}
            />
        </div>
    );
}
