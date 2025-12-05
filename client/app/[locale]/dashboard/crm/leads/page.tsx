import { getLeadsAction } from '@/app/actions/crm-actions';
import { LeadsClient } from './leads-client';

export default async function LeadsPage() {
    const leads = await getLeadsAction();

    return <LeadsClient leads={leads} />;
}

