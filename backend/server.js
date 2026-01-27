import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';

import authRoutes from './src/routes/auth.routes.js';
import accountRoutes from './src/routes/account.routes.js';
import transactionRoutes from './src/routes/transaction.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import kycRoutes from './src/routes/kyc.routes.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { apiLimiter } from './src/middleware/rateLimiter.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet()); // Set security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('dev'));

// Rate limiting for all API routes
app.use('/api', apiLimiter);

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SmartBank API is running',
    version: '1.0.0',
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/kyc', kycRoutes);

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
