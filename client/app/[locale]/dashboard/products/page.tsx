'use client';

import { useTranslations } from 'next-intl';
import { ProductTable } from '@/components/products/product-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Product } from '@/types/product';

// Mock data
const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    sku: 'WH-001',
    price: 99.99,
    stock: 50,
    category: 'Electronics',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Ergonomic Chair',
    sku: 'EC-100',
    price: 249.00,
    stock: 15,
    category: 'Furniture',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    sku: 'MK-88',
    price: 120.50,
    stock: 0,
    category: 'Electronics',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function ProductsPage() {
  const t = useTranslations('Products');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-white">{t('title')}</h1>
          <p className="text-secondary-500 dark:text-secondary-400">
            {t('subtitle')}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" />
            {t('addProduct')}
          </Link>
        </Button>
      </div>
      <ProductTable data={products} />
    </div>
  );
}
