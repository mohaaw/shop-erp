'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, Plus } from 'lucide-react';

export default function CustomersPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Customers</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Manage customer relationships
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-600" />
            Customer List
          </CardTitle>
          <CardDescription>All your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
            <p className="text-secondary-500 dark:text-secondary-400">
              Customer list table coming soon...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
