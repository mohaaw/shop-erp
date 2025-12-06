import { getSuppliersAction } from '@/app/actions/scm-actions';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function SuppliersPage() {
    const suppliers = await getSuppliersAction();
    const t = await getTranslations('SCM');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('suppliers')}</h1>
                    <p className="text-muted-foreground">
                        Manage your supplier database
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/scm/suppliers/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Supplier
                    </Link>
                </Button>
            </div>

            <DataTable columns={columns} data={suppliers} searchKey="name" />
        </div>
    );
}
