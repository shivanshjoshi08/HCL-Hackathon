import express from 'express';
import { body } from 'express-validator';
import { getAccounts, getAccountBalance, createAccount } from '../controllers/account.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Create account validation
const createAccountValidation = [
  body('accountType').isIn(['SAVINGS', 'CURRENT', 'FD']).withMessage('Account type must be SAVINGS, CURRENT, or FD'),
  body('initialDeposit').isFloat({ min: 0 }).withMessage('Initial deposit must be a valid number'),
];

router.get('/', getAccounts);
router.get('/:accountId/balance', getAccountBalance);
router.post('/create', createAccountValidation, validate, createAccount);

export default router;
