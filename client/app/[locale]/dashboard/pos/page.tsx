import { getPosProductsAction } from '@/app/actions/product-actions';
import { PosInterface } from '@/components/pos/pos-interface';
import { getTranslations } from 'next-intl/server';
import { Product } from '@/types/product';

export default async function PosPage() {
  const t = await getTranslations('POS');
  const { products } = await getPosProductsAction();

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t('title') || 'Point of Sale'}</h1>
      </div>
      <PosInterface products={(products as Product[]) || []} />
    </div>
  );
}
