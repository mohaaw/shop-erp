import { StockTransferForm } from '@/components/inventory/stock-transfer-form';
import { getProductsAction } from '@/app/actions/product-actions';
import { getLocationsAction } from '@/app/actions/inventory-actions';
import { Product } from '@/types/product';

export default async function NewStockTransferPage() {
    const productsResult = await getProductsAction();
    const products = productsResult.success ? (productsResult.products as Product[]) : [];
    const locations = await getLocationsAction();

    return <StockTransferForm products={products} locations={locations} />;
}
