import { getOrderAction } from '@/app/actions/order-actions';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { InvoiceButton } from '@/components/invoices/invoice-button';
import { OrderWithDetails } from '@/types/order';

interface OrderDetailsPageProps {
    params: {
        id: string;
    };
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
    const { order } = await getOrderAction(params.id) as { order: OrderWithDetails };

    if (!order) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/sales">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Order #{order.id}</h2>
                        <p className="text-muted-foreground">
                            View order details and status.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <InvoiceButton order={order} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="font-medium">{item.productName}</div>
                                                <div className="text-sm text-secondary-500">{item.productSku}</div>
                                            </TableCell>
                                            <TableCell className="text-right">{item.quantity}</TableCell>
                                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
                                        <TableCell className="text-right font-bold">${order.total.toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm font-medium text-secondary-500">Name</div>
                                <div>{order.customerName || 'Guest Customer'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-secondary-500">Email</div>
                                <div>{order.customerEmail || 'N/A'}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Order Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-secondary-500">Status</span>
                                <OrderStatusBadge status={order.status} type="order" />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-secondary-500">Payment</span>
                                <OrderStatusBadge status={order.paymentStatus} type="payment" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
