'use server';

import { employeeService, Employee, Department } from '@/lib/services/employee-service';
import { revalidatePath } from 'next/cache';

export async function getEmployeesAction() {
    return employeeService.getEmployees();
}

export async function getEmployeeByIdAction(id: string) {
    return employeeService.getEmployeeById(id);
}

export async function createEmployeeAction(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) {
    const employee = employeeService.createEmployee(data);
    revalidatePath('/dashboard/employees');
    return employee;
}

export async function updateEmployeeAction(id: string, data: Partial<Employee>) {
    const employee = employeeService.updateEmployee(id, data);
    revalidatePath('/dashboard/employees');
    return employee;
}

export async function deleteEmployeeAction(id: string) {
    employeeService.deleteEmployee(id);
    revalidatePath('/dashboard/employees');
}

export async function getDepartmentsAction() {
    return employeeService.getDepartments();
}

export async function createDepartmentAction(data: Omit<Department, 'id' | 'createdAt'>) {
    const department = employeeService.createDepartment(data);
    revalidatePath('/dashboard/employees');
    return department;
}
