'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Plus } from 'lucide-react';

export default function SalesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Sales</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Manage orders and invoices
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Order
        </Button>
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
          <div className="h-64 flex items-center justify-center bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
            <p className="text-secondary-500 dark:text-secondary-400">
              Sales orders table coming soon...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
