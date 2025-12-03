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

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const [stats, setStats] = useState({
    totalSales: 0,
    orderCount: 0,
    customerCount: 0,
    productCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardApi.getStats();
        if (response.data.success) {
          setStats(response.data.data as { totalSales: number; orderCount: number; customerCount: number; productCount: number; });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
              <p className="text-secondary-500 dark:text-secondary-400">
                {t('charts.comingSoon')}
              </p>
            </div>
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
          <div className="space-y-3">
            {[].map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900 dark:text-white">{t('recentOrders.orderPrefix')}{order.id}</p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">{t('recentOrders.hoursAgo')}</p>
                </div>
                <Badge variant="success">{t('recentOrders.completed')}</Badge>
              </div>
            ))}
            {/* Placeholder if no orders */}
            <div className="text-center text-sm text-secondary-500">No recent orders</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
