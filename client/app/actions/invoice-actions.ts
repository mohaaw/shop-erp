'use server';

import { invoiceService, Invoice, InvoiceItem } from '@/lib/services/invoice-service';
import { revalidatePath } from 'next/cache';

export async function getInvoicesAction() {
    return await invoiceService.getInvoices();
}

export async function getInvoiceAction(id: string) {
    return await invoiceService.getInvoiceById(id);
}

export async function createInvoiceAction(data: Omit<Invoice, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'totalAmount' | 'taxAmount'>, items: Omit<InvoiceItem, 'id' | 'invoiceId' | 'amount'>[]) {
    const invoice = await invoiceService.createInvoice(data, items);
    revalidatePath('/dashboard/finance/invoices');
    return invoice;
}

export async function postInvoiceAction(id: string) {
    await invoiceService.postInvoice(id);
    revalidatePath(`/dashboard/finance/invoices/${id}`);
    revalidatePath('/dashboard/finance/invoices');
    revalidatePath('/dashboard/finance/general-ledger');
    revalidatePath('/dashboard/finance/reports'); // Update reports as well
}
