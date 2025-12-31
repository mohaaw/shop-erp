import "server-only";
import { db } from '@/lib/db';

export interface Role {
    id: string;
    name: string;
    description: string;
    isSystem: boolean;
    createdAt: string;
    updatedAt: string;
}

export type Permission = {
    id: string;
    resource: string;
    action: string;
    description?: string;
};

export type RoleWithPermissions = {
    id: string;
    name: string;
    description: string;
    isSystem: boolean;
    permissions: Permission[];
};

export const roleService = {
    init: () => {
        db.exec(`
            CREATE TABLE IF NOT EXISTS Role (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                isSystem INTEGER DEFAULT 0,
                createdAt TEXT,
                updatedAt TEXT
            );
            CREATE TABLE IF NOT EXISTS RolePermission (
                roleId TEXT,
                permissionId TEXT,
                PRIMARY KEY (roleId, permissionId),
                FOREIGN KEY(roleId) REFERENCES Role(id) ON DELETE CASCADE
            );
        `);
    },

    getRoles: (): RoleWithPermissions[] => {
        const roles = db.prepare('SELECT * FROM Role ORDER BY name').all() as Role[];
        return roles.map(role => ({
            ...role,
            permissions: roleService.getRolePermissions(role.id)
        }));
    },

    getRole: (id: string): RoleWithPermissions | undefined => {
        const role = db.prepare('SELECT * FROM Role WHERE id = ?').get(id) as Role | undefined;
        if (!role) return undefined;
        return {
            ...role,
            permissions: roleService.getRolePermissions(id)
        };
    },

    getRolePermissions: (roleId: string): Permission[] => {
        const rows = db.prepare('SELECT permissionId FROM RolePermission WHERE roleId = ?').all(roleId) as { permissionId: string }[];
        // We need to map permissionId back to Permission object.
        // Usually we would join with a Permission table, but here we just have IDs.
        // We will reconstruct a Permission object assuming the ID contains info or we fetch from a static list helper.
        // For now, let's return objects with just ID, or we need to import accessControlService to resolve full object?
        // To avoid circular dependency, we store just ID here.
        // BUT RoleWithPermissions expects Permission[].
        // Let's assume permissionId roughly maps to resource-action.
        return rows.map(r => {
            const parts = r.permissionId.split('-');
            const action = parts.pop() || '';
            const resource = parts.join('-');
            return { id: r.permissionId, resource, action };
        });
    },

    createRole: (data: Omit<Role, 'id' | 'isSystem' | 'createdAt' | 'updatedAt'> & { permissionIds?: string[] }): RoleWithPermissions => {
        const id = data.name.toLowerCase().replace(/\s+/g, '-');
        const now = new Date().toISOString();

        const insert = db.transaction(() => {
            db.prepare(`
                INSERT INTO Role (id, name, description, isSystem, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(id, data.name, data.description, 0, now, now);

            if (data.permissionIds && data.permissionIds.length > 0) {
                const stmt = db.prepare('INSERT INTO RolePermission (roleId, permissionId) VALUES (?, ?)');
                for (const permId of data.permissionIds) {
                    stmt.run(id, permId);
                }
            }
        });

        insert();
        return roleService.getRole(id)!;
    },

    updateRole: (id: string, data: Partial<Role> & { permissionIds?: string[] }): RoleWithPermissions => {
        const now = new Date().toISOString();
        const role = roleService.getRole(id);
        if (!role) throw new Error('Role not found');
        if (role.isSystem) throw new Error('Cannot update system role');

        const update = db.transaction(() => {
            if (data.name || data.description) {
                db.prepare(`
                   UPDATE Role SET name = COALESCE(?, name), description = COALESCE(?, description), updatedAt = ?
                   WHERE id = ?
               `).run(data.name, data.description, now, id);
            }

            if (data.permissionIds) {
                db.prepare('DELETE FROM RolePermission WHERE roleId = ?').run(id);
                const stmt = db.prepare('INSERT INTO RolePermission (roleId, permissionId) VALUES (?, ?)');
                for (const permId of data.permissionIds) {
                    stmt.run(id, permId);
                }
            }
        });

        update();
        return roleService.getRole(id)!;
    },

    deleteRole: (id: string): void => {
        const role = db.prepare('SELECT isSystem FROM Role WHERE id = ?').get(id) as Role;
        if (role && role.isSystem) {
            throw new Error('Cannot delete system role');
        }
        db.prepare('DELETE FROM Role WHERE id = ?').run(id);
    }
};

// Initialize tables
try {
    roleService.init();
} catch (e) {
    console.error('Failed to init role tables', e);
}
