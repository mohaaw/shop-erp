import { getTranslations } from 'next-intl/server';
import { ProductTable } from '@/components/products/product-table';
import { Plus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getProductsAction } from '@/app/actions/product-actions';
import { Product } from '@/types/product';

export default async function ProductsPage() {
  const t = await getTranslations('Products');
  const { products } = await getProductsAction();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-white">{t('title')}</h1>
          <p className="text-secondary-500 dark:text-secondary-400">
            {t('subtitle')}
          </p>
        </div>
        <Link href="/dashboard/products/new" className="inline-flex items-center justify-center font-medium rounded-md transition-theme focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 px-4 py-2 text-md">
          <Plus className="mr-2 h-4 w-4" />
          {t('addProduct')}
        </Link>
      </div>
      <ProductTable data={(products as Product[]) || []} />
    </div>
  );
}
