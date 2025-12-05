'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

interface TaxRate {
    id: string;
    name: string;
    rate: number;
    code?: string;
    isDefault: boolean;
}

interface TaxRatesClientProps {
    taxRates: TaxRate[];
}

export function TaxRatesClient({ taxRates }: TaxRatesClientProps) {
    const t = useTranslations('Finance.taxRates');

    const columns: ColumnDef<TaxRate>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => <SortableHeader column={column}>{t('name')}</SortableHeader>,
        },
        {
            accessorKey: 'rate',
            header: t('rate'),
            cell: ({ row }) => `${row.original.rate}%`,
        },
        {
            accessorKey: 'code',
            header: t('code'),
            cell: ({ row }) => row.original.code || '-',
        },
        {
            accessorKey: 'isDefault',
            header: t('default'),
            cell: ({ row }) => (
                row.original.isDefault ? <Badge variant="success">Yes</Badge> : <Badge variant="secondary">No</Badge>
            ),
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
                <Link href="/dashboard/finance/tax-rates/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newTaxRate')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={taxRates}
                searchKey="name"
                searchPlaceholder={t('name')}
            />
        </div>
    );
}
