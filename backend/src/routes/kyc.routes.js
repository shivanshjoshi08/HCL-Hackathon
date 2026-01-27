import express from 'express';
import { body } from 'express-validator';
import {
  uploadKycDocument,
  getKycStatus,
  getPendingKyc,
  verifyKyc,
  getAllKycRecords,
} from '../controllers/kyc.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import upload from '../middleware/upload.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Customer routes
router.post('/upload', protect, uploadLimiter, upload.single('document'), uploadKycDocument);
router.get('/status', protect, getKycStatus);

// Admin routes
router.get('/pending', protect, restrictTo('admin'), getPendingKyc);
router.get('/all', protect, restrictTo('admin'), getAllKycRecords);
router.patch(
  '/verify/:userId',
  protect,
  restrictTo('admin'),
  [
    body('status').isIn(['VERIFIED', 'REJECTED']).withMessage('Status must be VERIFIED or REJECTED'),
  ],
  validate,
  verifyKyc
);

export default router;
