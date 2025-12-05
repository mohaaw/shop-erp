import * as z from "zod"

export const workstationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    code: z.string().min(1, "Code is required"),
    description: z.string().optional(),
    status: z.enum(["active", "maintenance", "inactive"]).default("active"),
})

export type WorkstationFormValues = z.infer<typeof workstationSchema>

export const jobCardSchema = z.object({
    productionOrderId: z.string().min(1, "Production Order is required"),
    workstationId: z.string().min(1, "Workstation is required"),
    operation: z.string().optional(),
    status: z.enum(["pending", "in_progress", "completed", "on_hold"]).default("pending"),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
})

export type JobCardFormValues = z.infer<typeof jobCardSchema>
