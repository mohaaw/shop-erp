import { getChartOfAccountsAction } from '@/app/actions/accounting-actions';
import { ChartOfAccounts } from '@/components/finance/chart-of-accounts';
import { BackButton } from '@/components/ui/back-button';

export default async function ChartOfAccountsPage() {
    const accounts = await getChartOfAccountsAction();

    return (
        <div className="space-y-6">
            <BackButton fallbackUrl="/dashboard/finance" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Chart of Accounts</h1>
                <p className="text-muted-foreground">
                    Manage your organization&apos;s financial structure.
                </p>
            </div>

            <ChartOfAccounts accounts={accounts} />
        </div>
    );
}
