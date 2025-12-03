'use server';

import { taxService, TaxRate } from '@/lib/services/tax-service';
import { revalidatePath } from 'next/cache';

export async function getTaxRatesAction() {
    return taxService.getTaxRates();
}

export async function createTaxRateAction(data: Omit<TaxRate, 'id' | 'createdAt' | 'updatedAt'>) {
    const taxRate = taxService.createTaxRate(data);
    revalidatePath('/dashboard/finance/settings/tax');
    return taxRate;
}
