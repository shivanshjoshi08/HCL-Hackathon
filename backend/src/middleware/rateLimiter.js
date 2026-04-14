import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Increased from 100 to 2000 to prevent issues during testing
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased from 5 to 100 for testing purposes
  message: {
    success: false,
    error: {
      message: 'Too many login attempts, please try again after 15 minutes.',
    },
  },
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Limiter for transaction endpoints
export const transactionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // Increased from 10 to 200
  message: {
    success: false,
    error: {
      message: 'Too many transactions, please wait a moment.',
    },
  },
});

// Limiter for KYC uploads
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Increased from 5 to 100
  message: {
    success: false,
    error: {
      message: 'Too many upload attempts, please try again later.',
    },
  },
});
