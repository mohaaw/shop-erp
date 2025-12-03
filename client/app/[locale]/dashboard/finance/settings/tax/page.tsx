import { getTaxRatesAction } from '@/app/actions/tax-actions';
import { getAccountsAction } from '@/app/actions/accounting-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TaxRateForm } from '@/components/finance/tax-rate-form';

export default async function TaxSettingsPage() {
    const taxRates = await getTaxRatesAction();
    const accounts = await getAccountsAction();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tax Rates</h1>
                    <p className="text-muted-foreground">
                        Manage tax rates and their linked accounts.
                    </p>
                </div>
                <TaxRateForm accounts={accounts} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Tax Rates</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Rate (%)</TableHead>
                                <TableHead>Linked Account</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {taxRates.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No tax rates found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                taxRates.map((rate) => (
                                    <TableRow key={rate.id}>
                                        <TableCell className="font-medium">{rate.name}</TableCell>
                                        <TableCell>{rate.code}</TableCell>
                                        <TableCell>{rate.rate}%</TableCell>
                                        <TableCell>
                                            {accounts.find(a => a.id === rate.accountId)?.name || '-'}
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
