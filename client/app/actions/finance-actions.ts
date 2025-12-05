'use server';

import { financeService, Payment, TaxRate } from '@/lib/services/finance-service';
import { revalidatePath } from 'next/cache';

export async function getPaymentsAction() {
    return financeService.getPayments();
}

export async function createPaymentAction(data: Omit<Payment, 'id' | 'createdAt'>) {
    financeService.createPayment(data);
    revalidatePath('/dashboard/finance/payments');
}

export async function getTaxRatesAction() {
    return financeService.getTaxRates();
}

export async function createTaxRateAction(data: Omit<TaxRate, 'id' | 'createdAt' | 'updatedAt'>) {
    financeService.createTaxRate(data);
    revalidatePath('/dashboard/finance/tax-rates');
}
