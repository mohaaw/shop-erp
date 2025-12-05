import * as z from "zod"

export const paymentSchema = z.object({
    orderId: z.string().optional(),
    customerId: z.string().optional(),
    amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
    method: z.string().min(1, "Payment method is required"),
    status: z.enum(["pending", "completed", "failed", "refunded"]).default("completed"),
    date: z.string().min(1, "Date is required"),
    reference: z.string().optional(),
})

export type PaymentFormValues = z.infer<typeof paymentSchema>

export const taxRateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    rate: z.coerce.number().min(0, "Rate must be non-negative"),
    code: z.string().optional(),
    description: z.string().optional(),
    accountId: z.string().optional(),
    isDefault: z.boolean().default(false),
})

export type TaxRateFormValues = z.infer<typeof taxRateSchema>
