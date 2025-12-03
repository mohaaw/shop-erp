import { describe, it, expect } from 'vitest';
import { cn, formatCurrency } from '../lib/utils';

describe('utils', () => {
    describe('cn', () => {
        it('should merge class names correctly', () => {
            expect(cn('c1', 'c2')).toBe('c1 c2');
        });

        it('should handle conditional classes', () => {
            expect(cn('c1', true && 'c2', false && 'c3')).toBe('c1 c2');
        });
    });

    describe('formatCurrency', () => {
        it('should format USD correctly', () => {
            expect(formatCurrency(1000)).toBe('$1,000.00');
        });

        it('should format zero correctly', () => {
            expect(formatCurrency(0)).toBe('$0.00');
        });
    });
});
