'use server';

import { paymentService, Payment } from '@/lib/services/payment-service';
import { revalidatePath } from 'next/cache';

export async function registerPaymentAction(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'journalEntryId'>) {
    const payment = await paymentService.createPayment(data);

    // Revalidate paths
    revalidatePath('/dashboard/finance/invoices');
    revalidatePath('/dashboard/finance/purchase-invoices');
    revalidatePath(`/dashboard/finance/invoices/${data.invoiceId}`);
    revalidatePath(`/dashboard/finance/purchase-invoices/${data.invoiceId}`);
    revalidatePath('/dashboard/finance/general-ledger');
    revalidatePath('/dashboard/finance/aging-reports');

    return payment;
}
