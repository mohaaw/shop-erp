'use client';

import { useTranslations } from 'next-intl';
import { WidgetGrid } from '@/components/dashboard/widget-grid';
import { DashboardWidget } from '@/components/dashboard/dashboard-widget';
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

      <WidgetGrid>
        <div key="stats">
          <DashboardWidget title="Overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
              {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.title} className="flex flex-col justify-between p-4 bg-card rounded-lg border h-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">
                          {loading ? '...' : stat.value}
                        </p>
                      </div>
                      <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                    <Badge
                      variant={stat.positive ? 'success' : 'error'}
                      size="sm"
                      className="w-fit mt-2"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </DashboardWidget>
        </div>

        <div key="sales-chart">
          <DashboardWidget title={t('charts.salesOverview')}>
            <SalesChart data={salesData} />
          </DashboardWidget>
        </div>

        <div key="recent-orders">
          <DashboardWidget title={t('recentOrders.title')}>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <div className="text-center text-sm text-secondary-500 py-4">No recent orders</div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-secondary-900 dark:text-white truncate max-w-[120px]">
                          {order.customerName || 'Walk-in'}
                        </span>
                      </div>
                      <p className="text-xs text-secondary-500">
                        {format(new Date(order.createdAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-bold text-sm text-secondary-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </span>
                      <Badge variant={order.status === 'completed' ? 'success' : 'warning'} size="sm">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DashboardWidget>
        </div>

        <div key="quick-actions">
          <DashboardWidget title={t('quickActions.title')}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full items-center">
              <Button variant="outline" className="h-full flex flex-col gap-2 py-4">
                <ShoppingCart className="w-6 h-6" />
                {t('quickActions.newSale')}
              </Button>
              <Button variant="outline" className="h-full flex flex-col gap-2 py-4">
                <Package className="w-6 h-6" />
                {t('quickActions.newProduct')}
              </Button>
              <Button variant="outline" className="h-full flex flex-col gap-2 py-4">
                <Users className="w-6 h-6" />
                {t('quickActions.newCustomer')}
              </Button>
              <Button variant="outline" className="h-full flex flex-col gap-2 py-4">
                <BarChart3 className="w-6 h-6" />
                {t('quickActions.viewReports')}
              </Button>
            </div>
          </DashboardWidget>
        </div>
      </WidgetGrid>
    </div>
  );
}

