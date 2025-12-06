'use server';

import { db } from '@/lib/db';

export async function getRecentOrders() {
    try {
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
