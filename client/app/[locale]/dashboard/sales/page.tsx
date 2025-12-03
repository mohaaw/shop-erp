import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Plus } from 'lucide-react';
import { getOrdersAction } from '@/app/actions/order-actions';
import { SalesTable } from '@/components/orders/sales-table';
import { Link } from '@/i18n/navigation';
import { Order } from '@/types/order';

export default async function SalesPage() {
  const result = await getOrdersAction();
  const orders = result.success && result.data ? result.data : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Sales</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Manage orders and invoices
          </p>
        </div>
        <Link href="/dashboard/pos">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Order (POS)
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary-600" />
            Orders
          </CardTitle>
          <CardDescription>All customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesTable data={orders as Order[]} />
        </CardContent>
      </Card>
    </div>
  );
}
