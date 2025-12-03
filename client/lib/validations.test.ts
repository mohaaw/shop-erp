import { describe, it, expect } from 'vitest';
import { createProductSchema, createEmployeeSchema } from './validations';

describe('validations', () => {
    describe('createProductSchema', () => {
        it('should validate a valid product', () => {
            const validProduct = {
                name: 'Test Product',
                description: 'A test product',
                price: 100,
                cost: 50,
                stockQuantity: 10, // Note: Schema doesn't have stockQuantity, it might be separate or I need to check schema again. 
                // Checking schema: createProductSchema has name, description, price, cost, sku, barcode, categoryId, type, minStock.
                // It does NOT have stockQuantity. That's likely handled by inventory transaction.
                // Let's adjust to match schema.
                sku: 'TEST-SKU',
                categoryId: '123e4567-e89b-12d3-a456-426614174000', // Valid UUID
                type: 'storable',
                minStock: 10,
            };
            // Removing extra fields not in schema if strict, but zod by default strips unknown.
            // However, let's stick to what's in schema.
            const result = createProductSchema.safeParse(validProduct);
            expect(result.success).toBe(true);
        });

        it('should fail if price is negative', () => {
            const invalidProduct = {
                name: 'Test Product',
                price: -100,
                cost: 50,
            };
            const result = createProductSchema.safeParse(invalidProduct);
            expect(result.success).toBe(false);
        });
    });

    describe('createEmployeeSchema', () => {
        it('should validate a valid employee', () => {
            const validEmployee = {
                employeeNumber: 'EMP-001',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phone: '1234567890',
                departmentId: '123e4567-e89b-12d3-a456-426614174000', // Valid UUID
                designation: 'Developer',
                dateOfJoining: new Date().toISOString(), // Schema expects string
                salary: 5000,
            };
            const result = createEmployeeSchema.safeParse(validEmployee);
            expect(result.success).toBe(true);
        });

        it('should fail if email is invalid', () => {
            const invalidEmployee = {
                employeeNumber: 'EMP-002',
                firstName: 'John',
                lastName: 'Doe',
                email: 'not-an-email',
            };
            const result = createEmployeeSchema.safeParse(invalidEmployee);
            expect(result.success).toBe(false);
        });
    });
});
