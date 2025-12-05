import { ActivityForm } from '@/components/crm/activity-form';
import { getCustomersAction } from '@/app/actions/customer-actions';
import { getLeadsAction } from '@/app/actions/crm-actions';

export default async function NewActivityPage() {
    const [customers, leads] = await Promise.all([
        getCustomersAction(),
        getLeadsAction(),
    ]);

    return <ActivityForm customers={customers} leads={leads} />;
}
