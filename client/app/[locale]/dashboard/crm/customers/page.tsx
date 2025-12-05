import { getCustomersAction } from '@/app/actions/customer-actions';
import { CustomersClient } from './customers-client';

export default async function CustomersPage() {
    const customers = await getCustomersAction();

    return <CustomersClient customers={customers} />;
}
