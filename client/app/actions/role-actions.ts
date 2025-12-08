'use server';

import { roleService } from '@/lib/services/role-service';
import { revalidatePath } from 'next/cache';

export async function getRolesAction() {
    try {
        const roles = await roleService.getRoles();
        return { success: true, data: roles };
    } catch (error) {
        console.error('Failed to fetch roles:', error);
        return { success: false, error: 'Failed to fetch roles' };
    }
}

export async function getPermissionsAction() {
    try {
        // Ensure default permissions exist (lazy init)
        await roleService.ensureDefaultPermissions();
        const permissions = await roleService.getPermissions();
        return { success: true, data: permissions };
    } catch (error) {
        console.error('Failed to fetch permissions:', error);
        return { success: false, error: 'Failed to fetch permissions' };
    }
}

export async function createRoleAction(data: { name: string; description?: string; permissionIds: string[] }) {
    try {
        await roleService.createRole(data);
        revalidatePath('/dashboard/settings/roles');
        return { success: true };
    } catch (error) {
        console.error('Failed to create role:', error);
        return { success: false, error: 'Failed to create role' };
    }
}

export async function updateRoleAction(id: string, data: { name?: string; description?: string; permissionIds?: string[] }) {
    try {
        await roleService.updateRole(id, data);
        revalidatePath('/dashboard/settings/roles');
        return { success: true };
    } catch (error) {
        console.error('Failed to update role:', error);
        return { success: false, error: 'Failed to update role' };
    }
}

export async function deleteRoleAction(id: string) {
    try {
        await roleService.deleteRole(id);
        revalidatePath('/dashboard/settings/roles');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete role:', error);
        return { success: false, error: 'Failed to delete role' };
    }
}
