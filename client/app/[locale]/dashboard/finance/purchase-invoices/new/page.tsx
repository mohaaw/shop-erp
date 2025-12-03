import { getSuppliersAction } from '@/app/actions/supplier-actions';
import { getAccountsAction } from '@/app/actions/accounting-actions';
import { PurchaseInvoiceForm } from '@/components/finance/purchase-invoice-form';

export default async function NewPurchaseInvoicePage() {
    const suppliers = await getSuppliersAction();
    const accounts = await getAccountsAction();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Bill</h1>
                <p className="text-muted-foreground">
                    Create a new bill from a supplier.
                </p>
            </div>

            <PurchaseInvoiceForm suppliers={suppliers} accounts={accounts} />
        </div>
    );
}
