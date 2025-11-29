'use client';

import { useTranslations } from 'next-intl';
import { ProductForm } from '@/components/products/product-form';
import { ProductFormValues } from '@/lib/validations/product';

// Mock data fetcher
const getProduct = (id: string): ProductFormValues => {
    // In a real app, this would fetch from API
    return {
        name: 'Wireless Headphones',
        description: 'High quality wireless headphones with noise cancellation.',
        price: 99.99,
        cost: 50.00,
        sku: 'WH-001',
        barcode: '123456789',
        stock: 50,
        category: 'electronics',
        status: 'active',
        type: 'storable',
        uom: 'unit',
        tracking: 'serial',
        availableInPos: true,
        hasVariants: false,
        attributes: [],
        minStock: 10,
        images: [],
        purchaseUom: 'unit',
        uomRatio: 1,
        isCombo: false,
        comboItems: '',
    };
};

interface EditProductPageProps {
    params: {
        id: string;
    };
}

export default function EditProductPage({ params }: EditProductPageProps) {
    const t = useTranslations('Products.editPage');
    const product = getProduct(params.id);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-white">{t('title')}</h1>
                <p className="text-secondary-500 dark:text-secondary-400">
                    {t('subtitle')}
                </p>
            </div>
            <ProductForm initialData={product} />
        </div>
    );
}
