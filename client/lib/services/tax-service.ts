import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export interface TaxRate {
    id: string;
    name: string;
    rate: number;
    code: string;
    accountId?: string;
    createdAt: string;
    updatedAt: string;
}

export const taxService = {
    getTaxRates: (): TaxRate[] => {
        return db.prepare('SELECT * FROM TaxRate ORDER BY name').all() as TaxRate[];
    },

    createTaxRate: (data: Omit<TaxRate, 'id' | 'createdAt' | 'updatedAt'>): TaxRate => {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO TaxRate (id, name, rate, code, accountId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(id, data.name, data.rate, data.code, data.accountId || null, now, now);

        return { id, ...data, createdAt: now, updatedAt: now };
    }
};
