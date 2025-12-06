'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { StockAdjustment } from '@/lib/services/inventory-service';
import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';

interface StockAdjustmentsClientProps {
    adjustments: StockAdjustment[];
}

export function StockAdjustmentsClient({ adjustments }: StockAdjustmentsClientProps) {
    const t = useTranslations('Inventory.adjustments');

    const columns: ColumnDef<StockAdjustment>[] = [
        {
            accessorKey: 'productName',
            header: ({ column }) => <SortableHeader column={column}>{t('product')}</SortableHeader>,
        },
        {
            accessorKey: 'quantity',
            header: t('quantity'),
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
            accessorKey: 'date',
            header: t('date'),
            cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
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
                <Link href="/dashboard/inventory/adjustments/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newAdjustment')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={adjustments}
                searchKey="productName"
                searchPlaceholder={t('product')}
            />
        </div>
    );
}
