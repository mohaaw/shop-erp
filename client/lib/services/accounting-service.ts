import "server-only";
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

    getGeneralLedger: async (accountId?: string, startDate?: string, endDate?: string) => {
        let query = `
            SELECT ji.*, je.date, je.reference, je.description, a.name as accountName, a.code as accountCode
            FROM JournalItem ji
            JOIN JournalEntry je ON ji.journalEntryId = je.id
            JOIN Account a ON ji.accountId = a.id
            WHERE je.status = 'posted'
        `;

        const params: (string | number)[] = [];

        if (accountId) {
            query += ` AND ji.accountId = ?`;
            params.push(accountId);
        }

        if (startDate) {
            query += ` AND je.date >= ?`;
            params.push(startDate);
        }

        if (endDate) {
            query += ` AND je.date <= ?`;
            params.push(endDate);
        }

        query += ` ORDER BY je.date DESC, je.createdAt DESC`;

        return db.prepare(query).all(...params) as (JournalItem & { date: string, reference: string, description: string, accountCode: string })[];
    },

    getAccounts: async (): Promise<Account[]> => {
        return db.prepare('SELECT * FROM Account ORDER BY code').all() as Account[];
    },

    getBalanceSheet: async () => {
        const accounts = db.prepare('SELECT * FROM Account WHERE type IN (\'Asset\', \'Liability\', \'Equity\') ORDER BY code').all() as Account[];

        // Calculate balances from JournalItems
        // Note: This is a simplified calculation. In a real system, we'd sum up all JournalItems for each account.
        // For now, we rely on the `balance` field in Account table which we update on Journal Entry creation.

        const assets = accounts.filter(a => a.type === 'Asset');
        const liabilities = accounts.filter(a => a.type === 'Liability');
        const equity = accounts.filter(a => a.type === 'Equity');

        const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
        const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0);
        const totalEquity = equity.reduce((sum, a) => sum + a.balance, 0);

        return {
            assets,
            liabilities,
            equity,
            totalAssets,
            totalLiabilities,
            totalEquity
        };
    },

    getProfitAndLoss: async (startDate?: string, endDate?: string) => {
        // For P&L, we need to sum journal items within the period, not just the current balance
        let query = `
            SELECT a.id, a.name, a.code, a.type, SUM(ji.credit - ji.debit) as periodBalance
            FROM Account a
            JOIN JournalItem ji ON a.id = ji.accountId
            JOIN JournalEntry je ON ji.journalEntryId = je.id
            WHERE a.type IN ('Income', 'Expense')
            AND je.status = 'posted'
        `;

        const params: (string | number)[] = [];

        if (startDate) {
            query += ` AND je.date >= ?`;
            params.push(startDate);
        }

        if (endDate) {
            query += ` AND je.date <= ?`;
            params.push(endDate);
        }

        query += ` GROUP BY a.id, a.name, a.code, a.type ORDER BY a.code`;

        const results = db.prepare(query).all(...params) as (Account & { periodBalance: number })[];

        const income = results.filter(a => a.type === 'Income');
        const expenses = results.filter(a => a.type === 'Expense');

        // Income usually has Credit balance (negative in our simplified logic? No, let's check)
        // In our createJournalEntry:
        // updateBalance.run(item.debit, item.credit, item.accountId);
        // UPDATE Account SET balance = balance + ? - ? (Debit - Credit)
        // So Assets/Expense (Debit normal) increase with Debit.
        // Liabilities/Equity/Income (Credit normal) decrease with Debit (increase with Credit).
        // Wait, if Balance = Debit - Credit:
        // Asset (Dr): 100 - 0 = 100 (Positive)
        // Income (Cr): 0 - 100 = -100 (Negative)

        // So for P&L:
        // Income (Credit normal) should be displayed as positive. Since Balance is (Dr-Cr), it's negative. So we negate it.
        // Expense (Debit normal) is positive.

        // However, the query above does SUM(ji.credit - ji.debit).
        // So Credit - Debit.
        // Income (Cr > Dr): Positive result. Correct.
        // Expense (Dr > Cr): Negative result. 

        // Let's adjust:
        // Income: Want positive. (Credit - Debit) is positive.
        // Expense: Want positive. (Debit - Credit) is positive.

        const incomeTotal = income.reduce((sum, a) => sum + (a.periodBalance || 0), 0);
        const expenseTotal = expenses.reduce((sum, a) => sum + (-(a.periodBalance || 0)), 0); // Negate because query is Cr-Dr, Expense is Dr-Cr

        return {
            income: income.map(a => ({ ...a, balance: a.periodBalance })),
            expenses: expenses.map(a => ({ ...a, balance: -(a.periodBalance) })),
            totalIncome: incomeTotal,
            totalExpenses: expenseTotal,
            netProfit: incomeTotal - expenseTotal
        };
    },

    getAgingReport: async (type: 'AR' | 'AP') => {
        const today = new Date().toISOString().split('T')[0];
        let query = '';

        if (type === 'AR') {
            query = `
                SELECT 
                    c.name as entityName,
                    i.totalAmount,
                    i.dueDate,
                    (julianday('${today}') - julianday(i.dueDate)) as daysOverdue
                FROM Invoice i
                JOIN Customer c ON i.customerId = c.id
                WHERE i.status = 'posted'
            `;
        } else {
            query = `
                SELECT 
                    s.name as entityName,
                    i.totalAmount,
                    i.dueDate,
                    (julianday('${today}') - julianday(i.dueDate)) as daysOverdue
                FROM PurchaseInvoice i
                JOIN Supplier s ON i.supplierId = s.id
                WHERE i.status = 'posted'
            `;
        }

        const invoices = db.prepare(query).all() as { entityName: string, totalAmount: number, dueDate: string, daysOverdue: number }[];

        // Group by Entity
        const report: Record<string, { current: number, days30: number, days60: number, days90: number, days90plus: number, total: number }> = {};

        for (const inv of invoices) {
            if (!report[inv.entityName]) {
                report[inv.entityName] = { current: 0, days30: 0, days60: 0, days90: 0, days90plus: 0, total: 0 };
            }

            const entry = report[inv.entityName];
            entry.total += inv.totalAmount;

            if (inv.daysOverdue <= 0) {
                entry.current += inv.totalAmount;
            } else if (inv.daysOverdue <= 30) {
                entry.days30 += inv.totalAmount;
            } else if (inv.daysOverdue <= 60) {
                entry.days60 += inv.totalAmount;
            } else if (inv.daysOverdue <= 90) {
                entry.days90 += inv.totalAmount;
            } else {
                entry.days90plus += inv.totalAmount;
            }
        }

        return Object.entries(report).map(([name, data]) => ({
            name,
            ...data
        }));
    },

    getCashFlowStatement: async (startDate?: string, endDate?: string) => {
        // Cash Flow Statement shows cash movements categorized by:
        // 1. Operating Activities (day-to-day business)
        // 2. Investing Activities (assets, investments)
        // 3. Financing Activities (debt, equity)

        // For simplicity, we'll analyze journal entries and categorize based on account types
        let query = `
            SELECT ji.*, je.date, a.name as accountName, a.code as accountCode, a.type as accountType
            FROM JournalItem ji
            JOIN JournalEntry je ON ji.journalEntryId = je.id
            JOIN Account a ON ji.accountId = a.id
            WHERE je.status = 'posted'
        `;

        const params: (string | number)[] = [];

        if (startDate) {
            query += ` AND je.date >= ?`;
            params.push(startDate);
        }

        if (endDate) {
            query += ` AND je.date <= ?`;
            params.push(endDate);
        }

        query += ` ORDER BY je.date`;

        const items = db.prepare(query).all(...params) as (JournalItem & {
            date: string,
            accountName: string,
            accountCode: string,
            accountType: string
        })[];

        // Calculate cash movements
        // Operating: Income and Expense accounts, AR, AP
        // Investing: Asset purchases/sales (excluding cash/AR)
        // Financing: Equity and Liability changes (excluding AP)

        let operatingCash = 0;
        let investingCash = 0;
        let financingCash = 0;

        for (const item of items) {
            const cashFlow = item.debit - item.credit; // Positive = cash in, Negative = cash out

            // Categorize based on account type and code
            if (item.accountType === 'Income' || item.accountType === 'Expense') {
                // Operating activities
                operatingCash += cashFlow;
            } else if (item.accountCode.startsWith('11')) { // AR
                operatingCash += cashFlow;
            } else if (item.accountCode.startsWith('20')) { // AP
                operatingCash += cashFlow;
            } else if (item.accountType === 'Asset' && !item.accountCode.startsWith('10')) { // Assets excluding cash
                investingCash += cashFlow;
            } else if (item.accountType === 'Liability' && !item.accountCode.startsWith('20')) { // Liabilities excluding AP
                financingCash += cashFlow;
            } else if (item.accountType === 'Equity') {
                financingCash += cashFlow;
            }
        }

        // Get opening and closing cash balances
        const cashAccount = db.prepare(`
            SELECT balance FROM Account WHERE code LIKE '10%' OR name LIKE '%Cash%' OR name LIKE '%Bank%' LIMIT 1
        `).get() as { balance: number } | undefined;

        const closingCash = cashAccount?.balance || 0;
        const netCashFlow = operatingCash + investingCash + financingCash;
        const openingCash = closingCash - netCashFlow;

        return {
            operatingCash,
            investingCash,
            financingCash,
            netCashFlow,
            openingCash,
            closingCash
        };
    }
};
