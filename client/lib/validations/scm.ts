import * as z from "zod"

export const supplierSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    taxId: z.string().optional(),
})

export type SupplierFormValues = z.infer<typeof supplierSchema>

export const purchaseOrderSchema = z.object({
    number: z.string().min(1, "Order number is required"),
    supplierId: z.string().min(1, "Supplier is required"),
    rfqId: z.string().optional(),
    date: z.string().min(1, "Date is required"),
    expectedDate: z.string().optional(),
    status: z.enum(["draft", "confirmed", "received", "cancelled"]).default("draft"),
    totalAmount: z.coerce.number().min(0, "Amount must be positive"),
})

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>
