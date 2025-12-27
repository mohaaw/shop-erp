import "server-only";
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';

export interface Payment {
    id: string;
    orderId?: string;
    customerId?: string;
    amount: number;
    method: string;
    status: string;
    date: string;
    reference?: string;
    createdAt: string;
}

export interface TaxRate {
    id: string;
    name: string;
    rate: number;
    code?: string;
    description?: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export const financeService = {
    // Payment methods
    getPayments(): Payment[] {
        return db.prepare(`
            SELECT p.*, c.name as customerName, o.number as orderNumber
            FROM Payment p
            LEFT JOIN Customer c ON p.customerId = c.id
            LEFT JOIN "Order" o ON p.orderId = o.id
            ORDER BY p.date DESC
        `).all() as Payment[];
    },

    createPayment(data: Omit<Payment, 'id' | 'createdAt'>): Payment {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO Payment (id, orderId, customerId, amount, method, status, date, reference, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            data.orderId || null,
            data.customerId || null,
            data.amount,
            data.method,
            data.status || 'completed',
            data.date,
            data.reference || null,
            now
        );

        return { ...data, id, createdAt: now };
    },

    // Tax Rate methods
    getTaxRates(): TaxRate[] {
        return db.prepare('SELECT * FROM TaxRate ORDER BY name').all() as TaxRate[];
    },

    createTaxRate(data: Omit<TaxRate, 'id' | 'createdAt' | 'updatedAt'>): TaxRate {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO TaxRate (id, name, rate, code, description, isDefault, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            data.name,
            data.rate,
            data.code || null,
            data.description || null,
            data.isDefault ? 1 : 0,
            now,
            now
        );

        return { ...data, id, createdAt: now, updatedAt: now };
    }
};
