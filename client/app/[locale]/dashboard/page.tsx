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

export default function DashboardPage() {
  const t = useTranslations('Dashboard');

  const stats = [
    {
      title: t('stats.totalSales'),
      value: '$45,231.89',
      change: '+20.1%',
      positive: true,
      icon: DollarSign,
    },
    {
      title: t('stats.orders'),
      value: '1,234',
      change: '+15%',
      positive: true,
      icon: ShoppingCart,
    },
    {
      title: t('stats.customers'),
      value: '892',
      change: '+8.2%',
      positive: true,
      icon: Users,
    },
    {
      title: t('stats.products'),
      value: '2,456',
      change: '+2.5%',
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
            {[1, 2, 3, 4, 5].map((order) => (
              <div key={order} className="flex items-center justify-between p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900 dark:text-white">{t('recentOrders.orderPrefix')}{1001 + order}</p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">{t('recentOrders.hoursAgo')}</p>
                </div>
                <Badge variant="success">{t('recentOrders.completed')}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
