import { getActivitiesAction } from '@/app/actions/customer-actions';
import { ActivitiesClient } from './activities-client';

export default async function ActivitiesPage() {
    const activities = await getActivitiesAction();

    return <ActivitiesClient activities={activities} />;
}
