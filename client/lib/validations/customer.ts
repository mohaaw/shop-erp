import { z } from 'zod';

export const customerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
    taxId: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
