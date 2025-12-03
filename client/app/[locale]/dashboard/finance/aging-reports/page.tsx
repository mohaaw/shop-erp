import { getAgingReportAction } from '@/app/actions/accounting-actions';
import { BackButton } from '@/components/ui/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function AgingReportsPage() {
    const arData = await getAgingReportAction('AR');
    const apData = await getAgingReportAction('AP');

    const renderTable = (data: typeof arData) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Entity Name</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">1-30 Days</TableHead>
                    <TableHead className="text-right">31-60 Days</TableHead>
                    <TableHead className="text-right">61-90 Days</TableHead>
                    <TableHead className="text-right">90+ Days</TableHead>
                    <TableHead className="text-right font-bold">Total Due</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No data found.
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell className="font-medium">{row.name}</TableCell>
                            <TableCell className="text-right">{row.current.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                            <TableCell className="text-right">{row.days30.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                            <TableCell className="text-right">{row.days60.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                            <TableCell className="text-right">{row.days90.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                            <TableCell className="text-right">{row.days90plus.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                            <TableCell className="text-right font-bold">{row.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );

    return (
        <div className="space-y-6">
            <BackButton fallbackUrl="/dashboard/finance" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Aging Reports</h1>
                <p className="text-muted-foreground">
                    Track overdue invoices and bills.
                </p>
            </div>

            <Tabs defaultValue="ar" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="ar">Accounts Receivable (AR)</TabsTrigger>
                    <TabsTrigger value="ap">Accounts Payable (AP)</TabsTrigger>
                </TabsList>
                <TabsContent value="ar">
                    <Card>
                        <CardHeader>
                            <CardTitle>Accounts Receivable Aging</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {renderTable(arData)}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="ap">
                    <Card>
                        <CardHeader>
                            <CardTitle>Accounts Payable Aging</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {renderTable(apData)}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
