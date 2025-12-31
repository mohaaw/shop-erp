'use client';

import { useState } from 'react';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Employee, Department } from '@/lib/services/employee-service';
import { useTranslations } from 'next-intl';
import { EmployeeDialog } from '@/components/employees/employee-dialog';

interface EmployeesClientProps {
    employees: Employee[];
    departments: Department[];
}

export function EmployeesClient({ employees, departments }: EmployeesClientProps) {
    const t = useTranslations('Employees');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setSelectedEmployee(undefined);
        setIsDialogOpen(true);
    };

    const columns: ColumnDef<Employee>[] = [
        {
            accessorKey: 'employeeNumber',
            header: ({ column }) => <SortableHeader column={column}>{t('employeeNumber')}</SortableHeader>,
        },
        {
            accessorKey: 'firstName',
            header: ({ column }) => <SortableHeader column={column}>{t('firstName')}</SortableHeader>,
        },
        {
            accessorKey: 'lastName',
            header: ({ column }) => <SortableHeader column={column}>{t('lastName')}</SortableHeader>,
        },
        {
            accessorKey: 'email',
            header: t('email'),
            cell: ({ row }) => row.original.email || '-',
        },
        {
            accessorKey: 'departmentName',
            header: t('department'),
            cell: ({ row }) => row.original.departmentName || '-',
        },
        {
            accessorKey: 'designation',
            header: t('designation'),
            cell: ({ row }) => row.original.designation || '-',
        },
        {
            accessorKey: 'status',
            header: t('status'),
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <Badge variant={status === 'active' ? 'default' : 'secondary'}>
                        {status}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(row.original)}
                >
                    {t('edit')}
                </Button>
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
                <EmployeeDialog
                    departments={departments}
                    trigger={
                        <Button onClick={handleCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('newEmployee')}
                        </Button>
                    }
                />
            </div>

            <DataTable
                columns={columns}
                data={employees}
                searchKey="firstName"
                searchPlaceholder={t('firstName')}
            />

            <EmployeeDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                employee={selectedEmployee}
                departments={departments}
            />
        </div>
    );
}
