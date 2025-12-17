'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardWidget } from './dashboard-widget';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package } from 'lucide-react';
import { getLowStockData } from '@/app/actions/dashboard-actions';

interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
}

export function LowStockWidget() {
  const t = useTranslations('Dashboard');
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowStockData = async () => {
      try {
        const data = (await getLowStockData()) as unknown as LowStockProduct[];
        setLowStockProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch low stock data:', error);
        setLowStockProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockData();
  }, []);

  const hasLowStock = lowStockProducts.length > 0;

  return (
    <DashboardWidget title={t('lowStock.title')}>
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">{t('lowStock.loading')}</div>
          </div>
        ) : hasLowStock ? (
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-error-600 dark:text-error-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-secondary-900 dark:text-white truncate max-w-[120px]">
                      {product.name}
                    </p>
                    <p className="text-xs text-secondary-500">{product.sku}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-bold text-sm text-error-600 dark:text-error-400">
                    {product.stock}
                  </span>
                  <Badge variant="error" size="sm">
                    {t('lowStock.underMin', { min: product.minStock })}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 bg-success/10 rounded-full mb-3">
              <Package className="w-6 h-6 text-success" />
            </div>
            <h4 className="font-semibold text-secondary-900 dark:text-white">
              {t('lowStock.allGood')}
            </h4>
            <p className="text-sm text-secondary-500 mt-1">
              {t('lowStock.noIssues')}
            </p>
          </div>
        )}
      </div>
    </DashboardWidget>
  );
}