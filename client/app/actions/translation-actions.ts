'use server';

import { translationService } from '@/lib/services/translation-service';
import { revalidatePath } from 'next/cache';

export async function getTranslationsAction(locale: string) {
    return await translationService.getFlatTranslations(locale);
}

export async function updateTranslationAction(key: string, value: string, locale: string) {
    const result = await translationService.updateTranslation(key, value, locale);
    if (result.success) {
        revalidatePath('/'); // Revalidate all paths to reflect translation changes
    }
    return result;
}
