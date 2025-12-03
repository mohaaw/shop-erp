'use server';

import { accountingService } from '@/lib/services/accounting-service';
import { revalidatePath } from 'next/cache';

export async function getChartOfAccountsAction() {
    return await accountingService.getChartOfAccounts();
}

export async function createAccountAction(formData: FormData) {
    const name = formData.get('name') as string;
    const code = formData.get('code') as string;
    const type = formData.get('type') as 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
    const parentId = formData.get('parentId') as string;
    const isGroup = formData.get('isGroup') === 'on';

    await accountingService.createAccount({
        name,
        code,
        type,
        parentId: parentId || null,
        isGroup
    });

    revalidatePath('/dashboard/finance/chart-of-accounts');
}

export async function getJournalEntriesAction() {
    return await accountingService.getJournalEntries();
}

export async function getGeneralLedgerAction(accountId?: string, startDate?: string, endDate?: string) {
    return await accountingService.getGeneralLedger(accountId, startDate, endDate);
}

export async function getAccountsAction() {
    return await accountingService.getAccounts();
}

export async function getBalanceSheetAction() {
    return await accountingService.getBalanceSheet();
}

export async function getProfitAndLossAction(startDate?: string, endDate?: string) {
    return await accountingService.getProfitAndLoss(startDate, endDate);
}

export async function getAgingReportAction(type: 'AR' | 'AP') {
    return await accountingService.getAgingReport(type);
}

export async function getCashFlowStatementAction(startDate?: string, endDate?: string) {
    return await accountingService.getCashFlowStatement(startDate, endDate);
}

export async function createJournalEntryAction(data: {
    date: string;
    reference: string;
    description: string;
    items: { accountId: string; debit: number; credit: number }[];
}) {
    await accountingService.createJournalEntry({
        date: data.date,
        reference: data.reference,
        description: data.description,
        status: 'posted' // Auto-post for now
    }, data.items);

    revalidatePath('/dashboard/finance/journal-entries');
    revalidatePath('/dashboard/finance/chart-of-accounts');
}
