import { LeaveForm } from '@/components/hcm/leave-form';
import { getEmployeesAction } from '@/app/actions/employee-actions';

export default async function NewLeavePage() {
    const employees = await getEmployeesAction();

    return <LeaveForm employees={employees} />;
}
