const db = require('../db');

exports.getAllOrders = (req, res) => {
    try {
        const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Order'").get();
        if (!tableExists) {
            return res.json({ success: true, data: [] });
        }
        const orders = db.prepare('SELECT * FROM "Order" ORDER BY createdAt DESC').all();
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
};
