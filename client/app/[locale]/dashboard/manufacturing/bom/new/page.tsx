import { getProductsAction } from '@/app/actions/product-actions';
import { BOMForm } from './bom-form';

export default async function NewBOMPage() {
    const { products } = await getProductsAction();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Bill of Materials</h1>
                <p className="text-muted-foreground">
                    Define the raw materials required to produce a finished product.
                </p>
            </div>

            <BOMForm products={products || []} />
        </div>
    );
}
