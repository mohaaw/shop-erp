'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { BOM } from '@/lib/services/manufacturing-service';
import { useTranslations } from 'next-intl';

interface BOMClientProps {
    boms: BOM[];
}

export function BOMClient({ boms }: BOMClientProps) {
    const t = useTranslations('Manufacturing.bom');

    const columns: ColumnDef<BOM>[] = [
        {
            accessorKey: 'productName',
            header: ({ column }) => <SortableHeader column={column}>{t('product')}</SortableHeader>,
        },
        {
            accessorKey: 'quantity',
            header: t('quantity'),
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.original.isActive;
                return <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? 'Active' : 'Inactive'}</Badge>;
            },
        },
        {
            accessorKey: 'notes',
            header: t('notes'),
            cell: ({ row }) => row.original.notes || '-',
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
                <Link href="/dashboard/manufacturing/bom/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newBOM')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={boms}
                searchKey="productName"
                searchPlaceholder={t('title')}
            />
        </div>
    );
}
