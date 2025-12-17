'use client';

import { useState } from 'react';
import { RoleWithPermissions, Permission } from '@/lib/services/role-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createRoleAction, updateRoleAction, deleteRoleAction } from '@/app/actions/role-actions';

interface RoleEditorProps {
    initialRoles: RoleWithPermissions[];
    allPermissions: Permission[];
}

export function RoleEditor({ initialRoles, allPermissions }: RoleEditorProps) {
    const [roles, setRoles] = useState<RoleWithPermissions[]>(initialRoles);
    const [loading, setLoading] = useState(false);
    const [isNewRoleDialogOpen, setIsNewRoleDialogOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleDescription, setNewRoleDescription] = useState('');

    // Group permissions by resource
    const resources = Array.from(new Set(allPermissions.map((p) => p.resource))).sort();
    const actions = ['read', 'create', 'update', 'delete'];

    const getPermissionId = (resource: string, action: string) => {
        return allPermissions.find((p) => p.resource === resource && p.action === action)?.id;
    };

    const hasPermission = (role: RoleWithPermissions, resource: string, action: string) => {
        const permId = getPermissionId(resource, action);
        if (!permId) return false;
        return role.permissions.some((p) => p.id === permId);
    };

    const togglePermission = async (roleIndex: number, resource: string, action: string) => {
        const role = roles[roleIndex];
        const permId = getPermissionId(resource, action);
        if (!permId) return;

        const hasPerm = hasPermission(role, resource, action);
        let newPermissions = [...role.permissions];

        if (hasPerm) {
            newPermissions = newPermissions.filter((p) => p.id !== permId);
        } else {
            const perm = allPermissions.find((p) => p.id === permId);
            if (perm) newPermissions.push(perm);
        }

        const updatedRoles = [...roles];
        updatedRoles[roleIndex] = { ...role, permissions: newPermissions };
        setRoles(updatedRoles);

        // Optimistic update, but we should save to server
        // For better UX, we can save on toggle or have a global save button.
        // Let's save on toggle for "live" feel, but show loading state.

        // Actually, let's just update local state and have a "Save" button per role or global?
        // "Odoo-like" usually saves on blur or has a save button.
        // Given the complexity, let's trigger a save immediately.

        try {
            const result = await updateRoleAction(role.id, {
                permissionIds: newPermissions.map(p => p.id)
            });
            if (!result.success) {
                toast.error('Failed to update permission');
                // Revert
                setRoles(roles);
            }
        } catch {
            toast.error('Failed to update permission');
            setRoles(roles);
        }
    };

    const handleCreateRole = async () => {
        if (!newRoleName.trim()) return;
        setLoading(true);
        try {
            const result = await createRoleAction({
                name: newRoleName,
                description: newRoleDescription,
                permissionIds: [],
            });
            if (result.success) {
                toast.success('Role created');
                setIsNewRoleDialogOpen(false);
                setNewRoleName('');
                setNewRoleDescription('');
                // Refresh data? We need to fetch the new role with ID.
                // Since we don't have the full role object returned from action (yet), 
                // we rely on revalidatePath and parent refresh, but here we are client side.
                // Ideally the action returns the new role.
                // For now, let's reload the page or assume the parent passes new data?
                // Actually, `initialRoles` won't update unless page reloads.
                window.location.reload();
            } else {
                toast.error('Failed to create role');
            }
        } catch {
            toast.error('Failed to create role');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRole = async (roleId: string) => {
        if (!confirm('Are you sure you want to delete this role?')) return;
        try {
            const result = await deleteRoleAction(roleId);
            if (result.success) {
                toast.success('Role deleted');
                setRoles(roles.filter((r) => r.id !== roleId));
            } else {
                toast.error('Failed to delete role');
            }
        } catch {
            toast.error('Failed to delete role');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Role Permissions Matrix</h2>
                <Dialog open={isNewRoleDialogOpen} onOpenChange={setIsNewRoleDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            New Role
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Role</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Role Name</Label>
                                <Input
                                    value={newRoleName}
                                    onChange={(e) => setNewRoleName(e.target.value)}
                                    placeholder="e.g., Sales Manager"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input
                                    value={newRoleDescription}
                                    onChange={(e) => setNewRoleDescription(e.target.value)}
                                    placeholder="Optional description"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateRole} disabled={loading}>
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Create Role
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Resource</TableHead>
                            {roles.map((role) => (
                                <TableHead key={role.id} className="text-center min-w-[120px]">
                                    <div className="flex flex-col items-center gap-1">
                                        <span>{role.name}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-destructive hover:text-destructive"
                                            onClick={() => handleDeleteRole(role.id)}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {resources.map((resource) => (
                            <TableRow key={resource}>
                                <TableCell className="font-medium capitalize">
                                    {resource}
                                </TableCell>
                                {roles.map((role, roleIndex) => (
                                    <TableCell key={role.id} className="text-center">
                                        <div className="flex justify-center gap-1">
                                            {actions.map((action) => {
                                                const permId = getPermissionId(resource, action);
                                                if (!permId) return null;
                                                const isChecked = hasPermission(role, resource, action);

                                                // Color coding for actions
                                                const colorClass =
                                                    action === 'read' ? 'text-blue-500' :
                                                        action === 'create' ? 'text-green-500' :
                                                            action === 'update' ? 'text-orange-500' :
                                                                'text-red-500';

                                                return (
                                                    <div key={action} className="flex flex-col items-center" title={`${action} ${resource}`}>
                                                        <span className={`text-[10px] uppercase mb-0.5 ${colorClass}`}>{action[0]}</span>
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onCheckedChange={() => togglePermission(roleIndex, resource, action)}
                                                            className="h-4 w-4"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
