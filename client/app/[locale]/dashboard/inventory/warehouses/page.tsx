import { getWarehousesAction } from '@/app/actions/warehouse-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { WarehouseDialog } from '@/components/inventory/warehouse-dialog';

export default async function WarehousesPage() {
    const warehouses = await getWarehousesAction();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
                    <p className="text-muted-foreground">
                        Manage your warehouse locations and storage facilities.
                    </p>
                </div>
                <WarehouseDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Warehouses</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {warehouses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                        No warehouses found. Create your first warehouse to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                warehouses.map((warehouse) => (
                                    <TableRow key={warehouse.id}>
                                        <TableCell className="font-medium">{warehouse.name}</TableCell>
                                        <TableCell>{warehouse.code}</TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">View Details</span>
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
