import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'ar'];

export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming `locale` parameter is valid
    // If invalid, fallback to 'en' to avoid "notFound() in root layout" error
    const validLocale = (locales.includes(locale as any) ? locale : 'en') as string;

    return {
        locale: validLocale,
        messages: (await import(`../messages/${validLocale}.json`)).default
    };
});
