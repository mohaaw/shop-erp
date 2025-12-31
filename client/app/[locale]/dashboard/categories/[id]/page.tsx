'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CategoryForm } from '@/components/products/category-form';
import { getCategoryAction } from '@/app/actions/category-actions';
import { Category } from '@/types/product';

export default function EditCategoryPage({ params }: { params: { id: string } }) {
    const t = useTranslations('Categories');
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const data = await getCategoryAction(params.id);
                if (data) {
                    setCategory(data);
                }
            } catch (error) {
                console.error('Failed to fetch category:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [params.id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!category) {
        return <div>Category not found</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-white">{t('edit.title')}</h1>
                <p className="text-secondary-500 dark:text-secondary-400">
                    {t('edit.subtitle')}
                </p>
            </div>
            <CategoryForm initialData={category} />
        </div>
    );
}
