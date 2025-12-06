import { getStockAdjustmentsAction } from '@/app/actions/inventory-actions';
import { StockAdjustmentsClient } from './stock-adjustments-client';

export default async function StockAdjustmentsPage() {
    const adjustments = await getStockAdjustmentsAction();

    return <StockAdjustmentsClient adjustments={adjustments} />;
}
