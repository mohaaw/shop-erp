import { TicketForm } from '@/components/crm/ticket-form';
import { getCustomersAction } from '@/app/actions/customer-actions';

export default async function NewTicketPage() {
    const customers = await getCustomersAction();

    return <TicketForm customers={customers} />;
}
