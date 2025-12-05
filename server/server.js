// shop-erp-backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Security & Performance Middleware ---
app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Gzip compression
app.use(morgan('dev')); // Request logging

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);

// Dashboard Stats (Kept inline for simplicity as it aggregates multiple domains)
const authenticateToken = require('./middleware/authMiddleware');
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  try {
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

    res.json({
      success: true,
      data: {
        totalSales,
        orderCount,
        customerCount,
        productCount
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

app.get('/api/test', (req, res) => {
  res.status(200).json({ success: true, message: "Backend API is reachable!" });
});

// 404 Handler
app.use('/api', (req, res) => {
  if (!res.headersSent) {
    res.status(404).json({ success: false, message: `Endpoint not found: ${req.method} ${req.originalUrl}` });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Shop ERP Server running on http://localhost:${PORT}`);
  console.log(`🔒 Security: Helmet & Rate Limiting enabled`);
  console.log(`⚡ Performance: Compression enabled`);
});
