'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { StockTransfer } from '@/lib/services/warehouse-service';
import { useTranslations } from 'next-intl';

interface StockTransfersClientProps {
    transfers: StockTransfer[];
}

export function StockTransfersClient({ transfers }: StockTransfersClientProps) {
    const t = useTranslations('Inventory.stockTransfers');

    const columns: ColumnDef<StockTransfer>[] = [
        {
            accessorKey: 'productName',
            header: ({ column }) => <SortableHeader column={column}>{t('product')}</SortableHeader>,
        },
        {
            accessorKey: 'sourceLocationName',
            header: t('from'),
        },
        {
            accessorKey: 'destLocationName',
            header: t('to'),
        },
        {
            accessorKey: 'quantity',
            header: t('quantity'),
        },
        {
            accessorKey: 'date',
            header: t('date'),
            cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
        },
        {
            accessorKey: 'state',
            header: t('status'),
            cell: ({ row }) => {
                const state = row.original.state;
                const variant = state === 'done' ? 'success' : state === 'draft' ? 'default' : 'secondary';
                return <Badge variant={variant}>{state}</Badge>;
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
                <Link href="/dashboard/inventory/stock-transfers/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newTransfer')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={transfers}
                searchKey="productName"
                searchPlaceholder={t('product')}
            />
        </div>
    );
}
