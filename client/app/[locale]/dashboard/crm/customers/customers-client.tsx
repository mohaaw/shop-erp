'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Customer } from '@/types/customer';
import { useTranslations } from 'next-intl';

interface CustomersClientProps {
    customers: Customer[];
}

export function CustomersClient({ customers }: CustomersClientProps) {
    const t = useTranslations('CRM.customers');

    const columns: ColumnDef<Customer>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => <SortableHeader column={column}>{t('name')}</SortableHeader>,
        },
        {
            accessorKey: 'email',
            header: t('email'),
            cell: ({ row }) => row.original.email || '-',
        },
        {
            accessorKey: 'phone',
            header: t('phone'),
            cell: ({ row }) => row.original.phone || '-',
        },
        {
            accessorKey: 'address',
            header: t('address'),
            cell: ({ row }) => row.original.address || '-',
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
                <Link href="/dashboard/crm/customers/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newCustomer')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={customers}
                searchKey="name"
                searchPlaceholder={t('name')}
            />
        </div>
    );
}
