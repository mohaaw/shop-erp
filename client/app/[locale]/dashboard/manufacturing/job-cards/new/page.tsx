import { JobCardForm } from '@/components/manufacturing/job-card-form';
import { getProductionOrdersAction, getWorkstationsAction } from '@/app/actions/manufacturing-actions';

export default async function NewJobCardPage() {
    const productionOrders = await getProductionOrdersAction();
    const workstations = await getWorkstationsAction();

    return <JobCardForm productionOrders={productionOrders} workstations={workstations} />;
}
