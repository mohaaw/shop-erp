import { getTaxRatesAction } from '@/app/actions/finance-actions';
import { TaxRatesClient } from './tax-rates-client';

export default async function TaxRatesPage() {
    const taxRates = await getTaxRatesAction();

    return <TaxRatesClient taxRates={taxRates} />;
}
