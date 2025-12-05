'use server';

import { employeeService, Attendance, LeaveApplication, Payroll } from '@/lib/services/employee-service';
import { revalidatePath } from 'next/cache';

export async function getAttendanceAction() {
    return employeeService.getAttendance();
}

export async function createAttendanceAction(data: Omit<Attendance, 'id' | 'employeeName'>) {
    employeeService.createAttendance(data);
    revalidatePath('/dashboard/hcm/attendance');
}

export async function getLeavesAction() {
    return employeeService.getLeaves();
}

export async function createLeaveAction(data: Omit<LeaveApplication, 'id' | 'employeeName'>) {
    employeeService.createLeave(data);
    revalidatePath('/dashboard/hcm/leave');
}

export async function getPayrollAction() {
    return employeeService.getPayroll();
}

export async function createPayrollAction(data: Omit<Payroll, 'id' | 'employeeName'>) {
    employeeService.createPayroll(data);
    revalidatePath('/dashboard/hcm/payroll');
}
