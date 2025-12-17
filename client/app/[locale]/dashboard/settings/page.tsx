import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { accessControlService } from '@/lib/services/access-control-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Package, ShoppingCart } from 'lucide-react';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    // If no session, redirect would be handled by middleware
    return (
      <div className="flex items-center justify-center h-96">
        <p>Please log in to access settings</p>
      </div>
    );
  }

  // Check permissions for different sections
  const canManageUsers = await accessControlService.hasPermission(session.user.id, 'users', 'read');
  const canManageRoles = await accessControlService.hasPermission(session.user.id, 'roles', 'read');
  const canManageProducts = await accessControlService.hasPermission(session.user.id, 'products', 'read');
  const canManageSales = await accessControlService.hasPermission(session.user.id, 'sales', 'read');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-white">Settings</h1>
        <p className="text-secondary-500 dark:text-secondary-400">
          Manage your account settings and system configuration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className={`${canManageUsers ? 'border-primary' : 'opacity-50'}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              User Management
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Users</div>
            <p className="text-xs text-muted-foreground mt-1">
              {canManageUsers ? 'Access granted' : 'Access required: users:read'}
            </p>
          </CardContent>
        </Card>

        <Card
          className={`${canManageRoles ? 'border-primary' : 'opacity-50'}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Role Management
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Roles</div>
            <p className="text-xs text-muted-foreground mt-1">
              {canManageRoles ? 'Access granted' : 'Access required: roles:read'}
            </p>
          </CardContent>
        </Card>

        <Card
          className={`${canManageProducts ? 'border-primary' : 'opacity-50'}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Product Settings
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Products</div>
            <p className="text-xs text-muted-foreground mt-1">
              {canManageProducts ? 'Access granted' : 'Access required: products:read'}
            </p>
          </CardContent>
        </Card>

        <Card
          className={`${canManageSales ? 'border-primary' : 'opacity-50'}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sales Settings
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Sales</div>
            <p className="text-xs text-muted-foreground mt-1">
              {canManageSales ? 'Access granted' : 'Access required: sales:read'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span>User Management</span>
              <Badge variant={canManageUsers ? 'success' : 'secondary'}>
                {canManageUsers ? 'Allowed' : 'Denied'}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Role Management</span>
              <Badge variant={canManageRoles ? 'success' : 'secondary'}>
                {canManageRoles ? 'Allowed' : 'Denied'}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Product Management</span>
              <Badge variant={canManageProducts ? 'success' : 'secondary'}>
                {canManageProducts ? 'Allowed' : 'Denied'}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Sales Management</span>
              <Badge variant={canManageSales ? 'success' : 'secondary'}>
                {canManageSales ? 'Allowed' : 'Denied'}
              </Badge>
            </div>
          </div>

          <div className="mt-6 p-4 bg-secondary rounded-lg">
            <h4 className="font-medium mb-2">Your Role: <Badge>{session.user?.role || 'user'}</Badge></h4>
            <p className="text-sm text-muted-foreground">
              Based on your role, you have specific permissions to access different parts of the system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}