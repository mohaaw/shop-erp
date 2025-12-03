import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { accountingService } from './accounting-service';

export interface Invoice {
    id: string;
    number: string;
    customerId: string;
    orderId?: string;
    date: string;
    dueDate: string;
    status: 'draft' | 'posted' | 'paid' | 'cancelled';
    totalAmount: number;
    taxAmount: number;
    journalEntryId?: string;
    createdAt: string;
    updatedAt: string;
    items?: InvoiceItem[];
    customerName?: string;
}

export interface InvoiceItem {
    id: string;
    invoiceId: string;
    productId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    amount: number;
    productName?: string;
}

export const invoiceService = {
    createInvoice: async (data: Omit<Invoice, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'totalAmount' | 'taxAmount'>, items: Omit<InvoiceItem, 'id' | 'invoiceId' | 'amount'>[]) => {
        const id = uuidv4();
        const now = new Date().toISOString();

        // Calculate totals
        let totalAmount = 0;
        let taxAmount = 0;

        const processedItems = items.map(item => {
            const amount = item.quantity * item.unitPrice;
            const tax = amount * (item.taxRate / 100);
            totalAmount += amount + tax;
            taxAmount += tax;
            return { ...item, id: uuidv4(), amount };
        });

        const insertInvoice = db.prepare(`
            INSERT INTO Invoice (id, number, customerId, orderId, date, dueDate, status, totalAmount, taxAmount, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?)
        `);

        const insertItem = db.prepare(`
            INSERT INTO InvoiceItem (id, invoiceId, productId, description, quantity, unitPrice, taxRate, amount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const transaction = db.transaction(() => {
            insertInvoice.run(id, data.number, data.customerId, data.orderId || null, data.date, data.dueDate, totalAmount, taxAmount, now, now);

            for (const item of processedItems) {
                insertItem.run(item.id, id, item.productId, item.description, item.quantity, item.unitPrice, item.taxRate, item.amount);
            }
        });

        transaction();
        return { id, ...data, status: 'draft', totalAmount, taxAmount, items: processedItems };
    },

    getInvoices: async (): Promise<Invoice[]> => {
        const invoices = db.prepare(`
            SELECT i.*, c.name as customerName 
            FROM Invoice i
            JOIN Customer c ON i.customerId = c.id
            ORDER BY i.date DESC
        `).all() as Invoice[];
        return invoices;
    },

    getInvoiceById: async (id: string): Promise<Invoice | null> => {
        const invoice = db.prepare(`
            SELECT i.*, c.name as customerName 
            FROM Invoice i
            JOIN Customer c ON i.customerId = c.id
            WHERE i.id = ?
        `).get(id) as Invoice;

        if (!invoice) return null;

        const items = db.prepare(`
            SELECT ii.*, p.name as productName
            FROM InvoiceItem ii
            JOIN Product p ON ii.productId = p.id
            WHERE ii.invoiceId = ?
        `).all(id) as InvoiceItem[];

        return { ...invoice, items };
    },

    postInvoice: async (id: string) => {
        const invoice = await invoiceService.getInvoiceById(id);
        if (!invoice) throw new Error("Invoice not found");
        if (invoice.status !== 'draft') throw new Error("Only draft invoices can be posted");

        // 1. Create Journal Entry
        // Debit: Accounts Receivable (Asset)
        // Credit: Sales Income (Income)
        // Credit: Tax Payable (Liability) - if tax > 0

        // TODO: Fetch real account IDs from settings or defaults
        // For now, we'll try to find accounts by code or create defaults if missing
        // This is a simplification. In a real app, we'd have a Settings page to map these.

        const accounts = await accountingService.getAccounts();
        let arAccount = accounts.find(a => a.code === '1100'); // Accounts Receivable
        let incomeAccount = accounts.find(a => a.code === '4000'); // Sales Income
        let taxAccount = accounts.find(a => a.code === '2100'); // Tax Payable

        // Fallback: Use first matching type if specific code not found
        if (!arAccount) arAccount = accounts.find(a => a.type === 'Asset');
        if (!incomeAccount) incomeAccount = accounts.find(a => a.type === 'Income');
        if (!taxAccount) taxAccount = accounts.find(a => a.type === 'Liability');

        if (!arAccount || !incomeAccount) {
            throw new Error("Cannot post invoice: Missing AR or Income accounts. Please set up Chart of Accounts.");
        }

        const journalItems = [
            {
                accountId: arAccount.id,
                debit: invoice.totalAmount,
                credit: 0
            },
            {
                accountId: incomeAccount.id,
                debit: 0,
                credit: invoice.totalAmount - invoice.taxAmount
            }
        ];

        if (invoice.taxAmount > 0 && taxAccount) {
            journalItems.push({
                accountId: taxAccount.id,
                debit: 0,
                credit: invoice.taxAmount
            });
        }

        const journalEntry = await accountingService.createJournalEntry({
            date: invoice.date,
            reference: invoice.number,
            description: `Invoice ${invoice.number} for ${invoice.customerName}`,
            status: 'posted'
        }, journalItems);

        // 2. Update Invoice Status
        const update = db.prepare(`
            UPDATE Invoice 
            SET status = 'posted', journalEntryId = ?, updatedAt = ?
            WHERE id = ?
        `);

        update.run(journalEntry.id, new Date().toISOString(), id);

        return { ...invoice, status: 'posted', journalEntryId: journalEntry.id };
    }
};
