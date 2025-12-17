const db = require('../db');
const redis = require('../redis');

const CACHE_TTL = {
    STATS: 60, // 1 minute
    SALES: 300, // 5 minutes
    RECENT_ORDERS: 10 // 10 seconds (realtime-ish)
};

exports.getStats = async (req, res) => {
    try {
        const cacheKey = 'dashboard:stats';
        const cached = await redis.get(cacheKey);

        if (cached) {
            return res.json({ success: true, data: cached });
        }

        const productCount = db.prepare('SELECT COUNT(*) as count FROM Product').get().count;

        // Check tables existence before querying to avoid errors during initial setup
        let customerCount = 0;
        let orderCount = 0;
        let totalSales = 0;

        const customerTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Customer'").get();
        if (customerTable) {
            customerCount = db.prepare('SELECT COUNT(*) as count FROM Customer').get().count;
        }

        const orderTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Order'").get();
        if (orderTable) {
            orderCount = db.prepare('SELECT COUNT(*) as count FROM "Order"').get().count;
            totalSales = db.prepare('SELECT SUM(total) as total FROM "Order"').get().total || 0;
        }

        const data = {
            totalSales,
            orderCount,
            customerCount,
            productCount
        };

        await redis.set(cacheKey, data, CACHE_TTL.STATS);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
};

exports.getSalesChart = async (req, res) => {
    try {
        const cacheKey = 'dashboard:sales_chart';
        const cached = await redis.get(cacheKey);

        if (cached) {
            return res.json({ success: true, data: cached });
        }

        // Sample data - in a real app, this would aggregate order data by date
        const salesData = [
            { name: 'Jan', total: 4000 },
            { name: 'Feb', total: 3000 },
            { name: 'Mar', total: 2000 },
            { name: 'Apr', total: 2780 },
            { name: 'May', total: 1890 },
            { name: 'Jun', total: 2390 },
            { name: 'Jul', total: 3490 },
            { name: 'Aug', total: 4000 },
            { name: 'Sep', total: 3000 },
            { name: 'Oct', total: 2000 },
            { name: 'Nov', total: 2780 },
            { name: 'Dec', total: 1890 },
        ];

        await redis.set(cacheKey, salesData, CACHE_TTL.SALES);

        res.json({
            success: true,
            data: salesData
        });
    } catch (error) {
        console.error('Error fetching sales chart data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch sales chart data' });
    }
};

exports.getRecentOrders = async (req, res) => {
    try {
        const cacheKey = 'dashboard:recent_orders';
        const cached = await redis.get(cacheKey);

        if (cached) {
            return res.json({ success: true, data: cached });
        }

        const orderTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Order'").get();
        if (!orderTable) {
            return res.json({
                success: true,
                data: []
            });
        }

        const recentOrders = db.prepare(`
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

        await redis.set(cacheKey, recentOrders, CACHE_TTL.RECENT_ORDERS);

        res.json({
            success: true,
            data: recentOrders
        });
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch recent orders' });
    }
};
