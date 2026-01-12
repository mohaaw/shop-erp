'use server';

import { backupDatabase } from '@/scripts/backup-db';
import { revalidatePath } from 'next/cache';

export async function backupDatabaseAction() {
    try {
        const result = await backupDatabase();
        revalidatePath('/dashboard/settings');
        return result;
    } catch (error) {
        console.error('Action failed:', error);
        return { success: false, error: 'Failed to trigger backup' };
    }
}
