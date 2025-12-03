import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export interface Account {
    id: string;
    name: string;
    code: string;
    type: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
    parentId?: string | null;
    balance: number;
    isGroup: boolean;
    children?: Account[];
}

export interface JournalEntry {
    id: string;
    date: string;
    reference?: string;
    description?: string;
    status: 'draft' | 'posted' | 'cancelled';
    items: JournalItem[];
}

export interface JournalItem {
    id: string;
    journalEntryId: string;
    accountId: string;
    debit: number;
    credit: number;
    accountName?: string;
}

export const accountingService = {
    getChartOfAccounts: async (): Promise<Account[]> => {
        const accounts = db.prepare('SELECT * FROM Account ORDER BY code').all() as Account[];

        const buildTree = (parentId: string | null = null): Account[] => {
            return accounts
                .filter(acc => acc.parentId === parentId)
                .map(acc => ({
                    ...acc,
                    children: buildTree(acc.id)
                }));
        };

        return buildTree(null);
    },

    createAccount: async (account: Omit<Account, 'id' | 'balance' | 'children'>) => {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO Account (id, name, code, type, parentId, isGroup, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(id, account.name, account.code, account.type, account.parentId || null, account.isGroup ? 1 : 0, now, now);
        return { id, ...account };
    },

    createJournalEntry: async (entry: Omit<JournalEntry, 'id' | 'items'>, items: Omit<JournalItem, 'id' | 'journalEntryId'>[]) => {
        const totalDebit = items.reduce((sum, item) => sum + item.debit, 0);
        const totalCredit = items.reduce((sum, item) => sum + item.credit, 0);

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            throw new Error(`Journal Entry is not balanced. Debit: ${totalDebit}, Credit: ${totalCredit}`);
        }

        const id = uuidv4();
        const now = new Date().toISOString();

        const insertEntry = db.prepare(`
            INSERT INTO JournalEntry (id, date, reference, description, status, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        const insertItem = db.prepare(`
            INSERT INTO JournalItem (id, journalEntryId, accountId, debit, credit)
            VALUES (?, ?, ?, ?, ?)
        `);

        const updateBalance = db.prepare(`
            UPDATE Account SET balance = balance + ? - ? WHERE id = ?
        `);

        const transaction = db.transaction(() => {
            insertEntry.run(id, entry.date, entry.reference || null, entry.description || null, entry.status, now, now);

            for (const item of items) {
                const itemId = uuidv4();
                insertItem.run(itemId, id, item.accountId, item.debit, item.credit);

                // Update account balance (Debit increases Assets/Expenses, Credit increases Liabilities/Equity/Income)
                // Simplified logic: Balance = Debit - Credit for all accounts for now, presentation layer handles sign
                updateBalance.run(item.debit, item.credit, item.accountId);
            }
        });

        transaction();
        return { id, ...entry, items };
    },

    getJournalEntries: async (): Promise<JournalEntry[]> => {
        const entries = db.prepare('SELECT * FROM JournalEntry ORDER BY date DESC').all() as JournalEntry[];
        const items = db.prepare(`
            SELECT ji.*, a.name as accountName 
            FROM JournalItem ji
            JOIN Account a ON ji.accountId = a.id
        `).all() as JournalItem[];

        return entries.map(entry => ({
            ...entry,
            items: items.filter(item => item.journalEntryId === entry.id)
        }));
    },

    getAccounts: async (): Promise<Account[]> => {
        return db.prepare('SELECT * FROM Account ORDER BY code').all() as Account[];
    }
};
