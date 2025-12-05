import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export interface PurchaseOrder {
    id: string;
    number: string;
    supplierId: string;
    supplierName?: string; // Joined
    rfqId?: string;
    date: string;
    expectedDate?: string;
    status: 'draft' | 'confirmed' | 'received' | 'cancelled';
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
}

export const purchaseOrderService = {
    getPurchaseOrders: (): PurchaseOrder[] => {
        return db.prepare(`
            SELECT PO.*, S.name as supplierName 
            FROM PurchaseOrder PO
            LEFT JOIN Supplier S ON PO.supplierId = S.id
            ORDER BY PO.createdAt DESC
        `).all() as PurchaseOrder[];
    },

    getPurchaseOrder: (id: string): PurchaseOrder | undefined => {
        return db.prepare(`
            SELECT PO.*, S.name as supplierName 
            FROM PurchaseOrder PO
            LEFT JOIN Supplier S ON PO.supplierId = S.id
            WHERE PO.id = ?
        `).get(id) as PurchaseOrder | undefined;
    },

    createPurchaseOrder: (data: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt' | 'supplierName'>): PurchaseOrder => {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO PurchaseOrder (
                id, number, supplierId, rfqId, date, expectedDate, 
                status, totalAmount, createdAt, updatedAt
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            data.number,
            data.supplierId,
            data.rfqId || null,
            data.date,
            data.expectedDate || null,
            data.status || 'draft',
            data.totalAmount || 0,
            now,
            now
        );

        return { id, ...data, createdAt: now, updatedAt: now };
    }
};
