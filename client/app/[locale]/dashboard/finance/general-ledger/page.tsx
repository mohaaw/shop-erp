import { getGeneralLedgerAction, getAccountsAction } from '@/app/actions/accounting-actions';
import { BackButton } from '@/components/ui/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { GeneralLedgerFilters } from '@/components/finance/general-ledger-filters';

export default async function GeneralLedgerPage({
    searchParams,
}: {
    searchParams: { accountId?: string; startDate?: string; endDate?: string };
}) {
    const entries = await getGeneralLedgerAction(
        searchParams.accountId,
        searchParams.startDate,
        searchParams.endDate
    );
    const accounts = await getAccountsAction();

    return (
        <div className="space-y-6">
            <BackButton fallbackUrl="/dashboard/finance" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">General Ledger</h1>
                <p className="text-muted-foreground">
                    View detailed transactions for specific accounts.
                </p>
            </div>

            <GeneralLedgerFilters accounts={accounts} />

            <Card>
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Account</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Debit</TableHead>
                                <TableHead className="text-right">Credit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {entries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                entries.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <span className="font-medium">{entry.accountCode}</span> - {entry.accountName}
                                        </TableCell>
                                        <TableCell>{entry.reference || '-'}</TableCell>
                                        <TableCell>{entry.description || '-'}</TableCell>
                                        <TableCell className="text-right">
                                            {entry.debit > 0 ? entry.debit.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {entry.credit > 0 ? entry.credit.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
