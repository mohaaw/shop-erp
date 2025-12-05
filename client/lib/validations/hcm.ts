import * as z from "zod"

export const attendanceSchema = z.object({
    employeeId: z.string().min(1, "Employee is required"),
    date: z.string().min(1, "Date is required"),
    status: z.enum(["present", "absent", "late", "half_day"]).default("present"),
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
})

export type AttendanceFormValues = z.infer<typeof attendanceSchema>

export const leaveSchema = z.object({
    employeeId: z.string().min(1, "Employee is required"),
    type: z.enum(["annual", "sick", "casual", "unpaid"]).default("annual"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z.string().optional(),
    status: z.enum(["pending", "approved", "rejected"]).default("pending"),
})

export type LeaveFormValues = z.infer<typeof leaveSchema>

export const payrollSchema = z.object({
    employeeId: z.string().min(1, "Employee is required"),
    month: z.coerce.number().min(1).max(12),
    year: z.coerce.number().min(2000).max(2100),
    basicSalary: z.coerce.number().min(0, "Basic salary must be non-negative"),
    allowances: z.coerce.number().min(0, "Allowances must be non-negative"),
    deductions: z.coerce.number().min(0, "Deductions must be non-negative"),
    netSalary: z.coerce.number().min(0, "Net salary must be non-negative"),
    status: z.enum(["draft", "processed", "paid"]).default("draft"),
})

export type PayrollFormValues = z.infer<typeof payrollSchema>
