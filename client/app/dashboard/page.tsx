'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BarChart3, TrendingUp, Users, ShoppingCart, Package, DollarSign } from 'lucide-react';

const stats = [
  {
    title: 'Total Sales',
    value: '$45,231.89',
    change: '+20.1%',
    positive: true,
    icon: DollarSign,
  },
  {
    title: 'Orders',
    value: '1,234',
    change: '+15%',
    positive: true,
    icon: ShoppingCart,
  },
  {
    title: 'Customers',
    value: '892',
    change: '+8.2%',
    positive: true,
    icon: Users,
  },
  {
    title: 'Products',
    value: '2,456',
    change: '+2.5%',
    positive: true,
    icon: Package,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Dashboard</h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          Welcome back! Here's your business overview.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                    <Badge
                      variant={stat.positive ? 'success' : 'error'}
                      size="sm"
                      className="mt-2"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              Sales Overview
            </CardTitle>
            <CardDescription>Last 30 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
              <p className="text-secondary-500 dark:text-secondary-400">
                Chart component coming soon...
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" fullWidth className="justify-start">
              + New Sale
            </Button>
            <Button variant="outline" fullWidth className="justify-start">
              + New Product
            </Button>
            <Button variant="outline" fullWidth className="justify-start">
              + New Customer
            </Button>
            <Button variant="outline" fullWidth className="justify-start">
              + View Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your latest 5 orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((order) => (
              <div key={order} className="flex items-center justify-between p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900 dark:text-white">Order #{1001 + order}</p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">2 hours ago</p>
                </div>
                <Badge variant="success">Completed</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
