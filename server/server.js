// shop-erp-backend/server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3001; // Backend runs on port 3001
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key-for-shop-erp-project-secure'; // Use a strong secret

// Middleware
// Configure CORS properly for all origins in development
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json()); // To parse JSON request bodies

// --- Mock User Data (In a real app, this would be a database) ---
const MOCK_USERS = [
  {
    id: 'admin001',
    email: 'admin@example.com',
    passwordHash: bcrypt.hashSync('password123', 10), // Hashed 'password123'
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: 'staff001',
    email: 'staff@example.com',
    passwordHash: bcrypt.hashSync('password123', 10), // Hashed 'password123'
    name: 'Staff Member',
    role: 'staff'
  }
];

// --- Logging Middleware (Optional but helpful for debugging) ---
app.use((req, res, next) => {
  console.log(`Backend Request: ${req.method} ${req.originalUrl}`, req.body ? `Body: ${JSON.stringify(req.body)}` : '');
  next();
});


// --- Authentication Routes ---

// POST /api/auth/register (Mock)
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required for registration.' });
  }
  if (MOCK_USERS.find(u => u.email === email)) {
    return res.status(409).json({ success: false, message: 'User with this email already exists.' });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = { id: `user_${Date.now()}`, email, passwordHash, name, role: 'staff' };
    // MOCK_USERS.push(newUser); // In a real app, save to DB. For this mock, we don't persist new users across restarts.
    console.log('Backend: Mock registered new user (not persisted):', email);
    res.status(201).json({ success: true, message: 'User registered successfully. Please login.', user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  } catch (error) {
    console.error("Backend: Registration error", error);
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = MOCK_USERS.find(u => u.email === email);
  if (!user) {
    console.log(`Backend: Login failed - User ${email} not found.`);
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordMatch) {
    console.log(`Backend: Login failed - Password mismatch for ${email}.`);
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  const userPayload = { id: user.id, email: user.email, role: user.role, name: user.name };
  const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

  console.log(`Backend: Login successful for: ${email}. Token generated.`);
  res.status(200).json({ // Explicitly set 200 OK status for success
    success: true,
    message: 'Login successful!',
    token: token,
    user: userPayload // Send user profile (without passwordHash)
  });
});

// Middleware to verify JWT (for protected routes)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expects "Bearer TOKEN_STRING"

  if (token == null) {
    console.log('Backend Auth Middleware: No token provided.');
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Backend Auth Middleware: Token verification failed.', err.message);
      return res.status(403).json({ success: false, message: "Access denied. Token is not valid or expired." });
    }
    req.user = user; // Add decoded user payload to request object
    // console.log('Backend Auth Middleware: Token verified for user:', user.email);
    next();
  });
};

// GET /api/auth/me (Protected route to get current user profile)
app.get('/api/auth/me', authenticateToken, (req, res) => {
  // req.user is populated by authenticateToken middleware
  console.log('Backend: GET /api/auth/me called for user:', req.user.email);
  // In a real app, you might fetch fresh user details from DB using req.user.id
  const userProfile = MOCK_USERS.find(u => u.id === req.user.id);
  if (!userProfile) {
    return res.status(404).json({ success: false, message: "User profile not found after token authentication." })
  }
  const { passwordHash, ...profileToReturn } = userProfile; // Exclude password hash
  res.status(200).json({ success: true, user: profileToReturn });
});

// POST /api/auth/logout (Mock - real logout often involves blacklisting tokens)
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  console.log(`Backend: User ${req.user.email} logged out (server-side notification).`);
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

const db = require('./db');

// --- API Routes ---

// Products
app.get('/api/products', authenticateToken, (req, res) => {
  try {
    const products = db.prepare(`
            SELECT 
                p.*,
                c.name as category,
                COALESCE((SELECT SUM(quantity) FROM StockQuant WHERE productId = p.id), 0) as stock
            FROM Product p 
            LEFT JOIN Category c ON p.categoryId = c.id
            ORDER BY p.name
        `).all();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', authenticateToken, (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM Product WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
});

// Customers
app.get('/api/customers', authenticateToken, (req, res) => {
  try {
    // Check if table exists
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
});

// Orders
app.get('/api/orders', authenticateToken, (req, res) => {
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
});

// Dashboard Stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  try {
    const productCount = db.prepare('SELECT COUNT(*) as count FROM Product').get().count;
    // Mocking others until tables exist
    const customerCount = db.prepare('SELECT COUNT(*) as count FROM Customer').get().count;
    const orderCount = db.prepare('SELECT COUNT(*) as count FROM "Order"').get().count;
    const totalSales = db.prepare('SELECT SUM(total) as total FROM "Order"').get().total || 0;

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
  console.log("Backend: GET /api/test reached");
  res.status(200).json({ success: true, message: "Backend API is reachable!" });
});


// Catch-all for unhandled API routes (must be AFTER specific API routes)
// This middleware will only be reached if no other /api/... route matched.
app.use('/api', (req, res, next) => {
  if (!res.headersSent) {
    console.warn(`Backend: 404 - API route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ success: false, message: `The API endpoint ${req.method} ${req.path} was not found on this server.` });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock API Server running on http://localhost:${PORT}`);
  console.log(`Ensure your Vue app's .env file has VITE_API_BASE_URL=http://localhost:${PORT}/api`);
  MOCK_USERS.forEach(u => console.log(`  - Mock User: Email: ${u.email}, Password: password123`));
});
