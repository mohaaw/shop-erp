import "server-only";
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export interface Warehouse {
    id: string;
    name: string;
    code: string;
}

export interface Location {
    id: string;
    name: string;
    code: string;
    type: 'warehouse' | 'zone' | 'bin';
    warehouseId?: string;
    parentId?: string;
    children?: Location[];
}

export interface StockQuant {
    id: string;
    productId: string;
    locationId: string;
    quantity: number;
    productName?: string;
    locationName?: string;
}

export interface StockTransfer {
    id: string;
    productId: string;
    quantity: number;
    sourceLocationId: string;
    destLocationId: string;
    reference?: string;
    state: 'draft' | 'done' | 'cancelled';
    date: string;
    productName?: string;
    sourceLocationName?: string;
    destLocationName?: string;
}

export const warehouseService = {
    getWarehouses: (): Warehouse[] => {
        return db.prepare('SELECT * FROM Warehouse ORDER BY name').all() as Warehouse[];
    },

    createWarehouse: (data: Omit<Warehouse, 'id'>): Warehouse => {
        const id = uuidv4();
        const stmt = db.prepare(`
            INSERT INTO Warehouse (id, name, code)
            VALUES (?, ?, ?)
        `);
        stmt.run(id, data.name, data.code);
        return { id, ...data };
    },

    getLocations: (warehouseId?: string): Location[] => {
        let query = 'SELECT * FROM Location';
        const params: string[] = [];

        if (warehouseId) {
            query += ' WHERE warehouseId = ?';
            params.push(warehouseId);
        }

        query += ' ORDER BY name';

        const locations = db.prepare(query).all(...params) as Location[];

        // Build tree structure
        const buildTree = (parentId: string | null = null): Location[] => {
            return locations
                .filter(loc => loc.parentId === parentId)
                .map(loc => ({
                    ...loc,
                    children: buildTree(loc.id)
                }));
        };

        return buildTree(null);
    },

    createLocation: (data: Omit<Location, 'id' | 'children'>): Location => {
        const id = uuidv4();
        const stmt = db.prepare(`
            INSERT INTO Location (id, name, code, type, warehouseId, parentId)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        stmt.run(id, data.name, data.code, data.type, data.warehouseId || null, data.parentId || null);
        return { id, ...data };
    },

    getStockByLocation: (productId?: string): StockQuant[] => {
        let query = `
            SELECT sq.*, p.name as productName, l.name as locationName
            FROM StockQuant sq
            JOIN Product p ON sq.productId = p.id
            JOIN Location l ON sq.locationId = l.id
            WHERE sq.quantity > 0
        `;
        const params: string[] = [];

        if (productId) {
            query += ' AND sq.productId = ?';
            params.push(productId);
        }

        query += ' ORDER BY p.name, l.name';

        return db.prepare(query).all(...params) as StockQuant[];
    },

    createStockTransfer: (data: Omit<StockTransfer, 'id'>): StockTransfer => {
        const id = uuidv4();

        const transaction = db.transaction(() => {
            // Insert stock movement
            const stmt = db.prepare(`
                INSERT INTO StockMovement (id, productId, quantity, sourceLocationId, destLocationId, reference, state, date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
            stmt.run(id, data.productId, data.quantity, data.sourceLocationId, data.destLocationId, data.reference || null, data.state, data.date);

            // If state is 'done', update stock quantities
            if (data.state === 'done') {
                // Decrease source location
                const decreaseStmt = db.prepare(`
                    UPDATE StockQuant 
                    SET quantity = quantity - ? 
                    WHERE productId = ? AND locationId = ?
                `);
                decreaseStmt.run(data.quantity, data.productId, data.sourceLocationId);

                // Increase destination location (insert if not exists)
                const existingDest = db.prepare(`
                    SELECT id FROM StockQuant WHERE productId = ? AND locationId = ?
                `).get(data.productId, data.destLocationId);

                if (existingDest) {
                    const increaseStmt = db.prepare(`
                        UPDATE StockQuant 
                        SET quantity = quantity + ? 
                        WHERE productId = ? AND locationId = ?
                    `);
                    increaseStmt.run(data.quantity, data.productId, data.destLocationId);
                } else {
                    const insertStmt = db.prepare(`
                        INSERT INTO StockQuant (id, productId, locationId, quantity)
                        VALUES (?, ?, ?, ?)
                    `);
                    insertStmt.run(uuidv4(), data.productId, data.destLocationId, data.quantity);
                }
            }
        });

        transaction();
        return { id, ...data };
    },

    getStockTransfers: (): StockTransfer[] => {
        const query = `
            SELECT sm.*, p.name as productName, 
                   sl.name as sourceLocationName, 
                   dl.name as destLocationName
            FROM StockMovement sm
            JOIN Product p ON sm.productId = p.id
            JOIN Location sl ON sm.sourceLocationId = sl.id
            JOIN Location dl ON sm.destLocationId = dl.id
            ORDER BY sm.date DESC
        `;
        return db.prepare(query).all() as StockTransfer[];
    }
};
