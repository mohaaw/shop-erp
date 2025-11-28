'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function POSPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Point of Sale</h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          Touch-optimized sales interface
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>POS Terminal</CardTitle>
          <CardDescription>Quick sales checkout interface</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
            <p className="text-secondary-500 dark:text-secondary-400">
              POS interface coming soon...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
