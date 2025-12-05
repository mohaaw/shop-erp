import { getStockTransfersAction } from '@/app/actions/inventory-actions';
import { StockTransfersClient } from './stock-transfers-client';

export default async function StockTransfersPage() {
    const stockTransfers = await getStockTransfersAction();

    return <StockTransfersClient transfers={stockTransfers} />;
}
