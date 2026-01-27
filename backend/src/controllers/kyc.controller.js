import prisma from '../config/database.js';
import cloudinary from '../config/cloudinary.js';
import AppError from '../utils/AppError.js';

// Upload KYC document
export const uploadKycDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload a document', 400));
    }

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'kyc_documents',
          resource_type: 'auto',
          public_id: `${req.user.id}_${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const result = await uploadPromise;

    // Update user with document URL and AUTO-VERIFY for demo
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        documentUrl: result.secure_url,
        kycStatus: 'VERIFIED', // Auto-verify for hackathon demo
        kycRejectionReason: null,
      },
    });

    res.status(200).json({
      success: true,
      message: 'KYC verified successfully!',
      data: {
        documentUrl: result.secure_url,
        kycStatus: user.kycStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get KYC status
export const getKycStatus = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        kycStatus: true,
        documentUrl: true,
        kycRejectionReason: true,
        idType: true,
        idNumber: true,
      },
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all pending KYC verifications
export const getPendingKyc = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'customer',
        kycStatus: 'PENDING',
        documentUrl: { not: null },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        dateOfBirth: true,
        idType: true,
        idNumber: true,
        documentUrl: true,
        kycStatus: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.status(200).json({
      success: true,
      data: {
        users,
        total: users.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Verify KYC (Approve/Reject)
export const verifyKyc = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status, rejectionReason } = req.body;

    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      return next(new AppError('Invalid status. Must be VERIFIED or REJECTED', 400));
    }

    if (status === 'REJECTED' && !rejectionReason) {
      return next(new AppError('Rejection reason is required', 400));
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: status,
        kycRejectionReason: status === 'REJECTED' ? rejectionReason : null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        kycStatus: true,
        kycRejectionReason: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `KYC ${status.toLowerCase()} successfully`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all KYC records
export const getAllKycRecords = async (req, res, next) => {
  try {
    const { status } = req.query;

    const where = { role: 'customer' };
    if (status) {
      where.kycStatus = status;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        idType: true,
        idNumber: true,
        documentUrl: true,
        kycStatus: true,
        kycRejectionReason: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: {
        users,
        total: users.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
