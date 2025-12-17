'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardWidget } from './dashboard-widget';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { getSalesData } from '@/app/actions/dashboard-actions';

interface SalesData {
  name: string;
  total: number;
}

export function SalesKpiWidget() {
  const t = useTranslations('Dashboard');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [salesChange, setSalesChange] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const data = (await getSalesData()) as unknown as SalesData[];
        setSalesData(data || []);

        // Calculate total sales
        const currentTotal = Array.isArray(data) ? data.reduce((sum, item) => sum + item.total, 0) : 0;
        setTotalSales(currentTotal);

        // Calculate change (comparing last 7 days vs previous 7 days)
        if (Array.isArray(data) && data.length > 14) {
          const recentWeek = data.slice(-7).reduce((sum, item) => sum + item.total, 0);
          const previousWeek = data.slice(-14, -7).reduce((sum, item) => sum + item.total, 0);

          if (previousWeek > 0) {
            const change = ((recentWeek - previousWeek) / previousWeek) * 100;
            setSalesChange(parseFloat(change.toFixed(2)));
          } else {
            setSalesChange(100); // First week, 100% increase
          }
        }
      } catch (error) {
        console.error('Failed to fetch sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const isPositive = salesChange >= 0;

  return (
    <DashboardWidget title={t('charts.salesOverview')}>
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">{t('loading')}</div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-secondary-900 dark:text-white">
                ${totalSales.toFixed(2)}
              </span>
              <Badge variant={isPositive ? 'success' : 'error'} size="sm" className="flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {isPositive ? '+' : ''}{salesChange}%
              </Badge>
            </div>

            <div className="flex-1 space-y-2">
              {salesData.slice(-5).reverse().map((day, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-secondary-600 dark:text-secondary-400">{day.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-secondary-900 dark:text-white">
                      ${day.total.toFixed(2)}
                    </span>
                    <div className="w-16 bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (day.total / Math.max(...salesData.map(d => d.total))) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700 text-xs text-secondary-500">
              <div className="flex justify-between">
                <span>{t('charts.last30Days')}</span>
                <span>{salesData.length} {t('charts.days')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardWidget>
  );
}