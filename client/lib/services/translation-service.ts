import { promises as fs } from 'fs';
import path from 'path';

export interface TranslationTerm {
    key: string;
    value: string;
    originalValue?: string; // English value
}

const MESSAGES_DIR = path.join(process.cwd(), 'messages');

export const translationService = {
    getFlatTranslations: async (locale: string): Promise<Record<string, string>> => {
        try {
            const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const messages = JSON.parse(fileContent);
            return flattenMessages(messages);
        } catch (error) {
            console.error(`Failed to load translations for ${locale}:`, error);
            return {};
        }
    },

    updateTranslation: async (key: string, value: string, locale: string) => {
        try {
            const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            let messages = JSON.parse(fileContent);

            // Update the nested key
            messages = setNestedValue(messages, key, value);

            await fs.writeFile(filePath, JSON.stringify(messages, null, 2), 'utf-8');
            return { success: true };
        } catch (error) {
            console.error(`Failed to update translation for ${locale}:`, error);
            return { success: false, error };
        }
    },

    // Helper to get both source (en) and target translations for the editor
    getEditorTranslations: async (targetLocale: string) => {
        const enFlat = await translationService.getFlatTranslations('en');
        const targetFlat = targetLocale === 'en' ? enFlat : await translationService.getFlatTranslations(targetLocale);

        const terms: TranslationTerm[] = [];
        const allKeys = new Set([...Object.keys(enFlat), ...Object.keys(targetFlat)]);

        allKeys.forEach(key => {
            terms.push({
                key,
                value: targetFlat[key] || '',
                originalValue: enFlat[key] || ''
            });
        });

        return terms.sort((a, b) => a.key.localeCompare(b.key));
    }
};

// Helper functions
type NestedMessages = {
    [key: string]: string | NestedMessages;
};

function flattenMessages(nestedMessages: NestedMessages, prefix = ''): Record<string, string> {
    return Object.keys(nestedMessages).reduce((messages: Record<string, string>, key) => {
        const value = nestedMessages[key];
        const prefixedKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'string') {
            messages[prefixedKey] = value;
        } else {
            Object.assign(messages, flattenMessages(value, prefixedKey));
        }

        return messages;
    }, {});
}

function setNestedValue(obj: NestedMessages, path: string, value: string) {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lastObj = keys.reduce((o: any, key) => o[key] = o[key] || {}, obj);
    lastObj[lastKey] = value;
    return obj;
}
