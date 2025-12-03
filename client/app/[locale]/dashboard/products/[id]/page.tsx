

import { getTranslations } from 'next-intl/server';
import { ProductForm } from '@/components/products/product-form';
import { ProductFormValues } from '@/lib/validations/product';
import { Product } from '@/types/product';

import { getProductAction } from '@/app/actions/product-actions';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
    params: {
        id: string;
    };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const t = await getTranslations('Products.editPage');
    const { product } = await getProductAction(params.id);

    if (!product) {
        notFound();
    }

    // Transform Product to ProductFormValues if necessary, or ensure types match
    // For now, casting or assuming compatibility as ProductFormValues is a subset/similar to Product
    // We might need to map some fields if they differ significantly
    const initialData: ProductFormValues = {
        ...product,
        // Ensure optional fields are handled
        description: product.description || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        category: (product as Product & { categoryId?: string }).categoryId || product.category || '', // Note: ProductService returns category name, but form expects ID/value? 
        // Actually ProductService.getProduct returns raw DB columns, so categoryId is what we have?
        // But Product interface has `category`.
        // I should probably map `categoryId` to `category` in ProductService or here.
        // Let's assume for now we need to map it.
        // category: (product as any).categoryId || '',

        // Map other fields
        type: product.type,
        status: product.status,
        price: product.price,
        cost: product.cost || 0,
        stock: product.stock || 0,
        uom: product.uom || 'unit',
        purchaseUom: product.purchaseUom || 'unit',
        uomRatio: product.uomRatio || 1,
        weight: product.weight || 0,
        volume: product.volume || 0,
        dimensions: product.dimensions || { width: 0, height: 0, depth: 0 },
        hsCode: product.hsCode || '',
        countryOfOrigin: product.countryOfOrigin || '',
        tracking: product.tracking || 'none',
        availableInPos: product.availableInPos || false,
        posCategory: product.posCategory || '',
        hasVariants: product.hasVariants || false,
        attributes: (product.attributes || []).map(attr => ({
            id: attr.id,
            name: attr.name,
            values: attr.values.map(v => ({
                id: v.id,
                value: v.name, // Map name to value
                priceExtra: 0 // Default or fetch if available
            }))
        })),
        minStock: product.minStock || 0,
        images: product.images || [],
        incomeAccount: product.accounts?.income || '',
        expenseAccount: product.accounts?.expense || '',
        customerTaxes: product.taxes?.customer || [],
        vendorTaxes: product.taxes?.vendor || [],
        toppings: product.toppings || '',
        isCombo: product.isCombo || false,
        comboItems: product.comboItems || '',

        // New fields
        brand: product.brand || '',
        model: product.model || '',
        specifications: product.specifications || '',
        warranty: product.warranty || '',
        variants: (product.variants || []).map(v => ({
            id: v.id,
            name: Object.values(v.attributes).join(' / '), // Generate name from attributes
            sku: v.sku,
            price: v.price,
            stock: v.stock,
            attributes: v.attributes
        })),
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-white">{t('title')}</h1>
                <p className="text-secondary-500 dark:text-secondary-400">
                    {t('subtitle')}
                </p>
            </div>
            <ProductForm initialData={initialData} />
        </div>
    );
}
