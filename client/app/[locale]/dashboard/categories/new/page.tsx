'use client';

import { useTranslations } from 'next-intl';
import { CategoryForm } from '@/components/products/category-form';

export default function NewCategoryPage() {
    const t = useTranslations('Categories');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-white">{t('new.title')}</h1>
                <p className="text-secondary-500 dark:text-secondary-400">
                    {t('new.subtitle')}
                </p>
            </div>
            <CategoryForm />
        </div>
    );
}
