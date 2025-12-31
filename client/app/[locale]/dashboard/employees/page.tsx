import { getEmployeesAction, getDepartmentsAction } from '@/app/actions/employee-actions';
import { EmployeesClient } from './employees-client';

export default async function EmployeesPage() {
  const [employees, departments] = await Promise.all([
    getEmployeesAction(),
    getDepartmentsAction(),
  ]);

  return <EmployeesClient employees={employees} departments={departments} />;
}

