import { ActivityForm } from '@/components/crm/activity-form';
import { getCustomersAction } from '@/app/actions/customer-actions';
import { getLeadsAction } from '@/app/actions/crm-actions';

export default async function NewActivityPage() {
    const customers = await getCustomersAction();
    const leads = await getLeadsAction();

    return <ActivityForm customers={customers} leads={leads} />;
}
