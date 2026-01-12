
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => {
    const mockRun = vi.fn();
    const mockGet = vi.fn(() => null); // Return null for getProduct check
    const mockPrepare = vi.fn(() => ({ run: mockRun, get: mockGet }));
    const mockTransaction = vi.fn((fn) => fn);
    return {
        run: mockRun,
        get: mockGet,
        prepare: mockPrepare,
        transaction: mockTransaction
    };
});

vi.mock('server-only', () => { return {}; });

vi.mock('@/lib/db', () => ({
    db: {
        prepare: mocks.prepare,
        transaction: mocks.transaction
    }
}));

import { ProductService } from '@/lib/services/product-service';

describe('ProductService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should create a product successfully', () => {
        const productData = {
            name: 'Test Product',
            price: 100,
            cost: 50,
            type: 'storable',
            images: ['image1.jpg'],
            availableInPos: true,
            isCombo: false
        };

        ProductService.createProduct(productData as any);

        expect(mocks.prepare).toHaveBeenCalled();
        expect(mocks.run).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Test Product',
            price: 100
        }));
    });
});
