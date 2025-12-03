import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export interface SerialNumber {
    id: string;
    productId: string;
    serialNumber: string;
    status: 'available' | 'sold' | 'scrapped';
    locationId?: string;
    batchId?: string;
    createdAt: string;
    updatedAt: string;
    productName?: string;
    locationName?: string;
}

export interface Batch {
    id: string;
    productId: string;
    batchNumber: string;
    quantity: number;
    expiryDate?: string;
    manufactureDate?: string;
    locationId?: string;
    createdAt: string;
    updatedAt: string;
    productName?: string;
    locationName?: string;
}

export const serialBatchService = {
    // Serial Number Management
    createSerialNumber: (data: Omit<SerialNumber, 'id' | 'createdAt' | 'updatedAt' | 'productName' | 'locationName'>): SerialNumber => {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO SerialNumber (id, productId, serialNumber, status, locationId, batchId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(id, data.productId, data.serialNumber, data.status, data.locationId || null, data.batchId || null, now, now);
        return { id, ...data, createdAt: now, updatedAt: now };
    },

    getSerialNumbers: (productId?: string): SerialNumber[] => {
        let query = `
            SELECT sn.*, p.name as productName, l.name as locationName
            FROM SerialNumber sn
            JOIN Product p ON sn.productId = p.id
            LEFT JOIN Location l ON sn.locationId = l.id
        `;
        const params: string[] = [];

        if (productId) {
            query += ' WHERE sn.productId = ?';
            params.push(productId);
        }

        query += ' ORDER BY sn.createdAt DESC';
        return db.prepare(query).all(...params) as SerialNumber[];
    },

    updateSerialStatus: (id: string, status: 'available' | 'sold' | 'scrapped', locationId?: string) => {
        const now = new Date().toISOString();
        const stmt = db.prepare(`
            UPDATE SerialNumber 
            SET status = ?, locationId = ?, updatedAt = ?
            WHERE id = ?
        `);
        stmt.run(status, locationId || null, now, id);
    },

    // Batch Management
    createBatch: (data: Omit<Batch, 'id' | 'createdAt' | 'updatedAt' | 'productName' | 'locationName'>): Batch => {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO Batch (id, productId, batchNumber, quantity, expiryDate, manufactureDate, locationId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            data.productId,
            data.batchNumber,
            data.quantity,
            data.expiryDate || null,
            data.manufactureDate || null,
            data.locationId || null,
            now,
            now
        );
        return { id, ...data, createdAt: now, updatedAt: now };
    },

    getBatches: (productId?: string): Batch[] => {
        let query = `
            SELECT b.*, p.name as productName, l.name as locationName
            FROM Batch b
            JOIN Product p ON b.productId = p.id
            LEFT JOIN Location l ON b.locationId = l.id
        `;
        const params: string[] = [];

        if (productId) {
            query += ' WHERE b.productId = ?';
            params.push(productId);
        }

        query += ' ORDER BY b.expiryDate ASC NULLS LAST';
        return db.prepare(query).all(...params) as Batch[];
    },

    getExpiringBatches: (daysAhead: number = 30): Batch[] => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);

        const query = `
            SELECT b.*, p.name as productName, l.name as locationName
            FROM Batch b
            JOIN Product p ON b.productId = p.id
            LEFT JOIN Location l ON b.locationId = l.id
            WHERE b.expiryDate IS NOT NULL 
            AND b.expiryDate <= ?
            AND b.quantity > 0
            ORDER BY b.expiryDate ASC
        `;

        return db.prepare(query).all(futureDate.toISOString().split('T')[0]) as Batch[];
    },

    updateBatchQuantity: (id: string, quantity: number) => {
        const now = new Date().toISOString();
        const stmt = db.prepare(`
            UPDATE Batch 
            SET quantity = ?, updatedAt = ?
            WHERE id = ?
        `);
        stmt.run(quantity, now, id);
    }
};
