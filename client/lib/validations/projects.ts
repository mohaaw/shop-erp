import * as z from "zod"

export const taskSchema = z.object({
    projectId: z.string().min(1, "Project is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    assignedTo: z.string().optional(),
    status: z.enum(["todo", "in_progress", "review", "done"]).default("todo"),
    priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
    dueDate: z.string().optional(),
})

export type TaskFormValues = z.infer<typeof taskSchema>

export const timesheetSchema = z.object({
    projectId: z.string().min(1, "Project is required"),
    taskId: z.string().optional(),
    employeeId: z.string().min(1, "Employee is required"),
    date: z.string().min(1, "Date is required"),
    hours: z.coerce.number().min(0.1, "Hours must be at least 0.1"),
    description: z.string().optional(),
})

export type TimesheetFormValues = z.infer<typeof timesheetSchema>
