import { StockAdjustmentForm } from '@/components/inventory/stock-adjustment-form';
import { getProductsAction } from '@/app/actions/product-actions';
import { getLocationsAction } from '@/app/actions/inventory-actions';
import { Product } from '@/types/product';

export default async function NewStockAdjustmentPage() {
    const productsResult = await getProductsAction();
    const products = productsResult.success ? (productsResult.products as Product[]) : [];
    const locations = await getLocationsAction();

    return <StockAdjustmentForm products={products} locations={locations} />;
}
