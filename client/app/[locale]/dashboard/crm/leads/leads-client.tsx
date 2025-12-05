'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Lead } from '@/lib/services/crm-service';
import { useTranslations } from 'next-intl';

interface LeadsClientProps {
    leads: Lead[];
}

export function LeadsClient({ leads }: LeadsClientProps) {
    const t = useTranslations('CRM.leads');

    const columns: ColumnDef<Lead>[] = [
        {
            accessorKey: 'firstName',
            header: ({ column }) => <SortableHeader column={column}>{t('newLead').split(' ')[1] || 'Name'}</SortableHeader>,
        },
        {
            accessorKey: 'lastName',
            header: ({ column }) => <SortableHeader column={column}>{t('newLead').split(' ')[2] || 'Last Name'}</SortableHeader>,
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => row.original.email || '-',
        },
        {
            accessorKey: 'company',
            header: t('company'),
            cell: ({ row }) => row.original.company || '-',
        },
        {
            accessorKey: 'source',
            header: t('source'),
            cell: ({ row }) => row.original.source || '-',
        },
        {
            accessorKey: 'status',
            header: t('status'),
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'converted' ? 'default' : status === 'lost' ? 'error' : 'secondary';
                return <Badge variant={variant}>{status}</Badge>;
            },
        },
        {
            accessorKey: 'score',
            header: t('score'),
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
                <Link href="/dashboard/crm/leads/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newLead')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={leads}
                searchKey="firstName"
                searchPlaceholder={t('title')}
            />
        </div>
    );
}
