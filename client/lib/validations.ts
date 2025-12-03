import { z } from 'zod';

// Common schemas
export const uuidSchema = z.string().uuid();
export const dateSchema = z.string().datetime();
export const emailSchema = z.string().email();
export const phoneSchema = z.string().min(10).max(15);

// Financial schemas
export const createJournalEntrySchema = z.object({
    date: dateSchema,
    reference: z.string().optional(),
    description: z.string().optional(),
    items: z.array(z.object({
        accountId: uuidSchema,
        debit: z.number().min(0),
        credit: z.number().min(0),
    })).min(2),
});

export const createInvoiceSchema = z.object({
    customerId: uuidSchema,
    orderId: uuidSchema.optional(),
    date: z.string(),
    dueDate: z.string(),
    items: z.array(z.object({
        productId: uuidSchema,
        quantity: z.number().positive(),
        unitPrice: z.number().positive(),
        taxRate: z.number().min(0).max(100).default(0),
    })).min(1),
});

export const createPaymentSchema = z.object({
    invoiceId: uuidSchema,
    amount: z.number().positive(),
    paymentDate: z.string(),
    paymentMethod: z.enum(['cash', 'card', 'bank_transfer', 'check']),
    reference: z.string().optional(),
});

// Inventory schemas
export const createProductSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    price: z.number().positive(),
    cost: z.number().min(0),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    categoryId: uuidSchema.optional(),
    type: z.enum(['storable', 'consumable', 'service']).default('storable'),
    minStock: z.number().min(0).default(0),
});

export const createStockTransferSchema = z.object({
    productId: uuidSchema,
    quantity: z.number().positive(),
    sourceLocationId: uuidSchema,
    destLocationId: uuidSchema,
    reference: z.string().optional(),
});

// CRM schemas
export const createLeadSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: emailSchema.optional(),
    phone: phoneSchema.optional(),
    company: z.string().optional(),
    source: z.string().optional(),
    notes: z.string().optional(),
});

export const createOpportunitySchema = z.object({
    name: z.string().min(1),
    customerId: uuidSchema.optional(),
    leadId: uuidSchema.optional(),
    expectedRevenue: z.number().min(0),
    probability: z.number().min(0).max(100),
    expectedCloseDate: z.string().optional(),
    notes: z.string().optional(),
});

// HCM schemas
export const createEmployeeSchema = z.object({
    employeeNumber: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: emailSchema.optional(),
    phone: phoneSchema.optional(),
    departmentId: uuidSchema.optional(),
    designation: z.string().optional(),
    dateOfJoining: z.string().optional(),
    salary: z.number().min(0).default(0),
});

export const createLeaveApplicationSchema = z.object({
    employeeId: uuidSchema,
    leaveType: z.enum(['sick', 'casual', 'annual', 'unpaid']),
    fromDate: z.string(),
    toDate: z.string(),
    days: z.number().positive(),
    reason: z.string().optional(),
});

// User authentication schemas
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(8),
});

export const registerSchema = z.object({
    name: z.string().min(1),
    email: emailSchema,
    password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
