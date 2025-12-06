'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/api';
import { getRecentOrders, getSalesData } from '@/app/actions/dashboard-actions';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { format } from 'date-fns';

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  customerName: string | null;
}

interface SalesData {
  name: string;
  total: number;
}

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const [stats, setStats] = useState({
    totalSales: 0,
    orderCount: 0,
    customerCount: 0,
    productCount: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, orders, sales] = await Promise.all([
          dashboardApi.getStats(),
          getRecentOrders(),
          getSalesData()
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.data as { totalSales: number; orderCount: number; customerCount: number; productCount: number; });
        }
        setRecentOrders(orders as Order[]);
        setSalesData(sales as SalesData[]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: t('stats.totalSales'),
      value: `$${stats.totalSales.toFixed(2)}`,
      change: '+0.0%', // TODO: Calculate change
      positive: true,
      icon: DollarSign,
    },
    {
      title: t('stats.orders'),
      value: stats.orderCount.toString(),
      change: '+0%',
      positive: true,
      icon: ShoppingCart,
    },
    {
      title: t('stats.customers'),
      value: stats.customerCount.toString(),
      change: '+0%',
      positive: true,
      icon: Users,
    },
    {
      title: t('stats.products'),
      value: stats.productCount.toString(),
      change: '+0%',
      positive: true,
      icon: Package,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">{t('header.title')}</h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          {t('header.subtitle')}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
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
                      {loading ? '...' : stat.value}
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
              {t('charts.salesOverview')}
            </CardTitle>
            <CardDescription>{t('charts.last30Days')}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart data={salesData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('quickActions.title')}</CardTitle>
            <CardDescription>{t('quickActions.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" fullWidth className="justify-start">
              {t('quickActions.newSale')}
            </Button>
            <Button variant="outline" fullWidth className="justify-start">
              {t('quickActions.newProduct')}
            </Button>
            <Button variant="outline" fullWidth className="justify-start">
              {t('quickActions.newCustomer')}
            </Button>
            <Button variant="outline" fullWidth className="justify-start">
              {t('quickActions.viewReports')}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recentOrders.title')}</CardTitle>
          <CardDescription>{t('recentOrders.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="text-center text-sm text-secondary-500 py-4">No recent orders</div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-secondary-900 dark:text-white">
                        {order.customerName || 'Walk-in Customer'}
                      </span>
                      <span className="text-xs text-secondary-500">#{order.id.slice(-6)}</span>
                    </div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-secondary-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </span>
                    <Badge variant={order.status === 'completed' ? 'success' : 'warning'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

