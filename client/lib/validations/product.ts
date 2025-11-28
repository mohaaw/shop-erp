import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    price: z.coerce.number().min(0, 'Price must be greater than or equal to 0'),
    cost: z.coerce.number().min(0, 'Cost must be greater than or equal to 0').optional(),
    sku: z.string().min(3, 'SKU must be at least 3 characters'),
    barcode: z.string().optional(),
    stock: z.coerce.number().int().min(0, 'Stock must be a positive integer'),
    category: z.string().min(1, 'Category is required'),
    status: z.enum(['active', 'draft', 'archived']),
    image: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
