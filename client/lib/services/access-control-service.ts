import "server-only";
// 'use server';

export interface Permission {
  id: string;
  action: string; // create, read, update, delete
  resource: string; // products, sales, inventory, etc.
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface UserRole {
  userId: string;
  roleId: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
}

export const accessControlService = {
  /**
   * Check if a user has permission for a specific action on a resource
   */
  async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
    try {
      // Dynamically import the db in server action context
      const { db } = await import('@/lib/db');

      // First, get the user's role (for now we'll use the role stored directly on the user)
      const user: { role: string } | undefined = db.prepare(
        'SELECT role FROM User WHERE id = ?'
      ).get(userId) as { role: string } | undefined;

      if (!user) {
        return false;
      }

      // For now, use a simple role-based permission system
      // In the future, we could expand to use the role-permission mapping
      return this.checkRolePermission(user.role, resource, action);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  },

  /**
   * Simple role-based permission checking
   */
  checkRolePermission(role: string, resource: string, action: string): boolean {
    // Define role permissions
    const rolePermissions: Record<string, Record<string, string[]>> = {
      admin: {
        '*': ['*'], // Admin can do everything
      },
      manager: {
        '*': ['read', 'update'], // Manager can read and update everything
        products: ['create', 'delete'], // Manager can manage products
        sales: ['create', 'delete'],    // Manager can manage sales
        inventory: ['create', 'update'], // Manager can manage inventory
        employees: ['read', 'update'],   // Manager can view and update employees
      },
      staff: {
        products: ['read'],        // Staff can read products
        sales: ['create', 'read'], // Staff can create and read sales
        inventory: ['read'],       // Staff can read inventory
        customers: ['create', 'read', 'update'], // Staff can manage customers
      },
      user: {
        dashboard: ['read'],
        profile: ['read', 'update'],
      }
    };

    // Check if role exists in permissions
    if (!rolePermissions[role]) {
      return false;
    }

    // Check if resource exists in role permissions
    if (rolePermissions[role]['*']) {
      // Role has wildcard access to all resources
      if (rolePermissions[role]['*'].includes('*') || rolePermissions[role]['*'].includes(action)) {
        return true;
      }
    }

    // Check specific resource permissions
    if (rolePermissions[role][resource]) {
      return rolePermissions[role][resource].includes(action) || rolePermissions[role][resource].includes('*');
    }

    return false;
  },

  /**
   * Get all permissions for a user
   */
  async getUserPermissions(userId: string): Promise<Permission[]> {
    try {
      // Dynamically import the db in server action context
      const { db } = await import('@/lib/db');

      const user: { role: string } | undefined = db.prepare(
        'SELECT role FROM User WHERE id = ?'
      ).get(userId) as { role: string } | undefined;

      if (!user) {
        return [];
      }

      // Return permissions based on role
      return this.getPermissionsForRole(user.role);
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return [];
    }
  },

  /**
   * Get all permissions for a specific role
   */
  getPermissionsForRole(role: string): Permission[] {
    const allPermissions: Permission[] = [
      { id: 'products-read', action: 'read', resource: 'products' },
      { id: 'products-create', action: 'create', resource: 'products' },
      { id: 'products-update', action: 'update', resource: 'products' },
      { id: 'products-delete', action: 'delete', resource: 'products' },
      { id: 'sales-read', action: 'read', resource: 'sales' },
      { id: 'sales-create', action: 'create', resource: 'sales' },
      { id: 'sales-update', action: 'update', resource: 'sales' },
      { id: 'sales-delete', action: 'delete', resource: 'sales' },
      { id: 'inventory-read', action: 'read', resource: 'inventory' },
      { id: 'inventory-create', action: 'create', resource: 'inventory' },
      { id: 'inventory-update', action: 'update', resource: 'inventory' },
      { id: 'inventory-delete', action: 'delete', resource: 'inventory' },
      { id: 'customers-read', action: 'read', resource: 'customers' },
      { id: 'customers-create', action: 'create', resource: 'customers' },
      { id: 'customers-update', action: 'update', resource: 'customers' },
      { id: 'customers-delete', action: 'delete', resource: 'customers' },
      { id: 'dashboard-read', action: 'read', resource: 'dashboard' },
      { id: 'profile-read', action: 'read', resource: 'profile' },
      { id: 'profile-update', action: 'update', resource: 'profile' },
    ];

    // Get allowed actions for the role
    const allowedActions = this.getRoleActions(role);

    return allPermissions.filter(perm =>
      allowedActions.some(allowed =>
        (allowed.resource === '*' || allowed.resource === perm.resource) &&
        (allowed.action === '*' || allowed.action === perm.action)
      )
    );
  },

  /**
   * Get role permission patterns
   */
  getRoleActions(role: string): Array<{ resource: string, action: string }> {
    const rolePermissions: Record<string, Array<{ resource: string, action: string }>> = {
      admin: [{ resource: '*', action: '*' }],
      manager: [
        { resource: '*', action: 'read' },
        { resource: '*', action: 'update' },
        { resource: 'products', action: 'create' },
        { resource: 'products', action: 'delete' },
        { resource: 'sales', action: 'create' },
        { resource: 'sales', action: 'delete' },
        { resource: 'inventory', action: 'create' },
        { resource: 'inventory', action: 'update' },
        { resource: 'employees', action: 'read' },
        { resource: 'employees', action: 'update' },
      ],
      staff: [
        { resource: 'products', action: 'read' },
        { resource: 'sales', action: 'create' },
        { resource: 'sales', action: 'read' },
        { resource: 'inventory', action: 'read' },
        { resource: 'customers', action: 'create' },
        { resource: 'customers', action: 'read' },
        { resource: 'customers', action: 'update' },
      ],
      user: [
        { resource: 'dashboard', action: 'read' },
        { resource: 'profile', action: 'read' },
        { resource: 'profile', action: 'update' },
      ]
    };

    return rolePermissions[role] || [];
  },

  getAllPossiblePermissions(): Permission[] {
    return [
      { id: 'products-read', action: 'read', resource: 'products' },
      { id: 'products-create', action: 'create', resource: 'products' },
      { id: 'products-update', action: 'update', resource: 'products' },
      { id: 'products-delete', action: 'delete', resource: 'products' },
      { id: 'sales-read', action: 'read', resource: 'sales' },
      { id: 'sales-create', action: 'create', resource: 'sales' },
      { id: 'sales-update', action: 'update', resource: 'sales' },
      { id: 'sales-delete', action: 'delete', resource: 'sales' },
      { id: 'inventory-read', action: 'read', resource: 'inventory' },
      { id: 'inventory-create', action: 'create', resource: 'inventory' },
      { id: 'inventory-update', action: 'update', resource: 'inventory' },
      { id: 'inventory-delete', action: 'delete', resource: 'inventory' },
      { id: 'customers-read', action: 'read', resource: 'customers' },
      { id: 'customers-create', action: 'create', resource: 'customers' },
      { id: 'customers-update', action: 'update', resource: 'customers' },
      { id: 'customers-delete', action: 'delete', resource: 'customers' },
      { id: 'dashboard-read', action: 'read', resource: 'dashboard' },
      { id: 'profile-read', action: 'read', resource: 'profile' },
      { id: 'profile-update', action: 'update', resource: 'profile' },
      { id: 'employees-read', action: 'read', resource: 'employees' },
      { id: 'employees-create', action: 'create', resource: 'employees' },
      { id: 'employees-update', action: 'update', resource: 'employees' },
      { id: 'employees-delete', action: 'delete', resource: 'employees' },
      { id: 'roles-read', action: 'read', resource: 'roles' },
      { id: 'roles-create', action: 'create', resource: 'roles' },
      { id: 'roles-update', action: 'update', resource: 'roles' },
      { id: 'roles-delete', action: 'delete', resource: 'roles' },
    ];
  }
};