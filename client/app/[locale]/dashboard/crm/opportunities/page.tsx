import { getOpportunitiesAction } from '@/app/actions/crm-actions';
import { OpportunitiesClient } from './opportunities-client';

export default async function OpportunitiesPage() {
    const opportunities = await getOpportunitiesAction();

    return <OpportunitiesClient opportunities={opportunities} />;
}

