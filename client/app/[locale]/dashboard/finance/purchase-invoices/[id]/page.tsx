import { getPurchaseInvoiceAction, postPurchaseInvoiceAction } from '@/app/actions/purchase-invoice-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PaymentDialog } from '@/components/finance/payment-dialog';

export default async function PurchaseInvoiceDetailPage({ params }: { params: { id: string } }) {
    const invoice = await getPurchaseInvoiceAction(params.id);

    if (!invoice) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bill {invoice.number}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant={
                            invoice.status === 'posted' ? 'default' :
                                invoice.status === 'paid' ? 'success' :
                                    invoice.status === 'cancelled' ? 'error' : 'secondary'
                        }>
                            {invoice.status}
                        </Badge>
                        <span className="text-muted-foreground">
                            {new Date(invoice.date).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <div className="space-x-2">
                    {invoice.status === 'draft' && (
                        <form action={postPurchaseInvoiceAction.bind(null, invoice.id)}>
                            <Button type="submit">Post Bill</Button>
                        </form>
                    )}
                    {invoice.status === 'posted' && (
                        <PaymentDialog
                            invoiceId={invoice.id}
                            invoiceType="purchase_invoice"
                            totalAmount={invoice.totalAmount}
                        />
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Supplier Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-medium">{invoice.supplierName}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Terms</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-muted-foreground">Due Date:</div>
                            <div>{new Date(invoice.dueDate).toLocaleDateString()}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Account</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoice.items?.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.accountName}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{item.unitPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                    <TableCell className="text-right">{item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="font-bold text-lg">
                                <TableCell colSpan={4} className="text-right">Total</TableCell>
                                <TableCell className="text-right">{invoice.totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
