'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { CustomerDialog } from '@/components/customers/customer-dialog';
import { useEffect, useState } from 'react';
import { customersApi } from '@/lib/api';
import { Customer } from '@/types/customer';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await customersApi.getAll();
        if (response.data.success) {
          setCustomers(response.data.data as Customer[]);
        }
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Customers</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Manage customer relationships
          </p>
        </div>
        <CustomerDialog />
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
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : customers.length === 0 ? (
            <div className="h-64 flex items-center justify-center bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
              <p className="text-secondary-500 dark:text-secondary-400">
                No customers found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {customers.map((customer) => (
                <div key={customer.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {customer.phone || 'No phone'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
