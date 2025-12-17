'use client';

import { useTranslations } from 'next-intl';
import { DashboardWidget } from '@/components/dashboard/dashboard-widget';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  BarChart3,

  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

import { useEffect, useState } from 'react';
// import { dashboardApi } from '@/lib/api';
import { getRecentOrders, getSalesData, getLowStockData, getStats } from '@/app/actions/dashboard-actions';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { format } from 'date-fns';
import { LowStockWidget } from '@/components/dashboard/low-stock-widget';
import { AuditTrailWidget } from '@/components/dashboard/audit-trail-widget';

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  customerName: string | null;
}

interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
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
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, orders, lowStock, sales] = await Promise.all([
          getStats(),
          getRecentOrders(),
          getLowStockData(),
          getSalesData()
        ]);

        if (statsRes.success) {
          setStats(statsRes.data as { totalSales: number; orderCount: number; customerCount: number; productCount: number; });
        }
        setRecentOrders(orders as Order[]);
        setLowStockProducts(lowStock as LowStockProduct[]);
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
      change: '+12.5%',
      positive: true,
      icon: DollarSign,
    },
    {
      title: t('stats.orders'),
      value: stats.orderCount.toString(),
      change: '+8.2%',
      positive: true,
      icon: ShoppingCart,
    },
    {
      title: t('stats.customers'),
      value: stats.customerCount.toString(),
      change: '+3.4%',
      positive: true,
      icon: Users,
    },
    {
      title: t('stats.products'),
      value: stats.productCount.toString(),
      change: '+1.2%',
      positive: true,
      icon: Package,
    },
    {
      title: t('lowStock.title'),
      value: lowStockProducts.length.toString(),
      change: `-${lowStockProducts.length} items`,
      positive: false,
      icon: AlertTriangle,
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const ChangeIcon = stat.positive ? ArrowUpRight : ArrowDownRight;
          return (
            <div
              key={index}
              className="bg-card rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-2">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <ChangeIcon className={`w-4 h-4 mr-1 ${stat.positive ? 'text-success' : 'text-destructive'}`} />
                <span className={`text-sm font-medium ${stat.positive ? 'text-success' : 'text-destructive'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-secondary-500 ml-2">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardWidget title={t('charts.salesOverview')}>
            <div className="h-80">
              <SalesChart data={salesData} />
            </div>
          </DashboardWidget>
        </div>
        <div>
          <LowStockWidget />
        </div>
      </div>

      {/* Audit Trail and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AuditTrailWidget />
        <DashboardWidget title={t('recentOrders.title')}>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-secondary-500">
                No recent orders
              </div>
            ) : (
              recentOrders.map((order: Order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-secondary-900 dark:text-white">
                      {order.customerName || 'Walk-in Customer'}
                    </p>
                    <p className="text-sm text-secondary-500 text-xs">
                      {format(new Date(order.createdAt), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-secondary-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardWidget title={t('quickActions.title')}>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" size="lg" className="h-20 flex flex-col justify-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              <span>{t('quickActions.newSale')}</span>
            </Button>
            <Button variant="outline" size="lg" className="h-20 flex flex-col justify-center gap-2">
              <Package className="w-6 h-6" />
              <span>{t('quickActions.newProduct')}</span>
            </Button>
            <Button variant="outline" size="lg" className="h-20 flex flex-col justify-center gap-2">
              <Users className="w-6 h-6" />
              <span>{t('quickActions.newCustomer')}</span>
            </Button>
            <Button variant="outline" size="lg" className="h-20 flex flex-col justify-center gap-2">
              <BarChart3 className="w-6 h-6" />
              <span>{t('quickActions.viewReports')}</span>
            </Button>
          </div>
        </DashboardWidget>
      </div>
    </div>
  );
}

