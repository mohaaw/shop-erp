import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { accountingService } from './accounting-service';
import { invoiceService } from './invoice-service';
import { purchaseInvoiceService } from './purchase-invoice-service';

export interface Payment {
    id: string;
    date: string;
    type: 'receive' | 'send';
    amount: number;
    paymentMethod: 'Cash' | 'Bank';
    reference?: string;
    invoiceId: string;
    invoiceType: 'invoice' | 'purchase_invoice';
    journalEntryId?: string;
    createdAt: string;
    updatedAt: string;
}

export const paymentService = {
    createPayment: async (data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'journalEntryId'>) => {
        const id = uuidv4();
        const now = new Date().toISOString();

        // 1. Validate Invoice
        let invoice;
        let entityName = '';
        if (data.invoiceType === 'invoice') {
            invoice = await invoiceService.getInvoiceById(data.invoiceId);
            if (!invoice) throw new Error("Invoice not found");
            entityName = invoice.customerName || 'Customer';
        } else {
            invoice = await purchaseInvoiceService.getInvoiceById(data.invoiceId);
            if (!invoice) throw new Error("Purchase Invoice not found");
            entityName = invoice.supplierName || 'Supplier';
        }

        // 2. Create Journal Entry
        const accounts = await accountingService.getAccounts();

        // Find Accounts
        const bankAccount = accounts.find(a => a.name === 'Bank' || a.name === 'Cash' || a.type === 'Asset'); // Simplified
        const arAccount = accounts.find(a => a.code === '1100'); // Accounts Receivable
        const apAccount = accounts.find(a => a.code === '2000'); // Accounts Payable

        if (!bankAccount) throw new Error("Bank/Cash account not found");

        const journalItems = [];

        if (data.type === 'receive') {
            if (!arAccount) throw new Error("AR Account not found");
            // Debit Bank, Credit AR
            journalItems.push({ accountId: bankAccount.id, debit: data.amount, credit: 0 });
            journalItems.push({ accountId: arAccount.id, debit: 0, credit: data.amount });
        } else {
            if (!apAccount) throw new Error("AP Account not found");
            // Debit AP, Credit Bank
            journalItems.push({ accountId: apAccount.id, debit: data.amount, credit: 0 });
            journalItems.push({ accountId: bankAccount.id, debit: 0, credit: data.amount });
        }

        const journalEntry = await accountingService.createJournalEntry({
            date: data.date,
            reference: data.reference || `Payment for ${invoice.number}`,
            description: `Payment ${data.type === 'receive' ? 'from' : 'to'} ${entityName}`,
            status: 'posted'
        }, journalItems);

        // 3. Create Payment Record
        const insert = db.prepare(`
            INSERT INTO Payment (id, date, type, amount, paymentMethod, reference, invoiceId, invoiceType, journalEntryId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        insert.run(id, data.date, data.type, data.amount, data.paymentMethod, data.reference || null, data.invoiceId, data.invoiceType, journalEntry.id, now, now);

        // 4. Update Invoice Status (Simplified: Assume full payment for now)
        // In a real system, we'd check if total paid >= invoice total
        const updateStatus = db.prepare(`
            UPDATE ${data.invoiceType === 'invoice' ? 'Invoice' : 'PurchaseInvoice'}
            SET status = 'paid', updatedAt = ?
            WHERE id = ?
        `);
        updateStatus.run(now, data.invoiceId);

        return { id, ...data, journalEntryId: journalEntry.id, createdAt: now, updatedAt: now };
    }
};
