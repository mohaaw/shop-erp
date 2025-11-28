'use client';

import { useTranslations } from 'next-intl';
import { ProductForm } from '@/components/products/product-form';

export default function NewProductPage() {
    const t = useTranslations('Products.new');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-white">{t('title')}</h1>
                <p className="text-secondary-500 dark:text-secondary-400">
                    {t('subtitle')}
                </p>
            </div>
            <ProductForm />
        </div>
    );
}
