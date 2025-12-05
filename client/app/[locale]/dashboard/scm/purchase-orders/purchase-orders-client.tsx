'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { PurchaseOrder } from '@/lib/services/purchase-order-service';
import { useTranslations } from 'next-intl';

interface PurchaseOrdersClientProps {
    orders: PurchaseOrder[];
}

export function PurchaseOrdersClient({ orders }: PurchaseOrdersClientProps) {
    const t = useTranslations('SCM.purchaseOrders');

    const columns: ColumnDef<PurchaseOrder>[] = [
        {
            accessorKey: 'number',
            header: ({ column }) => <SortableHeader column={column}>{t('orderNumber')}</SortableHeader>,
        },
        {
            accessorKey: 'supplierName',
            header: t('supplier'),
            cell: ({ row }) => row.original.supplierName || '-',
        },
        {
            accessorKey: 'date',
            header: t('date'),
            cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
        },
        {
            accessorKey: 'totalAmount',
            header: t('totalAmount'),
            cell: ({ row }) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(row.original.totalAmount);
            },
        },
        {
            accessorKey: 'status',
            header: t('status'),
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'received' ? 'success' : status === 'confirmed' ? 'default' : 'secondary';
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
                <Link href="/dashboard/scm/purchase-orders/new">
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
                searchPlaceholder={t('orderNumber')}
            />
        </div>
    );
}
