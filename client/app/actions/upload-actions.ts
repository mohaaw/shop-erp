'use server';

import { writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function uploadImageAction(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) {
        return { success: false, error: 'No file provided' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate file type (basic)
    if (!file.type.startsWith('image/')) {
        return { success: false, error: 'Invalid file type. Only images are allowed.' };
    }

    const originalName = file.name;
    const extension = originalName.split('.').pop();
    const fileName = `${randomUUID()}.${extension}`;
    const path = join(process.cwd(), 'public', 'uploads', fileName);

    try {
        await writeFile(path, buffer);
        return { success: true, url: `/uploads/${fileName}` };
    } catch (error) {
        console.error('Error saving file:', error);
        return { success: false, error: 'Failed to save file' };
    }
}
