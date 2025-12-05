const db = require('../db');

exports.getSettings = (req, res) => {
    try {
        const settings = db.prepare('SELECT * FROM Settings LIMIT 1').get();

        if (!settings) {
            // Return default if not found (or create one)
            return res.json({
                success: true,
                data: {
                    storeName: 'ERP-SHOP',
                    currency: 'usd',
                    timezone: 'utc'
                }
            });
        }

        res.json({ success: true, data: settings });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch settings' });
    }
};
