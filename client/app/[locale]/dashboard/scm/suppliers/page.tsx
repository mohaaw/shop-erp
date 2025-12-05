import { getSuppliersAction } from '@/app/actions/scm-actions';
import { SuppliersClient } from './suppliers-client';

export default async function SuppliersPage() {
    const suppliers = await getSuppliersAction();

    return <SuppliersClient suppliers={suppliers} />;
}
