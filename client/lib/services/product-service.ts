import "server-only";
import { db } from '@/lib/db';
import { ProductFormValues } from '@/lib/validations/product';
import { Product } from '@/types/product';
import { randomUUID } from 'crypto';



export class ProductService {
    static createProduct(data: ProductFormValues) {
        const id = randomUUID();
        const stmt = db.prepare(`
            INSERT INTO Product (
                id, name, description, price, cost, sku, barcode, categoryId,
                type, image, availableInPos, posCategory, toppings, isCombo, comboItems,
                weight, volume, dimensions, hsCode, countryOfOrigin, tracking,
                brand, model, specifications, warranty, minStock,
                updatedAt
            ) VALUES (
                @id, @name, @description, @price, @cost, @sku, @barcode, @categoryId,
                @type, @image, @availableInPos, @posCategory, @toppings, @isCombo, @comboItems,
                @weight, @volume, @dimensions, @hsCode, @countryOfOrigin, @tracking,
                @brand, @model, @specifications, @warranty, @minStock,
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
                categoryId: data.category || null,
                type: data.type,
                image: data.images && data.images.length > 0 ? data.images[0] : null, // New field, derived from images
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


    static getProducts() {
        return db.prepare(`
            SELECT 
                p.*,
                c.name as category,
                COALESCE((SELECT SUM(quantity) FROM StockQuant WHERE productId = p.id), 0) as stock
            FROM Product p 
            LEFT JOIN Category c ON p.categoryId = c.id
            ORDER BY p.name
        `).all() as Product[];
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

    static getProduct(id: string): Product | null {
        const stmt = db.prepare('SELECT * FROM Product WHERE id = ?');
        const product = stmt.get(id) as Omit<Product, 'availableInPos' | 'isCombo' | 'dimensions'> & { availableInPos: number; isCombo: number; dimensions: string };

        if (!product) return null;

        return {
            ...product,
            availableInPos: Boolean(product.availableInPos),
            isCombo: Boolean(product.isCombo),
            images: product.image ? [product.image] : [],
            dimensions: product.dimensions ? JSON.parse(product.dimensions) : undefined,
        };
    }

    static deleteProduct(id: string) {
        return db.prepare('DELETE FROM Product WHERE id = ?').run(id);
    }
}
