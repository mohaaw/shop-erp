import { getChartOfAccountsAction } from '@/app/actions/accounting-actions';
import { ChartOfAccounts } from '@/components/finance/chart-of-accounts';

export default async function ChartOfAccountsPage() {
    const accounts = await getChartOfAccountsAction();

    return (
        <div className="space-y-6">
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
