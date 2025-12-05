import { getProductionOrdersAction } from '@/app/actions/manufacturing-actions';
import { ProductionOrdersClient } from './production-orders-client';

export default async function ProductionOrdersPage() {
    const orders = await getProductionOrdersAction();

    return <ProductionOrdersClient orders={orders} />;
}

