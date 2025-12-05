import { getTicketsAction } from '@/app/actions/customer-actions';
import { TicketsClient } from './tickets-client';

export default async function TicketsPage() {
    const tickets = await getTicketsAction();

    return <TicketsClient tickets={tickets} />;
}
