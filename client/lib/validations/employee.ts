import * as z from 'zod';

export const employeeSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    employeeNumber: z.string().min(1, 'Employee number is required'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().optional(),
    departmentId: z.string().optional(),
    designation: z.string().optional(),
    dateOfJoining: z.string().optional(),
    salary: z.coerce.number().min(0, 'Salary must be a positive number'),
    status: z.string().default('active'),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
