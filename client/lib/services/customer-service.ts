import { db } from '@/lib/db';
import { Customer } from '@/types/customer';
import { v4 as uuidv4 } from 'uuid';

export const CustomerService = {
    getCustomers: (): Customer[] => {
        return db.prepare('SELECT * FROM Customer ORDER BY name').all() as Customer[];
    },

    getCustomer: (id: string): Customer | undefined => {
        return db.prepare('SELECT * FROM Customer WHERE id = ?').get(id) as Customer | undefined;
    },

    createCustomer: (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer => {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO Customer (id, name, email, phone, address, taxId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(id, data.name, data.email || null, data.phone || null, data.address || null, data.taxId || null, now, now);

        return { id, ...data, createdAt: now, updatedAt: now };
    }
};
