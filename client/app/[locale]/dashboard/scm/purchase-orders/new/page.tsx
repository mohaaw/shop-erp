import { PurchaseOrderForm } from '@/components/scm/purchase-order-form';
import { getSuppliersAction } from '@/app/actions/scm-actions';

export default async function NewPurchaseOrderPage() {
    const suppliers = await getSuppliersAction();

    return <PurchaseOrderForm suppliers={suppliers} />;
}
