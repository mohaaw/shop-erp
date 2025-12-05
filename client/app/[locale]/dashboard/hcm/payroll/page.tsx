import { getPayrollAction } from '@/app/actions/hcm-actions';
import { PayrollClient } from './payroll-client';

export default async function PayrollPage() {
    const payroll = await getPayrollAction();

    return <PayrollClient payroll={payroll} />;
}
