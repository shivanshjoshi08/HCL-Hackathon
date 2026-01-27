import express from 'express';
import { body, query } from 'express-validator';
import { deposit, transfer, getTransactionHistory, getAccountStatement, mockDeposit } from '../controllers/transaction.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { transactionLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Deposit validation
const depositValidation = [
  body('accountId').notEmpty().withMessage('Account ID is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
];

// Mock deposit validation (simpler)
const mockDepositValidation = [
  body('accountId').notEmpty().withMessage('Account ID is required'),
];

// Transfer validation
const transferValidation = [
  body('fromAccountId').notEmpty().withMessage('Source account ID is required'),
  body('toAccountNumber').notEmpty().withMessage('Destination account number is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
];

// Apply rate limiting to transaction routes
router.post('/deposit', transactionLimiter, depositValidation, validate, deposit);
router.post('/mock-deposit', mockDepositValidation, validate, mockDeposit);
router.post('/transfer', transactionLimiter, transferValidation, validate, transfer);
router.get('/history', getTransactionHistory);
router.get('/statement/:accountId', getAccountStatement);

export default router;
