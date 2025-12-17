// shop-erp-backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

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

// Dashboard Routes
const dashboardController = require('./controllers/dashboardController');
const authenticateToken = require('./middleware/authMiddleware');

app.get('/api/dashboard/stats', authenticateToken, dashboardController.getStats);
app.get('/api/dashboard/sales-chart', authenticateToken, dashboardController.getSalesChart);
app.get('/api/dashboard/recent-orders', authenticateToken, dashboardController.getRecentOrders);


// --- Server Status Dashboard (Web GUI) ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor(seconds % (3600 * 24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

app.get('/monitor', (req, res) => {
  const memory = process.memoryUsage();

  // Basic stats
  const stats = {
    uptime: formatUptime(process.uptime()),
    memoryUsage: Math.round(memory.rss / 1024 / 1024) + ' MB',
    platform: process.platform,
    nodeVersion: process.version,
    pid: process.pid,
    port: PORT,
    connectionCount: socketIO.getConnectionCount ? socketIO.getConnectionCount() : 0
  };

  res.render('dashboard', stats);
});


app.get('/', (req, res) => {
  res.redirect('/monitor');
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
const http = require('http');
const socketIO = require('./socket');
const { exec } = require('child_process');

const server = http.createServer(app);
socketIO.init(server);

// Function to kill the process using the port and restart the server
// Function to kill the process using the port and restart the server
function startServer() {
  server.listen(PORT, () => {
    console.log(`🚀 Shop ERP Server running on http://localhost:${PORT}`);
    console.log(`🔒 Security: Helmet & Rate Limiting enabled`);
    console.log(`⚡ Performance: Compression enabled`);
    console.log(`💬 Socket.io: Enabled`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${PORT} is in use. Attempting to kill the process...`);
      const cmd = process.platform === 'win32'
        ? `netstat -ano | findstr :${PORT}`
        : `lsof -t -i:${PORT}`;

      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          // Fallback for some linux environments without lsof, try fuser or just fail gracefully
          console.log(`⚠️  Could not find process with lsof, trying fuser...`);
          exec(`fuser -k ${PORT}/tcp`, (err2, stdout2) => {
            if (err2) {
              console.error(`❌ Failed to kill process on port ${PORT}. Please stop it manually.`);
              process.exit(1);
            }
            console.log(`✅ Process killed. Restarting server...`);
            setTimeout(startServer, 1000);
          });
          return;
        }

        const pids = stdout.trim().split('\n');
        if (pids.length > 0) {
          const killCmd = process.platform === 'win32'
            ? `taskkill /F /PID ${pids[0]}`
            : `kill -9 ${pids.join(' ')}`;

          exec(killCmd, (err, stdout, stderr) => {
            if (err) {
              console.error(`❌ Failed to kill process ${pids.join(' ')}`);
              process.exit(1);
            }
            console.log(`✅ Process ${pids.join(' ')} killed. Restarting server...`);
            setTimeout(startServer, 1000);
          });
        }
      });
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer();
