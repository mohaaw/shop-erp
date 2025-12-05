'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

interface Payroll {
    id: string;
    employeeName?: string;
    month: number;
    year: number;
    basicSalary: number;
    allowances: number;
    deductions: number;
    netSalary: number;
    status: string;
}

interface PayrollClientProps {
    payroll: Payroll[];
}

export function PayrollClient({ payroll }: PayrollClientProps) {
    const t = useTranslations('HCM.payroll');

    const columns: ColumnDef<Payroll>[] = [
        {
            accessorKey: 'employeeName',
            header: ({ column }) => <SortableHeader column={column}>{t('employee')}</SortableHeader>,
            cell: ({ row }) => row.original.employeeName || '-',
        },
        {
            accessorKey: 'month',
            header: t('month'),
            cell: ({ row }) => `${row.original.month}/${row.original.year}`,
        },
        {
            accessorKey: 'netSalary',
            header: t('netSalary'),
            cell: ({ row }) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(row.original.netSalary);
            },
        },
        {
            accessorKey: 'status',
            header: t('status'),
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'paid' ? 'success' : 'default';
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
                <Link href="/dashboard/hcm/payroll/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newPayroll')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={payroll}
                searchKey="employeeName"
                searchPlaceholder={t('employee')}
            />
        </div>
    );
}
