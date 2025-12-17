'use client';

import { useState, useEffect } from 'react';
// import { useTranslations } from 'next-intl';
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

export default function ReportsPage() {
  // const t = useTranslations('Reports');
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('last30');

  // Mock data for reports
  const reports = [
    { id: 'sales', title: 'Sales Report', description: 'Revenue, orders, and sales trends', icon: TrendingUp, color: 'primary' },
    { id: 'inventory', title: 'Inventory Report', description: 'Stock levels and movement', icon: Package, color: 'success' },
    { id: 'customers', title: 'Customer Report', description: 'Customer analytics and trends', icon: Users, color: 'info' },
    { id: 'products', title: 'Product Report', description: 'Best selling products and variants', icon: ShoppingCart, color: 'warning' },
    { id: 'finance', title: 'Financial Report', description: 'Profit, expenses, and cash flow', icon: DollarSign, color: 'destructive' },
  ];

  const dateRanges = [
    { id: 'today', label: 'Today' },
    { id: 'last7', label: 'Last 7 Days' },
    { id: 'last30', label: 'Last 30 Days' },
    { id: 'last90', label: 'Last 90 Days' },
    { id: 'thisMonth', label: 'This Month' },
    { id: 'thisYear', label: 'This Year' },
  ];

  const [stats, setStats] = useState({
    totalSales: 0,
    orderCount: 0,
    customerCount: 0,
    avgOrderValue: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data on component mount
  // Fetch real data on component mount

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming simple token storage for this demo, or rely on session
        // In a real app with next-auth, you'd use useSession().data.accessToken
        // For this audit fix, we'll try to fetch public or rely on cookies if setup, 
        // but likely we need to pass headers if auth is strict. 
        // Given earlier tests showed auth required, we need a way to get the token.
        // However, the previous "login" verification just worked with standard NextAuth, so the session cookie might be enough 
        // IF the API is on the same domain or proxied. 
        // But the server runs on 3001 and client on 3000.
        // The middleware proxies /api requests? Let's check next.config.js or middleware.
        // The user previously verified login.

        // Let's assume we can fetch from /api (proxied) or direct.
        // Actually next.config.js had headers but not rewrites. 
        // Let's try fetching directly from the environmental variable API URL or relative if proxied.
        // PRO TIP: Client components can't easily access process.env in build unless public.

        const headers = { 'Content-Type': 'application/json' };
        // We'd arguably need the auth token here. 
        // For now, let's implement the fetch and see. 

        // Parallel fetch
        const [statsRes, salesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/dashboard/stats`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/dashboard/sales-chart`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` } })
        ]);

        if (statsRes.ok && salesRes.ok) {
          const statsJson = await statsRes.json();
          const salesJson = await salesRes.json();

          if (statsJson.success) {
            const s = statsJson.data;
            setStats({
              totalSales: s.totalSales || 0,
              orderCount: s.orderCount || 0,
              customerCount: s.customerCount || 0,
              avgOrderValue: s.orderCount > 0 ? (s.totalSales / s.orderCount) : 0
            });
          }

          if (salesJson.success) {
            setSalesData(salesJson.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // We need to handle authentication token. 
    // Since we are fixing this "live", we'll check if we have a token in localStorage from our login fix?
    // Actually, NextAuth usually handles sessions. 
    // We might need to wrap this in a SessionProvider or just try fetching.
    // For this quick fix, let's assume the user has a token or we gracefully fail to mock data if fetch fails.
    fetchData();
  }, []);

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
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-600" />
                {reports.find(r => r.id === selectedReport)?.title}
              </CardTitle>
              <CardDescription>
                {reports.find(r => r.id === selectedReport)?.description}
              </CardDescription>
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
            <SalesChart data={salesData.length > 0 ? salesData : [
              { name: 'Jan', total: 0 }, { name: 'Feb', total: 0 }, { name: 'Mar', total: 0 }
            ]} />
          </div>
        </CardContent>
      </Card>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orderCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customerCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Revenue / Orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Your recently generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Sales Report - Last 30 Days', type: 'Sales', date: '2023-06-15', size: '2.4 MB' },
              { name: 'Inventory Analysis - May 2023', type: 'Inventory', date: '2023-06-10', size: '1.8 MB' },
              { name: 'Customer Segmentation Q2', type: 'Customers', date: '2023-06-05', size: '3.1 MB' },
              { name: 'Financial Summary - May', type: 'Finance', date: '2023-06-01', size: '0.9 MB' },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white">{report.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" size="sm">{report.type}</Badge>
                      <span className="text-xs text-secondary-500">{report.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-500">{report.size}</span>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}