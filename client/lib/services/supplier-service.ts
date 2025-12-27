import "server-only";
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export interface Supplier {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    taxId?: string;
    createdAt: string;
    updatedAt: string;
}

export const supplierService = {
    getSuppliers: (): Supplier[] => {
        return db.prepare('SELECT * FROM Supplier ORDER BY name').all() as Supplier[];
    },

    getSupplier: (id: string): Supplier | undefined => {
        return db.prepare('SELECT * FROM Supplier WHERE id = ?').get(id) as Supplier | undefined;
    },

    createSupplier: (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Supplier => {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO Supplier (id, name, email, phone, address, taxId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(id, data.name, data.email || null, data.phone || null, data.address || null, data.taxId || null, now, now);

        return { id, ...data, createdAt: now, updatedAt: now };
    }
};
