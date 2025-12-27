import "server-only";
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { accountingService } from './accounting-service';

export interface PurchaseInvoice {
    id: string;
    number: string;
    supplierId: string;
    date: string;
    dueDate: string;
    status: 'draft' | 'posted' | 'paid' | 'cancelled';
    totalAmount: number;
    taxAmount: number;
    journalEntryId?: string;
    createdAt: string;
    updatedAt: string;
    items?: PurchaseInvoiceItem[];
    supplierName?: string;
}

export interface PurchaseInvoiceItem {
    id: string;
    invoiceId: string;
    description: string;
    accountId: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    accountName?: string;
}

export const purchaseInvoiceService = {
    createInvoice: async (data: Omit<PurchaseInvoice, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'totalAmount' | 'taxAmount'>, items: Omit<PurchaseInvoiceItem, 'id' | 'invoiceId' | 'amount'>[]) => {
        const id = uuidv4();
        const now = new Date().toISOString();

        // Calculate totals
        let totalAmount = 0;
        const taxAmount = 0; // Simplified: Assuming tax is included or handled separately for now, or 0. Let's assume 0 for simplicity unless we add taxRate to items.

        const processedItems = items.map(item => {
            const amount = item.quantity * item.unitPrice;
            totalAmount += amount;
            return { ...item, id: uuidv4(), amount };
        });

        const insertInvoice = db.prepare(`
            INSERT INTO PurchaseInvoice (id, number, supplierId, date, dueDate, status, totalAmount, taxAmount, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?)
        `);

        const insertItem = db.prepare(`
            INSERT INTO PurchaseInvoiceItem (id, invoiceId, description, accountId, quantity, unitPrice, amount)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        const transaction = db.transaction(() => {
            insertInvoice.run(id, data.number, data.supplierId, data.date, data.dueDate, totalAmount, taxAmount, now, now);

            for (const item of processedItems) {
                insertItem.run(item.id, id, item.description, item.accountId, item.quantity, item.unitPrice, item.amount);
            }
        });

        transaction();
        return { id, ...data, status: 'draft', totalAmount, taxAmount, items: processedItems };
    },

    getInvoices: async (): Promise<PurchaseInvoice[]> => {
        const invoices = db.prepare(`
            SELECT i.*, s.name as supplierName 
            FROM PurchaseInvoice i
            JOIN Supplier s ON i.supplierId = s.id
            ORDER BY i.date DESC
        `).all() as PurchaseInvoice[];
        return invoices;
    },

    getInvoiceById: async (id: string): Promise<PurchaseInvoice | null> => {
        const invoice = db.prepare(`
            SELECT i.*, s.name as supplierName 
            FROM PurchaseInvoice i
            JOIN Supplier s ON i.supplierId = s.id
            WHERE i.id = ?
        `).get(id) as PurchaseInvoice;

        if (!invoice) return null;

        const items = db.prepare(`
            SELECT pii.*, a.name as accountName
            FROM PurchaseInvoiceItem pii
            JOIN Account a ON pii.accountId = a.id
            WHERE pii.invoiceId = ?
        `).all(id) as PurchaseInvoiceItem[];

        return { ...invoice, items };
    },

    postInvoice: async (id: string) => {
        const invoice = await purchaseInvoiceService.getInvoiceById(id);
        if (!invoice) throw new Error("Invoice not found");
        if (invoice.status !== 'draft') throw new Error("Only draft invoices can be posted");

        // 1. Create Journal Entry
        // Debit: Expense Account (from item)
        // Credit: Accounts Payable (Liability)

        const accounts = await accountingService.getAccounts();
        let apAccount = accounts.find(a => a.code === '2000'); // Accounts Payable

        // Fallback
        if (!apAccount) apAccount = accounts.find(a => a.type === 'Liability');

        if (!apAccount) {
            throw new Error("Cannot post invoice: Missing AP account.");
        }

        const journalItems = [];

        // Credit AP (Total Amount)
        journalItems.push({
            accountId: apAccount.id,
            debit: 0,
            credit: invoice.totalAmount
        });

        // Debit Expenses (Per Item)
        if (invoice.items) {
            for (const item of invoice.items) {
                journalItems.push({
                    accountId: item.accountId,
                    debit: item.amount,
                    credit: 0
                });
            }
        }

        const journalEntry = await accountingService.createJournalEntry({
            date: invoice.date,
            reference: invoice.number,
            description: `Purchase Invoice ${invoice.number} from ${invoice.supplierName}`,
            status: 'posted'
        }, journalItems);

        // 2. Update Invoice Status
        const update = db.prepare(`
            UPDATE PurchaseInvoice 
            SET status = 'posted', journalEntryId = ?, updatedAt = ?
            WHERE id = ?
        `);

        update.run(journalEntry.id, new Date().toISOString(), id);

        return { ...invoice, status: 'posted', journalEntryId: journalEntry.id };
    }
};
