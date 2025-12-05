import { JobCardForm } from '@/components/manufacturing/job-card-form';
import { getProductionOrdersAction, getWorkstationsAction } from '@/app/actions/manufacturing-actions';

export default async function NewJobCardPage() {
    const [productionOrders, workstations] = await Promise.all([
        getProductionOrdersAction(),
        getWorkstationsAction(),
    ]);

    return <JobCardForm productionOrders={productionOrders} workstations={workstations} />;
}
