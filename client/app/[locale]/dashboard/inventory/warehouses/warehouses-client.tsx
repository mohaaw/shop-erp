'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Warehouse } from '@/lib/services/warehouse-service';
import { useTranslations } from 'next-intl';

interface WarehousesClientProps {
    warehouses: Warehouse[];
}

export function WarehousesClient({ warehouses }: WarehousesClientProps) {
    const t = useTranslations('Inventory.warehouses');

    const columns: ColumnDef<Warehouse>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => <SortableHeader column={column}>{t('name')}</SortableHeader>,
        },
        {
            accessorKey: 'code',
            header: t('code'),
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
                <Link href="/dashboard/inventory/warehouses/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newWarehouse')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={warehouses}
                searchKey="name"
                searchPlaceholder={t('name')}
            />
        </div>
    );
}
