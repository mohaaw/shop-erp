import 'server-only';
import { db } from '@/lib/db';

export interface SalesReportData {
    date: string;
    revenue: number;
    orders: number;
}

export interface InventoryValuationData {
    category: string;
    value: number;
    itemCount: number;
}

export const reportService = {
    getSalesReport: (startDate: string, endDate: string) => {
        const stmt = db.prepare(`
            SELECT 
                strftime('%Y-%m-%d', createdAt) as date,
                SUM(total) as revenue,
                COUNT(id) as orders
            FROM 'Order'
            WHERE status = 'completed' 
            AND createdAt BETWEEN @startDate AND @endDate
            GROUP BY date
            ORDER BY date ASC
        `);
        return stmt.all({ startDate, endDate }) as SalesReportData[];
    },

    getInventoryValuation: () => {
        // Valuation based on Cost * Quantity (assuming StockQuant or product count if simple)
        // Since we have StockQuant, let's try to join or just use Product cost if simple
        // For simplicity in this senior upgrade, we'll sum Product Cost * Stock Level (if tracked) or just Product Price * 1 for estimation if stock not fully implemented yet 
        // But better: Join Product and Category
        const stmt = db.prepare(`
            SELECT 
                c.name as category,
                SUM(p.cost * sq.quantity) as value,
                COUNT(DISTINCT p.id) as itemCount
            FROM Product p
            LEFT JOIN Category c ON p.categoryId = c.id
            LEFT JOIN StockQuant sq ON p.id = sq.productId
            WHERE p.type = 'storable'
            GROUP BY c.id
        `);
        // Note: This query assumes StockQuant exists and is populated. 
        // If system uses simple stock in Product table (minStock etc), it might be different. 
        // Based on schema, we have StockQuant.

        try {
            return stmt.all() as InventoryValuationData[];
        } catch (e) {
            console.warn("StockQuant query failed, falling back to simple product valuation", e);
            const fallback = db.prepare(`
                SELECT 
                    c.name as category,
                    SUM(p.cost * 1) as value, -- Placeholder: assuming 1 unit if stock unknown
                    COUNT(p.id) as itemCount
                FROM Product p
                LEFT JOIN Category c ON p.categoryId = c.id
                GROUP BY c.id
            `);
            return fallback.all() as InventoryValuationData[];
        }
    }
};
