'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CategoryTable } from '@/components/products/category-table';
import { Plus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Category } from '@/types/product';
import { getCategoriesAction } from '@/app/actions/category-actions';

export default function CategoriesPage() {
    const t = useTranslations('Categories');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategoriesAction();
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-white">{t('title')}</h1>
                    <p className="text-secondary-500 dark:text-secondary-400">
                        {t('subtitle')}
                    </p>
                </div>
                <Link href="/dashboard/categories/new" className="inline-flex items-center justify-center font-medium rounded-md transition-theme focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 px-4 py-2 text-md">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('addCategory')}
                </Link>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <CategoryTable data={categories} />
            )}
        </div>
    );
}
