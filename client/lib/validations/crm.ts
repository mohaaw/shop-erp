import * as z from "zod"

export const customerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    address: z.string().optional(),
    taxId: z.string().optional(),
})

export type CustomerFormValues = z.infer<typeof customerSchema>

export const activitySchema = z.object({
    type: z.string().min(1, "Type is required"),
    subject: z.string().min(1, "Subject is required"),
    description: z.string().optional(),
    date: z.string().min(1, "Date is required"),
    status: z.enum(["pending", "completed", "cancelled"]).default("pending"),
    leadId: z.string().optional(),
    customerId: z.string().optional(),
})

export type ActivityFormValues = z.infer<typeof activitySchema>

export const ticketSchema = z.object({
    customerId: z.string().min(1, "Customer is required"),
    subject: z.string().min(1, "Subject is required"),
    description: z.string().min(1, "Description is required"),
    priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
    status: z.enum(["open", "in_progress", "resolved", "closed"]).default("open"),
    assignedTo: z.string().optional(),
})

export type TicketFormValues = z.infer<typeof ticketSchema>
