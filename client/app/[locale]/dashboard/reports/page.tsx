'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BarChart3, Plus } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Reports</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Analytics and business insights
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            Reports
          </CardTitle>
          <CardDescription>Custom reports and analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
            <p className="text-secondary-500 dark:text-secondary-400">
              Reports coming soon...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
