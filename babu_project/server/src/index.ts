import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB, sequelize } from './config/database.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(
  cors({
    origin: [clientUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/v1/auth', authLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Register API Routes
app.use('/api/v1', apiRoutes);

// Database initialization and server boot
async function startServer() {
  try {
    await connectDB();
    // Sync models with MySQL
    await sequelize.sync({ alter: true });
    console.log('✅ Sequelize models synchronized with MySQL database.');

    app.listen(PORT, () => {
      console.log(`🚀 Casino Backend API running at http://localhost:${PORT}`);
      console.log(`📡 Seamless Wallet Callbacks listening on http://localhost:${PORT}/api/v1/callback/seamless/*`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
}

startServer();

