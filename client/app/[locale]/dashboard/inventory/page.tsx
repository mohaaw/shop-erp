import { getLowStockProductsAction } from '@/app/actions/inventory-actions';
import { LowStockReport, LowStockItem } from '@/components/inventory/low-stock-report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function InventoryPage() {
  const t = await getTranslations('Inventory');
  const result = await getLowStockProductsAction();
  const lowStockProducts = (result.success && result.data ? result.data : []) as LowStockItem[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Items below reorder point
            </p>
          </CardContent>
        </Card>
        {/* Other cards can be added here later */}
      </div>

      <Tabs defaultValue="low-stock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="valuation">Valuation</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="flex items-center justify-center h-96 border rounded-lg bg-muted/10">
            <p className="text-muted-foreground">Overview Dashboard Coming Soon</p>
          </div>
        </TabsContent>
        <TabsContent value="stock" className="space-y-4">
          <div className="flex items-center justify-center h-96 border rounded-lg bg-muted/10">
            <p className="text-muted-foreground">Stock Management Coming Soon</p>
          </div>
        </TabsContent>
        <TabsContent value="movements" className="space-y-4">
          <div className="flex items-center justify-center h-96 border rounded-lg bg-muted/10">
            <p className="text-muted-foreground">Stock Movements Coming Soon</p>
          </div>
        </TabsContent>
        <TabsContent value="valuation" className="space-y-4">
          <div className="flex items-center justify-center h-96 border rounded-lg bg-muted/10">
            <p className="text-muted-foreground">Inventory Valuation Coming Soon</p>
          </div>
        </TabsContent>
        <TabsContent value="low-stock" className="space-y-4">
          <LowStockReport items={lowStockProducts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
