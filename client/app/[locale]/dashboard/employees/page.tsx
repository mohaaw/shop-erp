import { getEmployeesAction } from '@/app/actions/employee-actions';
import { EmployeesClient } from './employees-client';

export default async function EmployeesPage() {
  const employees = await getEmployeesAction();

  return <EmployeesClient employees={employees} />;
}

