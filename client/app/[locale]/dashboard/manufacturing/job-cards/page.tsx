import { getJobCardsAction } from '@/app/actions/manufacturing-actions';
import { JobCardsClient } from './job-cards-client';

export default async function JobCardsPage() {
    const jobCards = await getJobCardsAction();

    return <JobCardsClient jobCards={jobCards} />;
}
