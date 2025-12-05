'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

interface Attendance {
    id: string;
    employeeName?: string;
    date: string;
    checkIn?: string;
    checkOut?: string;
    status: string;
}

interface AttendanceClientProps {
    attendance: Attendance[];
}

export function AttendanceClient({ attendance }: AttendanceClientProps) {
    const t = useTranslations('HCM.attendance');

    const columns: ColumnDef<Attendance>[] = [
        {
            accessorKey: 'employeeName',
            header: ({ column }) => <SortableHeader column={column}>{t('employee')}</SortableHeader>,
            cell: ({ row }) => row.original.employeeName || '-',
        },
        {
            accessorKey: 'date',
            header: t('date'),
            cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
        },
        {
            accessorKey: 'checkIn',
            header: t('checkIn'),
            cell: ({ row }) => row.original.checkIn || '-',
        },
        {
            accessorKey: 'checkOut',
            header: t('checkOut'),
            cell: ({ row }) => row.original.checkOut || '-',
        },
        {
            accessorKey: 'status',
            header: t('status'),
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'present' ? 'success' : status === 'absent' ? 'error' : 'secondary';
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
                <Link href="/dashboard/hcm/attendance/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newAttendance')}
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={attendance}
                searchKey="employeeName"
                searchPlaceholder={t('employee')}
            />
        </div>
    );
}
