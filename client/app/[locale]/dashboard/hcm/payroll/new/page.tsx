import { PayrollForm } from '@/components/hcm/payroll-form';
import { getEmployeesAction } from '@/app/actions/employee-actions';

export default async function NewPayrollPage() {
    const employees = await getEmployeesAction();

    return <PayrollForm employees={employees} />;
}
