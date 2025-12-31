'use server';

import { roleService } from '@/lib/services/role-service';
import { revalidatePath } from 'next/cache';

export async function getRolesAction() {
    return roleService.getRoles();
}

export async function createRoleAction(data: FormData | { name: string; description?: string; permissionIds?: string[] }) {
    // If called from form with FormData, we need to handle it differently, 
    // but the RoleEditor calls it with an object.
    // However, the RoleManagementPage called it with FormData in the original implementation.
    // We should support both or unify.
    // Since RoleEditor is client-side, it probably passes JSON.
    // But let's check input.

    // HACK: To support both signature for now (legacy form and new object)
    // Actually, createRoleAction was: (formData: FormData)
    // RoleEditor calls: createRoleAction({ name: ... }) 
    // This is incompatible. We should change createRoleAction to accept State or Object, or use a separate action?
    // Let's change it to accept object, and update RoleManagementPage form to use client component or Bind?
    // Or check if 'data' is FormData instance.

    try {
        let roleData: { name: string; description: string; permissionIds: string[] };

        if (data instanceof FormData) {
            roleData = {
                name: data.get('roleName') as string,
                description: data.get('roleDesc') as string,
                permissionIds: []
            };
        } else {
            roleData = {
                name: data.name,
                description: data.description || '',
                permissionIds: data.permissionIds || []
            };
        }

        const role = roleService.createRole(roleData);
        revalidatePath('/dashboard/settings/roles');
        return { success: true, role };
    } catch (error) {
        return { success: false, error };
    }
}

export async function createRoleFormAction(formData: FormData) {
    await createRoleAction(formData);
}

export async function deleteRoleAction(id: string) {
    try {
        roleService.deleteRole(id);
        revalidatePath('/dashboard/settings/roles');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

export async function deleteRoleFormAction(id: string) {
    await deleteRoleAction(id);
}

export async function updateRoleAction(id: string, data: { name?: string; description?: string; permissionIds?: string[] }) {
    try {
        const role = roleService.updateRole(id, data);
        revalidatePath('/dashboard/settings/roles');
        return { success: true, role };
    } catch (error) {
        return { success: false, error };
    }
}
