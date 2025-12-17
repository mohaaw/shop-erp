'use server';


export async function getRecentOrders() {
    try {
        // Dynamically import the db in server action context
        const { db } = await import('@/lib/db');

        // Check if Order table exists
        const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Order'").get();

        if (!tableExists) {
            return [];
        }

        const orders = db.prepare(`
      SELECT
        o.id,
        o.total,
        o.status,
        o.createdAt,
        c.name as customerName
      FROM "Order" o
      LEFT JOIN Customer c ON o.customerId = c.id
      ORDER BY o.createdAt DESC
      LIMIT 5
    `).all();

        return orders;
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        return [];
    }
}

export async function getSalesData() {
    try {
        // Dynamically import the db in server action context
        const { db } = await import('@/lib/db');

        // Check if Order table exists
        const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Order'").get();

        if (!tableExists) {
            return [];
        }

        // Get sales for the last 30 days grouped by day
        // Note: SQLite date functions might vary, ensuring standard ISO string usage
        const sales = db.prepare(`
      SELECT
        strftime('%Y-%m-%d', createdAt) as name,
        SUM(total) as total
      FROM "Order"
      WHERE createdAt >= date('now', '-30 days')
      GROUP BY strftime('%Y-%m-%d', createdAt)
      ORDER BY name ASC
    `).all();

        return sales;
    } catch (error) {
        console.error('Error fetching sales data:', error);
        return [];
    }
}

export async function getLowStockData() {
    try {
        // Dynamically import the db in server action context
        const { db } = await import('@/lib/db');

        // Get products with low stock alerts
        const lowStock = db.prepare(`
            SELECT * FROM (
                SELECT p.*, COALESCE(SUM(sq.quantity), 0) as stock
                FROM Product p
                LEFT JOIN StockQuant sq ON p.id = sq.productId
                LEFT JOIN Location l ON sq.locationId = l.id AND l.type = 'internal'
                GROUP BY p.id
            ) WHERE minStock > 0 AND stock < minStock
            LIMIT 5
        `).all();

        return lowStock;
    } catch (error) {
        console.error('Error fetching low stock data:', error);
        return [];
    }
}

export async function getStats() {
    try {
        const { db } = await import('@/lib/db');

        let productCount = 0;
        let customerCount = 0;
        let orderCount = 0;
        let totalSales = 0;

        // Check if tables exist
        const productTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Product'").get();
        if (productTable) {
            const result = db.prepare('SELECT COUNT(*) as count FROM Product').get() as { count: number };
            productCount = result.count;
        }

        const customerTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Customer'").get();
        if (customerTable) {
            const result = db.prepare('SELECT COUNT(*) as count FROM Customer').get() as { count: number };
            customerCount = result.count;
        }

        const orderTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Order'").get();
        if (orderTable) {
            const countResult = db.prepare('SELECT COUNT(*) as count FROM "Order"').get() as { count: number };
            orderCount = countResult.count;

            const totalResult = db.prepare('SELECT SUM(total) as total FROM "Order"').get() as { total: number | null };
            totalSales = totalResult.total || 0;
        }

        return {
            success: true,
            data: {
                productCount,
                customerCount,
                orderCount,
                totalSales
            }
        };

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            success: false,
            data: {
                productCount: 0,
                customerCount: 0,
                orderCount: 0,
                totalSales: 0
            }
        };
    }
}
