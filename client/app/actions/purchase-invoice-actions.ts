'use server';

import { purchaseInvoiceService, PurchaseInvoice, PurchaseInvoiceItem } from '@/lib/services/purchase-invoice-service';
import { revalidatePath } from 'next/cache';

export async function getPurchaseInvoicesAction() {
    return await purchaseInvoiceService.getInvoices();
}

export async function getPurchaseInvoiceAction(id: string) {
    return await purchaseInvoiceService.getInvoiceById(id);
}

export async function createPurchaseInvoiceAction(data: Omit<PurchaseInvoice, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'totalAmount' | 'taxAmount'>, items: Omit<PurchaseInvoiceItem, 'id' | 'invoiceId' | 'amount'>[]) {
    const invoice = await purchaseInvoiceService.createInvoice(data, items);
    revalidatePath('/dashboard/finance/purchase-invoices');
    return invoice;
}

export async function postPurchaseInvoiceAction(id: string) {
    await purchaseInvoiceService.postInvoice(id);
    revalidatePath(`/dashboard/finance/purchase-invoices/${id}`);
    revalidatePath('/dashboard/finance/purchase-invoices');
    revalidatePath('/dashboard/finance/general-ledger');
    revalidatePath('/dashboard/finance/reports');
}
