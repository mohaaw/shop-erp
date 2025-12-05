import * as z from "zod"

export const warehouseSchema = z.object({
    name: z.string().min(1, "Name is required"),
    code: z.string().min(1, "Code is required"),
})

export type WarehouseFormValues = z.infer<typeof warehouseSchema>

export const stockTransferSchema = z.object({
    productId: z.string().min(1, "Product is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    sourceLocationId: z.string().min(1, "Source location is required"),
    destLocationId: z.string().min(1, "Destination location is required"),
    reference: z.string().optional(),
    state: z.enum(["draft", "done", "cancelled"]).default("draft"),
    date: z.string().min(1, "Date is required"),
})

export type StockTransferFormValues = z.infer<typeof stockTransferSchema>

export const stockAdjustmentSchema = z.object({
    productId: z.string().min(1, "Product is required"),
    locationId: z.string().min(1, "Location is required"),
    newQuantity: z.coerce.number().min(0, "Quantity must be non-negative"),
})

export type StockAdjustmentFormValues = z.infer<typeof stockAdjustmentSchema>
