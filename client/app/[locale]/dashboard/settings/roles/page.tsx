import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { accessControlService } from '@/lib/services/access-control-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { AlertTriangle, Plus, Trash2, User, Shield } from 'lucide-react';

export default async function RoleManagementPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Please log in to access role management</p>
      </div>
    );
  }

  // Check permission server-side
  const hasPermission = await accessControlService.hasPermission(session.user.id, 'roles', 'read');

  if (!hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">Access Denied</h3>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          You don&#39;t have permission to access role management.
          {' '}Contact your administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  const roles = [
    { id: 'admin', name: 'Administrator', description: 'Full access to all features' },
    { id: 'manager', name: 'Manager', description: 'Access to manage products, sales, and employees' },
    { id: 'staff', name: 'Staff', description: 'Access to process sales and manage customers' },
    { id: 'user', name: 'User', description: 'Basic access to dashboard and profile' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-white">Role Management</h1>
            <p className="text-secondary-500 dark:text-secondary-400">
              Manage user roles and their permissions
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-4 w-4 mr-1" />
            Role-Based Access Control
          </Badge>
        </div>
      </div>

      {/* Add New Role */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Role</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                name="roleName"
                placeholder="e.g., Sales Manager"
              />
            </div>
            <div>
              <Label htmlFor="roleDesc">Description</Label>
              <Input
                id="roleDesc"
                name="roleDesc"
                placeholder="Description of the role"
              />
            </div>
          </div>
          <form action="/api/create-role" method="post">
            <Button type="submit" className="w-fit">
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Roles List */}
      <Card>
        <CardHeader>
          <CardTitle>Role List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {role.name}
                    </div>
                  </TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {role.id === 'admin' ? 'System' : 'Custom'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {accessControlService.getRoleActions(role.id).length} permissions
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={['admin', 'user', 'manager', 'staff'].includes(role.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}