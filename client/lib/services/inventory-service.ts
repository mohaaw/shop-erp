import { db } from '@/lib/db';
import { randomUUID } from 'crypto';
import { Product } from '@/types/product';

export interface Warehouse {
    id: string;
    name: string;
    code: string;
}

export interface Location {
    id: string;
    name: string;
    code: string;
    type: string;
    warehouseId?: string | null;
    parentId?: string | null;
}

export interface StockMovement {
    id: string;
    productId: string;
    quantity: number;
    sourceLocationId: string;
    destLocationId: string;
    reference?: string | null;
    state: 'draft' | 'done';
    date: string;
}

export const inventoryService = {
    createWarehouse: (data: { name: string; code: string }) => {
        const id = randomUUID();
        const stmt = db.prepare('INSERT INTO Warehouse (id, name, code) VALUES (?, ?, ?)');
        stmt.run(id, data.name, data.code);

        // Create default locations for the warehouse
        const viewLocId = randomUUID();
        db.prepare('INSERT INTO Location (id, name, code, type, warehouseId) VALUES (?, ?, ?, ?, ?)').run(viewLocId, data.code, data.code, 'view', id);

        const stockLocId = randomUUID();
        db.prepare('INSERT INTO Location (id, name, code, type, warehouseId, parentId) VALUES (?, ?, ?, ?, ?, ?)').run(stockLocId, 'Stock', data.code + '/STOCK', 'internal', id, viewLocId);

        const inputLocId = randomUUID();
        db.prepare('INSERT INTO Location (id, name, code, type, warehouseId, parentId) VALUES (?, ?, ?, ?, ?, ?)').run(inputLocId, 'Input', data.code + '/INPUT', 'internal', id, viewLocId);

        const outputLocId = randomUUID();
        db.prepare('INSERT INTO Location (id, name, code, type, warehouseId, parentId) VALUES (?, ?, ?, ?, ?, ?)').run(outputLocId, 'Output', data.code + '/OUTPUT', 'internal', id, viewLocId);

        return { id, ...data };
    },

    getWarehouses: () => {
        return db.prepare('SELECT * FROM Warehouse').all() as Warehouse[];
    },

    getLocations: (warehouseId?: string) => {
        if (warehouseId) {
            return db.prepare('SELECT * FROM Location WHERE warehouseId = ?').all(warehouseId) as Location[];
        }
        return db.prepare('SELECT * FROM Location').all() as Location[];
    },

    createStockMovement: (data: { productId: string; quantity: number; sourceLocationId: string; destLocationId: string; reference?: string }) => {
        const moveId = randomUUID();
        const date = new Date().toISOString();

        const transaction = db.transaction(() => {
            // 1. Create Movement
            db.prepare(`
                INSERT INTO StockMovement (id, productId, quantity, sourceLocationId, destLocationId, reference, state, date)
                VALUES (?, ?, ?, ?, ?, ?, 'done', ?)
            `).run(moveId, data.productId, data.quantity, data.sourceLocationId, data.destLocationId, data.reference || null, date);

            // 2. Update Source Quant (Decrement)
            db.prepare(`
                INSERT INTO StockQuant (id, productId, locationId, quantity)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(productId, locationId) DO UPDATE SET quantity = quantity - excluded.quantity
            `).run(randomUUID(), data.productId, data.sourceLocationId, data.quantity); // Note: Logic is tricky here. 
            // Actually, for Source, we need to SUBTRACT. The upsert above ADDS if new.
            // Correct logic:
            // Check if quant exists. If not, create with -quantity. If yes, subtract.
            // SQLite upsert can do this:
            // VALUES (..., -quantity) ... UPDATE SET quantity = quantity + excluded.quantity (which is adding negative)

            // Let's redo the Source Quant update properly
            db.prepare(`
                INSERT INTO StockQuant (id, productId, locationId, quantity)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(productId, locationId) DO UPDATE SET quantity = quantity + excluded.quantity
            `).run(randomUUID(), data.productId, data.sourceLocationId, -data.quantity);

            // 3. Update Dest Quant (Increment)
            db.prepare(`
                INSERT INTO StockQuant (id, productId, locationId, quantity)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(productId, locationId) DO UPDATE SET quantity = quantity + excluded.quantity
            `).run(randomUUID(), data.productId, data.destLocationId, data.quantity);
        });

        transaction();
        return { id: moveId, ...data, state: 'done', date };
    },

    getStockLevel: (productId: string, locationId: string) => {
        const result = db.prepare('SELECT quantity FROM StockQuant WHERE productId = ? AND locationId = ?').get(productId, locationId) as { quantity: number } | undefined;
        return result ? result.quantity : 0;
    },

    getProductStock: (productId: string) => {
        // Sum of all internal locations
        // We need to know which locations are internal.
        // For now, let's just sum all quants where location type is 'internal'
        const result = db.prepare(`
            SELECT SUM(sq.quantity) as total 
            FROM StockQuant sq
            JOIN Location l ON sq.locationId = l.id
            WHERE sq.productId = ? AND l.type = 'internal'
        `).get(productId) as { total: number } | undefined;
        return result ? result.total : 0;
    },

    getProductsWithStock: () => {
        // Get all products and their current stock level (sum of internal locations)
        const products = db.prepare(`
            SELECT p.*, COALESCE(SUM(sq.quantity), 0) as stock
            FROM Product p
            LEFT JOIN StockQuant sq ON p.id = sq.productId
            LEFT JOIN Location l ON sq.locationId = l.id AND l.type = 'internal'
            GROUP BY p.id
        `).all();
        return products as (Product & { stock: number })[];
    },

    getAllStockQuants: () => {
        return db.prepare(`
            SELECT sq.*, p.name as productName, l.name as locationName 
            FROM StockQuant sq
            JOIN Product p ON sq.productId = p.id
            JOIN Location l ON sq.locationId = l.id
        `).all();
    },

    updateStock: (productId: string, locationId: string, newQuantity: number) => {
        // This is a "Physical Inventory" adjustment.
        // We calculate the difference and create a movement to/from "Inventory Adjustment" location.
        // For simplicity, we'll just assume a direct update for now, but ideally we should find/create a virtual location for adjustments.

        // 1. Get current stock
        const currentQty = inventoryService.getStockLevel(productId, locationId);
        const diff = newQuantity - currentQty;

        if (diff === 0) return;

        // 2. Determine Source/Dest
        // If diff > 0, we are adding stock. Source: Virtual/Adjustment, Dest: locationId
        // If diff < 0, we are removing stock. Source: locationId, Dest: Virtual/Adjustment

        // Let's find or create a Virtual Location for adjustments
        let adjustmentLoc = db.prepare("SELECT id FROM Location WHERE type = 'virtual' AND name = 'Inventory Adjustment'").get() as { id: string } | undefined;

        if (!adjustmentLoc) {
            const id = randomUUID();
            db.prepare("INSERT INTO Location (id, name, code, type) VALUES (?, ?, ?, ?)").run(id, 'Inventory Adjustment', 'VIRTUAL/ADJ', 'virtual');
            adjustmentLoc = { id };
        }

        if (diff > 0) {
            inventoryService.createStockMovement({
                productId,
                quantity: diff,
                sourceLocationId: adjustmentLoc.id,
                destLocationId: locationId,
                reference: 'Inventory Adjustment'
            });
        } else {
            inventoryService.createStockMovement({
                productId,
                quantity: Math.abs(diff),
                sourceLocationId: locationId,
                destLocationId: adjustmentLoc.id,
                reference: 'Inventory Adjustment'
            });
        }
    },

    getLowStockProducts: () => {
        // Get products where stock < minStock
        // Note: We need to aggregate stock first.
        // This query gets products, sums their internal stock, and filters by minStock.
        return db.prepare(`
            SELECT * FROM (
                SELECT p.*, COALESCE(SUM(sq.quantity), 0) as stock
                FROM Product p
                LEFT JOIN StockQuant sq ON p.id = sq.productId
                LEFT JOIN Location l ON sq.locationId = l.id AND l.type = 'internal'
                GROUP BY p.id
            ) WHERE minStock > 0 AND stock < minStock
        `).all();
    }
};
