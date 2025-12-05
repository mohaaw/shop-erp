'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

interface Payment {
    id: string;
    date: string;
    customerName?: string;
    amount: number;
    method: string;
    status: string;
}

interface PaymentsClientProps {
    payments: Payment[];
}

export function PaymentsClient({ payments }: PaymentsClientProps) {
    const t = useTranslations('Finance.payments');

    const columns: ColumnDef<Payment>[] = [
        {
            accessorKey: 'date',
            header: ({ column }) => <SortableHeader column={column}>{t('date')}</SortableHeader>,
            cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
        },
        {
            accessorKey: 'customerName',
            header: t('customer'),
            cell: ({ row }) => row.original.customerName || '-',
        },
        {
            accessorKey: 'amount',
            header: t('amount'),
            cell: ({ row }) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(row.original.amount);
            },
        },
        {
            accessorKey: 'method',
            header: t('method'),
        },
        {
            accessorKey: 'status',
            header: t('status'),
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'completed' ? 'success' : status === 'pending' ? 'warning' : 'error';
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
                <Link href="/dashboard/finance/payments/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newPayment')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={payments}
                searchKey="customerName"
                searchPlaceholder={t('customer')}
            />
        </div>
    );
}
