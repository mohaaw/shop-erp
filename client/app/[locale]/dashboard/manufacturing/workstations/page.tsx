import { getWorkstationsAction } from '@/app/actions/manufacturing-actions';
import { WorkstationsClient } from './workstations-client';

export default async function WorkstationsPage() {
    const workstations = await getWorkstationsAction();

    return <WorkstationsClient workstations={workstations} />;
}
