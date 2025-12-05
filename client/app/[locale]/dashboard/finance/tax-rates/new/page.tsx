import { TaxRateForm } from '@/components/finance/tax-rate-form';
import { getAccountsAction } from '@/app/actions/accounting-actions';

export default async function NewTaxRatePage() {
    const accounts = await getAccountsAction();

    return <TaxRateForm accounts={accounts} />;
}
