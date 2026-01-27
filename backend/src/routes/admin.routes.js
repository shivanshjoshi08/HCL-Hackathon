import express from 'express';
import {
  getAllUsers,
  getAllAccounts,
  getAllTransactions,
  getDashboardStats,
  updateAccountStatus,
  getUserDetails,
} from '../controllers/admin.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected and restricted to admin only
router.use(protect);
router.use(restrictTo('admin'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetails);
router.get('/accounts', getAllAccounts);
router.patch('/accounts/:accountId/status', updateAccountStatus);
router.get('/transactions', getAllTransactions);

export default router;
