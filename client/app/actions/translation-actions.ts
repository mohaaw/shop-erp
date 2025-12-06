'use server';

import { translationService } from '@/lib/services/translation-service';
import { revalidatePath } from 'next/cache';

export async function getTranslationsAction(locale: string) {
    // Return the editor-friendly format
    return await translationService.getEditorTranslations(locale);
}

export async function updateTranslationAction(key: string, value: string, locale: string) {
    const result = await translationService.updateTranslation(key, value, locale);
    if (result.success) {
        revalidatePath('/', 'layout'); // Revalidate everything
    }
    return result;
}
