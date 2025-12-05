const db = require('../db');

exports.getAllCustomers = (req, res) => {
    try {
        const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Customer'").get();
        if (!tableExists) {
            return res.json({ success: true, data: [] });
        }
        const customers = db.prepare('SELECT * FROM Customer ORDER BY name').all();
        res.json({ success: true, data: customers });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch customers' });
    }
};
