import { getPurchaseOrdersAction } from '@/app/actions/scm-actions';
import { PurchaseOrdersClient } from './purchase-orders-client';

export default async function PurchaseOrdersPage() {
    const purchaseOrders = await getPurchaseOrdersAction();

    return <PurchaseOrdersClient orders={purchaseOrders} />;
}
