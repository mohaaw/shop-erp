'use server';

import { userService } from '@/lib/services/user-service';
import { revalidatePath } from 'next/cache';

export async function getCurrentUserAction() {
    // TEMPORARY: Get the first user (Admin)
    // In a real app, we would use getServerSession(authOptions) here.
    const user = userService.getUserByEmail('admin@example.com');
    return user;
}

export async function updateProfileAction(userId: string, data: { name: string; email: string; bio?: string; avatar?: string }) {
    try {
        const updatedUser = userService.updateProfile(userId, data);
        revalidatePath('/dashboard/settings/profile');
        return { success: true, user: updatedUser };
    } catch (error) {
        console.error('Failed to update profile:', error);
        return { success: false, error: 'Failed to update profile' };
    }
}
