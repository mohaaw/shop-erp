'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users2, Plus } from 'lucide-react';

export default function EmployeesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Employees</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Manage staff and payroll
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Employee
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users2 className="w-5 h-5 text-primary-600" />
            Staff Directory
          </CardTitle>
          <CardDescription>All employees and staff members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
            <p className="text-secondary-500 dark:text-secondary-400">
              Employee directory coming soon...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
