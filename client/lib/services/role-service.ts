import { PrismaClient, Role, Permission } from '@prisma/client';

const prisma = new PrismaClient();

export interface RoleWithPermissions extends Role {
    permissions: Permission[];
}

export const roleService = {
    async getRoles(): Promise<RoleWithPermissions[]> {
        return prisma.role.findMany({
            include: {
                permissions: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    },

    async getRoleById(id: string): Promise<RoleWithPermissions | null> {
        return prisma.role.findUnique({
            where: { id },
            include: {
                permissions: true,
            },
        });
    },

    async createRole(data: { name: string; description?: string; permissionIds: string[] }) {
        return prisma.role.create({
            data: {
                name: data.name,
                description: data.description,
                permissions: {
                    connect: data.permissionIds.map((id) => ({ id })),
                },
            },
            include: {
                permissions: true,
            },
        });
    },

    async updateRole(id: string, data: { name?: string; description?: string; permissionIds?: string[] }) {
        return prisma.role.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                permissions: data.permissionIds
                    ? {
                        set: data.permissionIds.map((pid) => ({ id: pid })),
                    }
                    : undefined,
            },
            include: {
                permissions: true,
            },
        });
    },

    async deleteRole(id: string) {
        return prisma.role.delete({
            where: { id },
        });
    },

    async getPermissions(): Promise<Permission[]> {
        return prisma.permission.findMany({
            orderBy: {
                resource: 'asc',
            },
        });
    },

    async createPermission(data: { action: string; resource: string; description?: string }) {
        return prisma.permission.create({
            data,
        });
    },

    async ensureDefaultPermissions() {
        const resources = [
            'dashboard', 'products', 'sales', 'customers', 'inventory',
            'suppliers', 'employees', 'finance', 'reports', 'settings', 'users', 'roles'
        ];
        const actions = ['read', 'create', 'update', 'delete'];

        for (const resource of resources) {
            for (const action of actions) {
                await prisma.permission.upsert({
                    where: {
                        action_resource: {
                            action,
                            resource,
                        },
                    },
                    update: {},
                    create: {
                        action,
                        resource,
                        description: `Can ${action} ${resource}`,
                    },
                });
            }
        }
    }
};
