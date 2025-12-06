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

export interface Workstation {
    id: string;
    name: string;
    code: string;
    description?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface JobCard {
    id: string;
    productionOrderId: string;
    workstationId: string;
    operation?: string;
    status: string;
    startTime?: string;
    endTime?: string;
    productionOrderNumber?: string;
    workstationName?: string;
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

    createBOMItem(data: Omit<BOMItem, 'id'>) {
        const id = uuidv4();
        const stmt = db.prepare(`
            INSERT INTO BOMItem (id, bomId, productId, quantity, scrapRate)
            VALUES (?, ?, ?, ?, ?)
        `);
        stmt.run(id, data.bomId, data.productId, data.quantity, data.scrapRate || 0);
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

    // Workstation methods
    getWorkstations(): Workstation[] {
        return db.prepare('SELECT * FROM WorkStation ORDER BY name').all() as Workstation[];
    },

    createWorkstation(data: Omit<Workstation, 'id' | 'createdAt' | 'updatedAt'>): Workstation {
        const id = uuidv4();
        const now = new Date().toISOString();
        const stmt = db.prepare(`
            INSERT INTO WorkStation (id, name, code, description, status, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(id, data.name, data.code, data.description || null, data.status || 'active', now, now);
        return { id, ...data, createdAt: now, updatedAt: now };
    },

    // Job Card methods
    getJobCards(): JobCard[] {
        return db.prepare(`
            SELECT jc.*, po.number as productionOrderNumber, ws.name as workstationName
            FROM JobCard jc
            LEFT JOIN ProductionOrder po ON jc.productionOrderId = po.id
            LEFT JOIN WorkStation ws ON jc.workstationId = ws.id
            ORDER BY jc.createdAt DESC
        `).all() as JobCard[];
    },

    createJobCard(data: Omit<JobCard, 'id' | 'createdAt' | 'updatedAt' | 'productionOrderNumber' | 'workstationName'>): JobCard {
        const id = uuidv4();
        const now = new Date().toISOString();
        const stmt = db.prepare(`
            INSERT INTO JobCard (id, productionOrderId, workstationId, operation, status, startTime, endTime, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
            id,
            data.productionOrderId,
            data.workstationId,
            data.operation || null,
            data.status || 'pending',
            data.startTime || null,
            data.endTime || null,
            now,
            now
        );
        return { id, ...data, createdAt: now, updatedAt: now };
    }
};
