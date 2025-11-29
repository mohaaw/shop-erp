
export interface TranslationTerm {
    key: string;
    value: string;
    original: string; // The fallback/original English text
    module: string;   // e.g., 'Common', 'Products', 'Settings'
    updatedAt: string;
}

// Mock database
let MOCK_TRANSLATIONS: Record<string, Record<string, string>> = {
    en: {
        'Common.dashboard': 'Dashboard',
        'Common.save': 'Save',
        'Common.cancel': 'Cancel',
        'Products.title': 'Products',
        'Products.form.name': 'Name',
        'Settings.title': 'Settings',
    },
    ar: {
        'Common.dashboard': 'لوحة التحكم',
        'Common.save': 'حفظ',
        'Common.cancel': 'إلغاء',
        'Products.title': 'المنتجات',
        'Products.form.name': 'الاسم',
        'Settings.title': 'الإعدادات',
    }
};

export const translationService = {
    async getTranslations(locale: string): Promise<TranslationTerm[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const terms = MOCK_TRANSLATIONS[locale] || {};
        const enTerms = MOCK_TRANSLATIONS['en'] || {};

        return Object.entries(enTerms).map(([key, original]) => ({
            key,
            original,
            value: terms[key] || original,
            module: key.split('.')[0],
            updatedAt: new Date().toISOString(),
        }));
    },

    async updateTranslation(key: string, value: string, locale: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));

        if (!MOCK_TRANSLATIONS[locale]) {
            MOCK_TRANSLATIONS[locale] = {};
        }
        MOCK_TRANSLATIONS[locale][key] = value;
        console.log(`Updated [${locale}] ${key} -> ${value}`);
    },

    async searchTranslations(query: string, locale: string): Promise<TranslationTerm[]> {
        const allTerms = await this.getTranslations(locale);
        const lowerQuery = query.toLowerCase();

        return allTerms.filter(term =>
            term.key.toLowerCase().includes(lowerQuery) ||
            term.value.toLowerCase().includes(lowerQuery) ||
            term.original.toLowerCase().includes(lowerQuery)
        );
    }
};
