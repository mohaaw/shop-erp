'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

interface Workstation {
    id: string;
    name: string;
    code: string;
    description?: string;
    status: string;
}

interface WorkstationsClientProps {
    workstations: Workstation[];
}

export function WorkstationsClient({ workstations }: WorkstationsClientProps) {
    const t = useTranslations('Manufacturing.workstations');

    const columns: ColumnDef<Workstation>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => <SortableHeader column={column}>{t('name')}</SortableHeader>,
        },
        {
            accessorKey: 'code',
            header: t('code'),
        },
        {
            accessorKey: 'status',
            header: t('status'),
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'active' ? 'success' : 'secondary';
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
                <Link href="/dashboard/manufacturing/workstations/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newWorkstation')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={workstations}
                searchKey="name"
                searchPlaceholder={t('name')}
            />
        </div>
    );
}
