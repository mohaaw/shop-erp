// Server-side role service for server actions
import { db } from '@/lib/db';

export interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  action: string;
  resource: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

export const roleService = {
  async getRoles(): Promise<RoleWithPermissions[]> {
    // Get all roles
    const roles = db.prepare('SELECT * FROM Role ORDER BY name ASC').all() as Role[];

    // For each role, get its permissions
    return roles.map(role => {
      const permissions = db.prepare(`
        SELECT p.*
        FROM Permission p
        INNER JOIN RolePermission rp ON p.id = rp.permissionId
        WHERE rp.roleId = ?
      `).all(role.id) as Permission[];

      return {
        ...role,
        permissions
      };
    });
  },

  async getRoleById(id: string): Promise<RoleWithPermissions | null> {
    const role = db.prepare('SELECT * FROM Role WHERE id = ?').get(id) as Role | undefined;
    if (!role) return null;

    const permissions = db.prepare(`
      SELECT p.*
      FROM Permission p
      INNER JOIN RolePermission rp ON p.id = rp.permissionId
      WHERE rp.roleId = ?
    `).all(id) as Permission[];

    return {
      ...role,
      permissions
    };
  },

  async createRole(data: { name: string; description?: string; permissionIds: string[] }) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    // Create the role
    db.prepare(`
      INSERT INTO Role (id, name, description, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, data.name, data.description, now, now);

    // Connect permissions if provided
    if (data.permissionIds.length > 0) {
      const stmt = db.prepare(`
        INSERT INTO RolePermission (roleId, permissionId)
        VALUES (?, ?)
      `);

      for (const permId of data.permissionIds) {
        stmt.run(id, permId);
      }
    }

    return this.getRoleById(id);
  },

  async updateRole(id: string, data: { name?: string; description?: string; permissionIds?: string[] }) {
    const now = new Date().toISOString();

    // Update role fields
    if (data.name || data.description) {
      const fields = [];
      const values = [];

      if (data.name !== undefined) {
        fields.push('name = ?');
        values.push(data.name);
      }
      if (data.description !== undefined) {
        fields.push('description = ?');
        values.push(data.description);
      }

      fields.push('updatedAt = ?');
      values.push(now);
      values.push(id);

      db.prepare(`UPDATE Role SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    }

    // Update permissions if provided
    if (data.permissionIds !== undefined) {
      // First, delete all existing role permissions
      db.prepare('DELETE FROM RolePermission WHERE roleId = ?').run(id);

      // Then add the new ones
      if (data.permissionIds.length > 0) {
        const stmt = db.prepare(`
          INSERT INTO RolePermission (roleId, permissionId)
          VALUES (?, ?)
        `);

        for (const permId of data.permissionIds) {
          stmt.run(id, permId);
        }
      }
    }

    return this.getRoleById(id);
  },

  async deleteRole(id: string) {
    // Delete role permissions first (due to foreign key constraint)
    db.prepare('DELETE FROM RolePermission WHERE roleId = ?').run(id);

    // Then delete the role
    db.prepare('DELETE FROM Role WHERE id = ?').run(id);
  },

  async getPermissions(): Promise<Permission[]> {
    return db.prepare('SELECT * FROM Permission ORDER BY resource, action').all() as Permission[];
  },

  async createPermission(data: { action: string; resource: string; description?: string }) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO Permission (id, action, resource, description, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, data.action, data.resource, data.description, now, now);

    return this.getPermissions();
  },

  async ensureDefaultPermissions() {
    const resources = [
      'dashboard', 'products', 'sales', 'customers', 'inventory',
      'suppliers', 'employees', 'finance', 'reports', 'settings', 'users', 'roles'
    ];
    const actions = ['read', 'create', 'update', 'delete'];

    for (const resource of resources) {
      for (const action of actions) {
        // Check if permission already exists
        const existing = db.prepare(`
          SELECT id FROM Permission WHERE action = ? AND resource = ?
        `).get(action, resource);

        if (!existing) {
          // Create the permission if it doesn't exist
          const id = crypto.randomUUID();
          const now = new Date().toISOString();

          db.prepare(`
            INSERT INTO Permission (id, action, resource, description, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(
            id,
            action,
            resource,
            `Can ${action} ${resource}`,
            now,
            now
          );
        }
      }
    }
  }
};