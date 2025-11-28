'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Settings</h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          System configuration and administration
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary-600" />
            Administration Panel
          </CardTitle>
          <CardDescription>Configure system settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
            <p className="text-secondary-500 dark:text-secondary-400">
              Settings panel coming soon...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
