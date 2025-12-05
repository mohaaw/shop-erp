import { getCustomersAction } from '@/app/actions/customer-actions';
import { getProductsAction } from '@/app/actions/product-actions';
import { InvoiceForm } from '@/components/finance/invoice-form';
import { Product } from '@/types/product';

export default async function NewInvoicePage() {

    const productsData = await getProductsAction();

    const customers = await getCustomersAction();
    const products = (productsData.success && productsData.products ? productsData.products : []) as Product[];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Invoice</h1>
                <p className="text-muted-foreground">
                    Create a new sales invoice for a customer.
                </p>
            </div>

            <InvoiceForm customers={customers} products={products} />
        </div>
    );
}
