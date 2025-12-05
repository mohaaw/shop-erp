import { PaymentForm } from '@/components/finance/payment-form';
import { getCustomersAction } from '@/app/actions/customer-actions';
import { getOrdersAction } from '@/app/actions/order-actions';
import { Order } from '@/lib/services/order-service';

export default async function NewPaymentPage() {
    const customers = await getCustomersAction();
    const ordersResult = await getOrdersAction();
    const orders = ordersResult.success ? (ordersResult.data as Order[]) : [];

    return <PaymentForm customers={customers} orders={orders} />;
}
