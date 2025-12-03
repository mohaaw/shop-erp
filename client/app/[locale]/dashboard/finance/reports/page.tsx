import { getBalanceSheetAction, getProfitAndLossAction, getCashFlowStatementAction } from '@/app/actions/accounting-actions';
import { BackButton } from '@/components/ui/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";

export default async function FinancialReportsPage({
    searchParams,
}: {
    searchParams: { startDate?: string; endDate?: string };
}) {
    const balanceSheet = await getBalanceSheetAction();
    const profitAndLoss = await getProfitAndLossAction(searchParams.startDate, searchParams.endDate);
    const cashFlow = await getCashFlowStatementAction(searchParams.startDate, searchParams.endDate);

    return (
        <div className="space-y-6">
            <BackButton fallbackUrl="/dashboard/finance" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
                <p className="text-muted-foreground">
                    Balance Sheet, Profit & Loss, and Cash Flow Statement.
                </p>
            </div>

            <Tabs defaultValue="bs" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="bs">Balance Sheet</TabsTrigger>
                    <TabsTrigger value="pl">Profit & Loss</TabsTrigger>
                    <TabsTrigger value="cf">Cash Flow</TabsTrigger>
                </TabsList>

                <TabsContent value="bs" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Assets</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableBody>
                                        {balanceSheet.assets.map(acc => (
                                            <TableRow key={acc.id}>
                                                <TableCell>{acc.code} - {acc.name}</TableCell>
                                                <TableCell className="text-right">{acc.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="font-bold">
                                            <TableCell>Total Assets</TableCell>
                                            <TableCell className="text-right">{balanceSheet.totalAssets.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Liabilities</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableBody>
                                            {balanceSheet.liabilities.map(acc => (
                                                <TableRow key={acc.id}>
                                                    <TableCell>{acc.code} - {acc.name}</TableCell>
                                                    <TableCell className="text-right">{(acc.balance * -1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow className="font-bold">
                                                <TableCell>Total Liabilities</TableCell>
                                                <TableCell className="text-right">{(balanceSheet.totalLiabilities * -1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Equity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableBody>
                                            {balanceSheet.equity.map(acc => (
                                                <TableRow key={acc.id}>
                                                    <TableCell>{acc.code} - {acc.name}</TableCell>
                                                    <TableCell className="text-right">{(acc.balance * -1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow className="font-bold">
                                                <TableCell>Total Equity</TableCell>
                                                <TableCell className="text-right">{(balanceSheet.totalEquity * -1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="pl" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profit & Loss Statement</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-2">Income</h3>
                                    <Table>
                                        <TableBody>
                                            {profitAndLoss.income.map(acc => (
                                                <TableRow key={acc.id}>
                                                    <TableCell>{acc.code} - {acc.name}</TableCell>
                                                    <TableCell className="text-right">{acc.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow className="font-bold bg-muted/50">
                                                <TableCell>Total Income</TableCell>
                                                <TableCell className="text-right">{profitAndLoss.totalIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Expenses</h3>
                                    <Table>
                                        <TableBody>
                                            {profitAndLoss.expenses.map(acc => (
                                                <TableRow key={acc.id}>
                                                    <TableCell>{acc.code} - {acc.name}</TableCell>
                                                    <TableCell className="text-right">{acc.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow className="font-bold bg-muted/50">
                                                <TableCell>Total Expenses</TableCell>
                                                <TableCell className="text-right">{profitAndLoss.totalExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                                    <span className="text-lg font-bold">Net Profit</span>
                                    <span className={`text-lg font-bold ${profitAndLoss.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {profitAndLoss.netProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="cf" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cash Flow Statement</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-2">Operating Activities</h3>
                                    <div className="flex justify-between p-3 bg-muted/30 rounded">
                                        <span>Net Cash from Operations</span>
                                        <span className={cashFlow.operatingCash >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                            {cashFlow.operatingCash.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Investing Activities</h3>
                                    <div className="flex justify-between p-3 bg-muted/30 rounded">
                                        <span>Net Cash from Investing</span>
                                        <span className={cashFlow.investingCash >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                            {cashFlow.investingCash.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Financing Activities</h3>
                                    <div className="flex justify-between p-3 bg-muted/30 rounded">
                                        <span>Net Cash from Financing</span>
                                        <span className={cashFlow.financingCash >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                            {cashFlow.financingCash.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t pt-4 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Opening Cash Balance</span>
                                        <span>{cashFlow.openingCash.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Net Cash Flow</span>
                                        <span className={cashFlow.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>
                                            {cashFlow.netCashFlow.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                                        <span className="text-lg font-bold">Closing Cash Balance</span>
                                        <span className="text-lg font-bold">
                                            {cashFlow.closingCash.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
