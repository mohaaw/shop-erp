import { getInvoicesAction } from '@/app/actions/invoice-actions';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function InvoicesPage() {
    const invoices = await getInvoicesAction();

    return (
        <div className="space-y-6">
            <BackButton fallbackUrl="/dashboard/finance" />
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sales Invoices</h1>
                    <p className="text-muted-foreground">
                        Manage customer invoices and payments.
                    </p>
                </div>
                <Link href="/dashboard/finance/invoices/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Invoice
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Number</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No invoices found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                invoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">{invoice.number}</TableCell>
                                        <TableCell>{invoice.customerName}</TableCell>
                                        <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                invoice.status === 'posted' ? 'default' :
                                                    invoice.status === 'paid' ? 'success' :
                                                        invoice.status === 'cancelled' ? 'error' : 'secondary'
                                            }>
                                                {invoice.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {invoice.totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/dashboard/finance/invoices/${invoice.id}`}>
                                                <Button variant="ghost" size="sm">View</Button>
                                            </Link>
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
