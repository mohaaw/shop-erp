
import { z } from 'zod';

export const categorySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    slug: z.string().min(2, 'Slug must be at least 2 characters'),
    description: z.string().optional(),
    parentId: z.string().optional(),
    image: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const productAttributeValueSchema = z.object({
    id: z.string().optional(),
    value: z.string().min(1, "Value is required"),
    priceExtra: z.number().default(0),
});

export const productAttributeSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Attribute name is required"),
    values: z.array(productAttributeValueSchema),
});

export const productSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    type: z.enum(['storable', 'consumable', 'service']),
    status: z.enum(['active', 'draft', 'archived']),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    internalReference: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be positive"),
    cost: z.coerce.number().min(0, "Cost must be positive"),
    stock: z.coerce.number().default(0),
    category: z.string().min(1, "Category is required"),
    uom: z.string().default('unit'),
    purchaseUom: z.string().default('unit'),
    uomRatio: z.coerce.number().default(1),
    weight: z.coerce.number().optional(),
    volume: z.coerce.number().optional(),
    dimensions: z.object({
        width: z.coerce.number().optional(),
        height: z.coerce.number().optional(),
        depth: z.coerce.number().optional(),
    }).optional(),
    hsCode: z.string().optional(),
    countryOfOrigin: z.string().optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    specifications: z.string().optional(), // JSON string or simple text
    warranty: z.string().optional(),
    tracking: z.enum(['none', 'lot', 'serial']).default('none'),
    availableInPos: z.boolean().default(true),
    posCategory: z.string().optional(),
    hasVariants: z.boolean().default(false),
    attributes: z.array(productAttributeSchema).optional(),
    image: z.string().optional(),

    // Accounting
    incomeAccount: z.string().optional(),
    expenseAccount: z.string().optional(),
    customerTaxes: z.array(z.string()).optional(),
    vendorTaxes: z.array(z.string()).optional(),

    // POS Integration
    toppings: z.string().optional(), // Comma separated for now
    isCombo: z.boolean().default(false),
    comboItems: z.string().optional(), // Comma separated IDs or names

    // Inventory & Media
    minStock: z.coerce.number().min(0).default(0),
    valuationMethod: z.enum(['FIFO', 'LIFO', 'AVCO']).default('FIFO'),
    standardPrice: z.coerce.number().min(0).default(0),
    shelfLife: z.coerce.number().optional(),
    weightUom: z.string().optional(),
    volumeUom: z.string().optional(),
    images: z.array(z.string()).optional(),

    // Variants
    variants: z.array(z.object({
        id: z.string().optional(),
        name: z.string(),
        sku: z.string().optional(),
        price: z.coerce.number().min(0),
        stock: z.coerce.number().default(0),
        attributes: z.record(z.string()), // { "Color": "Red", "Size": "Small" }
    })).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
