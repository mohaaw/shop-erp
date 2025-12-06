'use server';

import { userService } from '@/lib/services/user-service';
import { revalidatePath } from 'next/cache';

export async function getCurrentUserAction() {
    // TEMPORARY: Get the first user (Admin)
    // In a real app, we would use getServerSession(authOptions) here.
    const user = userService.getUserByEmail('admin@example.com');
    return user;
}

import { writeFile } from 'fs/promises';
import path from 'path';

export async function updateProfileAction(userId: string, formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const bio = formData.get('bio') as string;
        const avatarFile = formData.get('avatarFile') as File | null;
        let avatar = formData.get('avatar') as string;

        if (avatarFile && avatarFile.size > 0) {
            const buffer = Buffer.from(await avatarFile.arrayBuffer());
            const filename = `${userId}-${Date.now()}${path.extname(avatarFile.name)}`;
            const uploadPath = path.join(process.cwd(), 'public/uploads', filename);

            await writeFile(uploadPath, buffer);
            avatar = `/uploads/${filename}`;
        }

        const data = { name, email, bio, avatar };
        const updatedUser = userService.updateProfile(userId, data);
        revalidatePath('/dashboard/settings/profile');
        return { success: true, user: updatedUser };
    } catch (error) {
        console.error('Failed to update profile:', error);
        return { success: false, error: 'Failed to update profile' };
    }
}
