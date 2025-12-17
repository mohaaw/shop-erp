// This file should only contain type definitions for client-side use
// Server-side Prisma operations are in actions and server components

export interface Role {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Permission {
    id: string;
    action: string;
    resource: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RoleWithPermissions extends Role {
    permissions: Permission[];
}

// Client-side API service for role operations
export const roleApiService = {
    async getRoles(): Promise<RoleWithPermissions[]> {
        const response = await fetch('/api/roles');
        if (!response.ok) throw new Error('Failed to fetch roles');
        return response.json();
    },

    async getPermissions(): Promise<Permission[]> {
        const response = await fetch('/api/permissions');
        if (!response.ok) throw new Error('Failed to fetch permissions');
        return response.json();
    }
};
