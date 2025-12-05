import { db } from '../db';
import { randomUUID } from 'crypto';
import { inventoryService } from './inventory-service';

export interface CreateOrderData {
    customerId?: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    status?: 'pending' | 'paid' | 'shipped';
    paymentStatus?: 'unpaid' | 'paid';
}

export interface Order {
    id: string;
    number: string;
    customerId?: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
}

export const orderService = {
    createOrder: (data: CreateOrderData) => {
        const orderId = randomUUID();
        const total = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const transaction = db.transaction(() => {
            // 1. Create Order
            db.prepare(`
                INSERT INTO "Order" (id, customerId, total, status, paymentStatus)
                VALUES (?, ?, ?, ?, ?)
            `).run(orderId, data.customerId || null, total, data.status || 'pending', data.paymentStatus || 'unpaid');

            // 2. Create Order Items and Deduct Stock
            const insertItem = db.prepare(`
                INSERT INTO OrderItem (id, orderId, productId, quantity, price)
                VALUES (?, ?, ?, ?, ?)
            `);

            // Find default stock location (internal)
            // Ideally we should pick a specific warehouse/location.
            // For now, we pick the first internal location found for the product or a default one.
            // Let's assume WH01/STOCK for simplicity or find it.
            const stockLoc = db.prepare("SELECT id FROM Location WHERE code LIKE '%/STOCK' LIMIT 1").get() as { id: string } | undefined;
            const sourceLocId = stockLoc?.id;

            // Find/Create Customer Location (Partner Location)
            let customerLoc = db.prepare("SELECT id FROM Location WHERE type = 'customer' LIMIT 1").get() as { id: string } | undefined;
            if (!customerLoc) {
                const id = randomUUID();
                db.prepare("INSERT INTO Location (id, name, code, type) VALUES (?, ?, ?, ?)").run(id, 'Customer Location', 'PARTNER/CUST', 'customer');
                customerLoc = { id };
            }

            for (const item of data.items) {
                insertItem.run(randomUUID(), orderId, item.productId, item.quantity, item.price);

                if (sourceLocId && customerLoc) {
                    // Deduct Stock (Move from Stock to Customer)
                    inventoryService.createStockMovement({
                        productId: item.productId,
                        quantity: item.quantity,
                        sourceLocationId: sourceLocId,
                        destLocationId: customerLoc.id,
                        reference: `Order ${orderId}`
                    });
                }
            }
        });

        transaction();
        return { id: orderId, total };
    },

    getOrders: () => {
        return db.prepare('SELECT * FROM "Order" ORDER BY createdAt DESC').all();
    },

    getOrderById: (id: string) => {
        const order = db.prepare(`
            SELECT o.*, c.name as customerName, c.email as customerEmail
            FROM "Order" o
            LEFT JOIN Customer c ON o.customerId = c.id
            WHERE o.id = ?
        `).get(id);

        if (order) {
            // @ts-expect-error: Adding items property to order object which is not in the type definition yet
            order.items = db.prepare(`
                SELECT oi.*, p.name as productName, p.sku as productSku
                FROM OrderItem oi
                JOIN Product p ON oi.productId = p.id
                WHERE oi.orderId = ?
            `).all(id);
        }
        return order;
    },

    updateOrderStatus: (id: string, status: string) => {
        return db.prepare('UPDATE "Order" SET status = ? WHERE id = ?').run(status, id);
    },

    updatePaymentStatus: (id: string, status: string) => {
        return db.prepare('UPDATE "Order" SET paymentStatus = ? WHERE id = ?').run(status, id);
    }
};
