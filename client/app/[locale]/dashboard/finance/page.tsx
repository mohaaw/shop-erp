import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, DollarSign, PieChart, TrendingUp } from 'lucide-react';

export default async function FinancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
        <p className="text-muted-foreground">
          Manage your accounting, reporting, and financial health.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:bg-secondary-50 dark:hover:bg-secondary-900 transition-colors cursor-pointer">
          <Link href="/dashboard/finance/chart-of-accounts">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Chart of Accounts
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage your general ledger accounts hierarchy.
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:bg-secondary-50 dark:hover:bg-secondary-900 transition-colors cursor-pointer">
          <Link href="/dashboard/finance/journal-entries">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Journal Entries
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Record manual financial transactions.
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:bg-secondary-50 dark:hover:bg-secondary-900 transition-colors cursor-pointer">
          <Link href="/dashboard/finance/general-ledger">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                General Ledger
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View detailed transaction history by account.
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:bg-secondary-50 dark:hover:bg-secondary-900 transition-colors cursor-pointer">
          <Link href="/dashboard/finance/reports">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Financial Reports
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Balance Sheet and Profit & Loss Statement.
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:bg-secondary-50 dark:hover:bg-secondary-900 transition-colors cursor-pointer">
          <Link href="/dashboard/finance/invoices">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Sales Invoices
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and manage customer invoices.
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:bg-secondary-50 dark:hover:bg-secondary-900 transition-colors cursor-pointer">
          <Link href="/dashboard/finance/purchase-invoices">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Purchase Invoices
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Record bills from suppliers.
              </p>
            </CardContent>
          </Link>
        </Card>
        <Card className="hover:bg-secondary-50 dark:hover:bg-secondary-900 transition-colors cursor-pointer">
          <Link href="/dashboard/finance/aging-reports">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Aging Reports
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View AR and AP aging summaries.
              </p>
            </CardContent>
          </Link>
        </Card>
        <Card className="hover:bg-secondary-50 dark:hover:bg-secondary-900 transition-colors cursor-pointer">
          <Link href="/dashboard/finance/settings/tax">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Tax Settings
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage tax rates and rules.
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
