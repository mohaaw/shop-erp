import { getPaymentsAction } from '@/app/actions/finance-actions';
import { PaymentsClient } from './payments-client';

export default async function PaymentsPage() {
    const payments = await getPaymentsAction();

    return <PaymentsClient payments={payments} />;
}
