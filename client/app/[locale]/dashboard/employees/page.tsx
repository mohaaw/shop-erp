import { getEmployeesAction } from '@/app/actions/employee-actions';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Employee } from '@/lib/services/employee-service';
import { getTranslations } from 'next-intl/server';

export default async function EmployeesPage() {
  const t = await getTranslations('Employees');
  const employees = await getEmployeesAction();

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
        <Link href={`/dashboard/employees/${row.original.id}`}>
          <Button variant="ghost" size="sm">View</Button>
        </Link>
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
        <Link href="/dashboard/employees/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('newEmployee')}
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        searchKey="firstName"
        searchPlaceholder={t('firstName')}
      />
    </div>
  );
}
