import { AttendanceForm } from '@/components/hcm/attendance-form';
import { getEmployeesAction } from '@/app/actions/employee-actions';

export default async function NewAttendancePage() {
    const employees = await getEmployeesAction();

    return <AttendanceForm employees={employees} />;
}
