import { db } from '@/lib/db';
import { Customer } from '@/types/customer';

export const CustomerService = {
    getCustomers: (): Customer[] => {
        return db.prepare('SELECT * FROM Customer ORDER BY name').all() as Customer[];
    },

    getCustomer: (id: string): Customer | undefined => {
        return db.prepare('SELECT * FROM Customer WHERE id = ?').get(id) as Customer | undefined;
    }
};
