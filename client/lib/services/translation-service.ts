import { db } from '@/lib/db';

export interface TranslationTerm {
    key: string;
    value: string;
    category?: string;
}

export const translationService = {
    updateTranslation: async (key: string, value: string, locale: string) => {
        try {
            const stmt = db.prepare(`
                INSERT INTO Translation (locale, namespace, key, value, updatedAt)
                VALUES (?, 'common', ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(locale, namespace, key) DO UPDATE SET
                value = excluded.value,
                updatedAt = CURRENT_TIMESTAMP
            `);
            stmt.run(locale, key, value);
            return { success: true };
        } catch (error) {
            console.error('Failed to update translation:', error);
            return { success: false, error };
        }
    },

    getFlatTranslations: async (locale: string): Promise<Record<string, string>> => {
        try {
            const stmt = db.prepare('SELECT key, value FROM Translation WHERE locale = ?');
            const translations = stmt.all(locale) as { key: string; value: string }[];

            const result: Record<string, string> = {};
            translations.forEach((t) => {
                result[t.key] = t.value;
            });

            return result;
        } catch (error) {
            console.error('Failed to fetch translations:', error);
            return {};
        }
    },

    getTranslations: async (locale: string): Promise<Record<string, any>> => {
        try {
            const stmt = db.prepare('SELECT key, value FROM Translation WHERE locale = ?');
            const translations = stmt.all(locale) as { key: string; value: string }[];

            const result: Record<string, any> = {};

            translations.forEach((t) => {
                const parts = t.key.split('.');
                let current = result;
                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i];
                    if (i === parts.length - 1) {
                        current[part] = t.value;
                    } else {
                        current[part] = current[part] || {};
                        current = current[part];
                    }
                }
            });

            return result;
        } catch (error) {
            console.error('Failed to fetch translations:', error);
            return {};
        }
    },

    seed: async (locale: string, messages: Record<string, any>) => {
        try {
            const flatten = (obj: Record<string, any>, prefix = ''): Record<string, string> => {
                return Object.keys(obj).reduce((acc: Record<string, string>, k) => {
                    const pre = prefix.length ? prefix + '.' : '';
                    if (typeof obj[k] === 'object' && obj[k] !== null) {
                        Object.assign(acc, flatten(obj[k], pre + k));
                    } else {
                        acc[pre + k] = String(obj[k]);
                    }
                    return acc;
                }, {});
            };

            const flatMessages = flatten(messages);

            const insert = db.prepare(`
                INSERT INTO Translation (locale, namespace, key, value, updatedAt)
                VALUES (?, 'common', ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(locale, namespace, key) DO NOTHING
            `);

            const insertMany = db.transaction((msgs: Record<string, string>) => {
                for (const [key, value] of Object.entries(msgs)) {
                    insert.run(locale, key, value);
                }
            });

            insertMany(flatMessages);
            console.log(`Seeded translations for ${locale}`);
            return { success: true };
        } catch (error) {
            console.error('Failed to seed translations:', error);
            return { success: false, error };
        }
    }
};
