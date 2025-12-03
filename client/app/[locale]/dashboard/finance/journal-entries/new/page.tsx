import { getAccountsAction } from '@/app/actions/accounting-actions';
import { JournalEntryForm } from '@/components/finance/journal-entry-form';

export default async function NewJournalEntryPage() {
    const accounts = await getAccountsAction();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Journal Entry</h1>
                <p className="text-muted-foreground">
                    Create a manual double-entry transaction.
                </p>
            </div>

            <JournalEntryForm accounts={accounts} />
        </div>
    );
}
