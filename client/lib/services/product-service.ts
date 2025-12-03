import { db } from '@/lib/db';
import { ProductFormValues } from '@/lib/validations/product';
import { randomUUID } from 'crypto';

export class ProductService {
    static createProduct(data: ProductFormValues) {
        const id = randomUUID();
        const stmt = db.prepare(`
            INSERT INTO Product (
                id, name, description, price, cost, sku, barcode, 
                type, availableInPos, posCategory, toppings, isCombo, comboItems,
                weight, volume, hsCode, countryOfOrigin,
                minStock, images,
                updatedAt
            ) VALUES (
                @id, @name, @description, @price, @cost, @sku, @barcode,
                @type, @availableInPos, @posCategory, @toppings, @isCombo, @comboItems,
                @weight, @volume, @hsCode, @countryOfOrigin,
                @minStock, @images,
                CURRENT_TIMESTAMP
            )
        `);

        const run = db.transaction(() => {
            stmt.run({
                id,
                name: data.name,
                description: data.description || null,
                price: data.price,
                cost: data.cost || 0,
                sku: data.sku || null,
                barcode: data.barcode || null,
                type: data.type,
                availableInPos: data.availableInPos ? 1 : 0,
                posCategory: data.posCategory || null,
                toppings: data.toppings || null,
                isCombo: data.isCombo ? 1 : 0,
                comboItems: data.comboItems || null,
                weight: data.weight || null,
                volume: data.volume || null,
                hsCode: data.hsCode || null,
                countryOfOrigin: data.countryOfOrigin || null,
                minStock: data.minStock || 0,
                images: data.images ? JSON.stringify(data.images) : '[]',
            });
        });

        run();
        return this.getProduct(id);
    }
    static getProduct(id: string) {
        return db.prepare('SELECT * FROM Product WHERE id = ?').get(id);
    }

    static getProducts() {
        return db.prepare(`
            SELECT 
                p.*,
                c.name as category,
                COALESCE((SELECT SUM(quantity) FROM StockQuant WHERE productId = p.id), 0) as stock
            FROM Product p 
            LEFT JOIN Category c ON p.categoryId = c.id
            ORDER BY p.name
        `).all();
    }

    static getPosProducts() {
        return db.prepare(`
            SELECT 
                p.*,
                COALESCE((SELECT SUM(quantity) FROM StockQuant WHERE productId = p.id), 0) as stock
            FROM Product p 
            WHERE p.availableInPos = 1 
            ORDER BY p.posCategory, p.name
        `).all();
    }

    static deleteProduct(id: string) {
        return db.prepare('DELETE FROM Product WHERE id = ?').run(id);
    }
}
