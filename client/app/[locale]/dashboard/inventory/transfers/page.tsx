import { getStockTransfersAction } from '@/app/actions/warehouse-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { StockTransferDialog } from '@/components/inventory/stock-transfer-dialog';
import { StockTransfer } from '@/lib/services/warehouse-service';

export default async function StockTransfersPage() {
    const transfers = await getStockTransfersAction();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Stock Transfers</h1>
                    <p className="text-muted-foreground">
                        Transfer inventory between locations.
                    </p>
                </div>
                <StockTransferDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transfer History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transfers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No transfers found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transfers.map((transfer: StockTransfer) => (
                                    <TableRow key={transfer.id}>
                                        <TableCell>{new Date(transfer.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-medium">{transfer.productName}</TableCell>
                                        <TableCell>{transfer.sourceLocationName}</TableCell>
                                        <TableCell>{transfer.destLocationName}</TableCell>
                                        <TableCell>{transfer.quantity}</TableCell>
                                        <TableCell>
                                            <Badge variant={transfer.state === 'done' ? 'success' : 'secondary'}>
                                                {transfer.state}
                                            </Badge>
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
