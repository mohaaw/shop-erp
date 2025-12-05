import { getLeavesAction } from '@/app/actions/hcm-actions';
import { LeaveClient } from './leave-client';

export default async function LeavePage() {
    const leaves = await getLeavesAction();

    return <LeaveClient leaves={leaves} />;
}
