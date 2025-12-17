const db = require('../db');
const redis = require('../redis');

const CACHE_TTL = 300; // 5 minutes

exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1000; // Default to high number for backward compatibility
        const offset = (page - 1) * limit;

        const cacheKey = `products:all:${page}:${limit}`;
        const cached = await redis.get(cacheKey);

        if (cached) {
            return res.json({ success: true, data: cached.data, pagination: cached.pagination });
        }

        const products = db.prepare(`
            SELECT 
                p.*,
                c.name as category,
                COALESCE((SELECT SUM(quantity) FROM StockQuant WHERE productId = p.id), 0) as stock
            FROM Product p 
            LEFT JOIN Category c ON p.categoryId = c.id
            ORDER BY p.name
            LIMIT ? OFFSET ?
        `).all(limit, offset);

        const totalCount = db.prepare('SELECT COUNT(*) as count FROM Product').get().count;
        const pagination = {
            page,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit)
        };

        // specialized response structure? standardized to data for now
        // If client expects array directly at data, this maintains it.
        // But adding pagination metadata is helpful.

        await redis.set(cacheKey, { data: products, pagination }, CACHE_TTL);

        res.json({ success: true, data: products, pagination });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const cacheKey = `products:${id}`;
        const cached = await redis.get(cacheKey);

        if (cached) {
            return res.json({ success: true, data: cached });
        }

        const product = db.prepare('SELECT * FROM Product WHERE id = ?').get(id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        await redis.set(cacheKey, product, CACHE_TTL);

        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch product' });
    }
};
