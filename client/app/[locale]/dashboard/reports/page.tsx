'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  FileText,
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { getSalesReportAction, getInventoryValuationAction } from '@/app/actions/report-actions';
import { pdf } from '@react-pdf/renderer';
import { ReportDocument } from '@/components/reports/report-pdf';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('last30');

  // Load actual data
  const [salesData, setSalesData] = useState<any[]>([]);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    orderCount: 0,
    avgOrderValue: 0
  });

  const reports = [
    { id: 'sales', title: 'Sales Report', description: 'Revenue, orders, and sales trends', icon: TrendingUp, color: 'primary' },
    { id: 'inventory', title: 'Inventory Valuation', description: 'Stock levels vs Value', icon: Package, color: 'success' },
  ];

  const dateRanges = [
    { id: 'today', label: 'Today' },
    { id: 'last7', label: 'Last 7 Days' },
    { id: 'last30', label: 'Last 30 Days' },
    { id: 'last90', label: 'Last 90 Days' },
  ];

  useEffect(() => {
    async function loadData() {
      // Calculate dates based on range
      const end = new Date();
      const start = new Date();
      if (dateRange === 'last7') start.setDate(start.getDate() - 7);
      if (dateRange === 'last30') start.setDate(start.getDate() - 30);
      if (dateRange === 'last90') start.setDate(start.getDate() - 90);

      const startDateStr = start.toISOString().split('T')[0];
      const endDateStr = end.toISOString().split('T')[0];

      // Fetch Sales
      const salesRes = await getSalesReportAction(startDateStr, endDateStr);
      if (salesRes.success) {
        const data = salesRes.data || [];
        // Transform for chart {name: date, total: revenue}
        const chartData = data.map((d: any) => ({ name: d.date.split('-').slice(1).join('/'), total: d.revenue }));
        setSalesData(chartData);

        // Calc stats
        const totalRev = data.reduce((acc: number, curr: any) => acc + curr.revenue, 0);
        const totalOrders = data.reduce((acc: number, curr: any) => acc + curr.orders, 0);
        setStats({
          totalSales: totalRev,
          orderCount: totalOrders,
          avgOrderValue: totalOrders > 0 ? totalRev / totalOrders : 0
        });
      }

      // Fetch Inventory (Static snapshot)
      const invRes = await getInventoryValuationAction();
      if (invRes.success) {
        setInventoryData(invRes.data || []);
      }
    }
    loadData();
  }, [dateRange]);

  const handleExport = async () => {
    const toastId = toast.loading('Generating PDF...');
    try {
      let doc;
      let fileName;

      if (selectedReport === 'sales') {
        // Create mock detailed data from aggregated chart data/source
        const reportData = salesData.map(d => ({ date: d.name, orders: 0, revenue: d.total }));
        doc = <ReportDocument title="Sales Report" data={reportData} type="sales" />;
        fileName = `sales-report-${dateRange}.pdf`;
      } else {
        doc = <ReportDocument title="Inventory Valuation" data={inventoryData} type="inventory" />;
        fileName = `inventory-report.pdf`;
      }

      const blob = await pdf(doc).toBlob();
      saveAs(blob, fileName);
      toast.success('PDF Downloaded', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate PDF', { id: toastId });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Real-time business insights and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((report) => {
          const Icon = report.icon;
          const isSelected = selectedReport === report.id;

          return (
            <Card
              key={report.id}
              className={`cursor-pointer transition-colors ${isSelected
                ? 'ring-2 ring-primary border-primary'
                : 'hover:bg-secondary/50 dark:hover:bg-secondary/20'
                }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <CardHeader className="text-center">
                <div className={`inline-flex p-3 rounded-full bg-${report.color}/10 text-${report.color} mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Main Chart Area */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-600" />
                {reports.find(r => r.id === selectedReport)?.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-secondary-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-secondary-200 dark:border-secondary-700 rounded-md px-3 py-1.5 text-sm bg-background"
              >
                {dateRanges.map(range => (
                  <option key={range.id} value={range.id}>{range.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            {selectedReport === 'sales' ? (
              <SalesChart data={salesData} />
            ) : (
              <div className="space-y-4">
                {inventoryData.map((cat, i) => (
                  <div key={i} className="flex justify-between items-center p-2 border-b">
                    <span>{cat.category || 'Uncategorized'}</span>
                    <span className="font-bold">${cat.value.toLocaleString()}</span>
                  </div>
                ))}
                {inventoryData.length === 0 && <p className="text-center text-muted-foreground">No inventory data found.</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats (Only visible for Sales) */}
      {selectedReport === 'sales' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue ({dateRange})</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSales.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orderCount.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.avgOrderValue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}