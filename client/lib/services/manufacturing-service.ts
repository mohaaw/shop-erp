import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';

export interface BOM {
    id: string;
    productId: string;
    productName?: string;
    quantity: number;
    isActive: boolean;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BOMItem {
    id: string;
    bomId: string;
    productId: string;
    productName?: string;
    quantity: number;
    scrapRate: number;
}

export interface ProductionOrder {
    id: string;
    number: string;
    productId: string;
    productName?: string;
    bomId?: string;
    quantity: number;
    plannedStartDate?: string;
    plannedEndDate?: string;
    actualStartDate?: string;
    actualEndDate?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export const manufacturingService = {
    // BOM methods
    getBOMs(): BOM[] {
        const stmt = db.prepare(`
            SELECT b.*, p.name as productName
            FROM BOM b
            LEFT JOIN Product p ON b.productId = p.id
            ORDER BY b.createdAt DESC
        `);
        return stmt.all() as BOM[];
    },

    getBOMById(id: string): BOM | null {
        const stmt = db.prepare(`
            SELECT b.*, p.name as productName
            FROM BOM b
            LEFT JOIN Product p ON b.productId = p.id
            WHERE b.id = ?
        `);
        return stmt.get(id) as BOM | null;
    },

    createBOM(data: Omit<BOM, 'id' | 'createdAt' | 'updatedAt'>): BOM {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO BOM (id, productId, quantity, isActive, notes, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            data.productId,
            data.quantity || 1,
            data.isActive ? 1 : 0,
            data.notes || null,
            now,
            now
        );

        return this.getBOMById(id)!;
    },

    // Production Order methods
    getProductionOrders(): ProductionOrder[] {
        const stmt = db.prepare(`
            SELECT po.*, p.name as productName
            FROM ProductionOrder po
            LEFT JOIN Product p ON po.productId = p.id
            ORDER BY po.createdAt DESC
        `);
        return stmt.all() as ProductionOrder[];
    },

    getProductionOrderById(id: string): ProductionOrder | null {
        const stmt = db.prepare(`
            SELECT po.*, p.name as productName
            FROM ProductionOrder po
            LEFT JOIN Product p ON po.productId = p.id
            WHERE po.id = ?
        `);
        return stmt.get(id) as ProductionOrder | null;
    },

    createProductionOrder(data: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>): ProductionOrder {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO ProductionOrder (
                id, number, productId, bomId, quantity,
                plannedStartDate, plannedEndDate, status,
                createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            data.number,
            data.productId,
            data.bomId || null,
            data.quantity,
            data.plannedStartDate || null,
            data.plannedEndDate || null,
            data.status || 'draft',
            now,
            now
        );

        return this.getProductionOrderById(id)!;
    },

    updateProductionOrder(id: string, data: Partial<ProductionOrder>): ProductionOrder {
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            UPDATE ProductionOrder 
            SET status = ?, actualStartDate = ?, actualEndDate = ?, updatedAt = ?
            WHERE id = ?
        `);

        stmt.run(
            data.status,
            data.actualStartDate || null,
            data.actualEndDate || null,
            now,
            id
        );

        return this.getProductionOrderById(id)!;
    },
};
