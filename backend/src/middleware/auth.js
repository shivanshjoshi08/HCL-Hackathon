import { verifyToken } from '../utils/jwt.js';
import prisma from '../config/database.js';
import AppError from '../utils/AppError.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    // Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Authentication required. Please log in.', 401));
    }

    // Verify token and extract claims
    const decoded = verifyToken(token);

    // Validate token type
    if (decoded.type !== 'access') {
      return next(new AppError('Invalid token type. Please use access token.', 401));
    }

    // Check if user still exists and is valid
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { 
        id: true, 
        email: true, 
        firstName: true, 
        lastName: true, 
        role: true,
        kycStatus: true,
        createdAt: true,
      },
    });

    if (!user) {
      return next(new AppError('User no longer exists. Please log in again.', 401));
    }

    // Verify token claims match user data
    if (user.email !== decoded.email || user.role !== decoded.role) {
      return next(new AppError('Token claims mismatch. Please log in again.', 401));
    }

    // Attach user to request with token claims
    req.user = {
      ...user,
      tokenIssued: new Date(decoded.iat * 1000),
    };
    
    next();
  } catch (error) {
    if (error.message === 'Invalid or expired token') {
      return next(new AppError('Your session has expired. Please log in again.', 401));
    }
    return next(new AppError('Authentication failed. Please log in again.', 401));
  }
};

// Restrict access to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user has required role
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. This action requires ${roles.join(' or ')} role.`,
          403
        )
      );
    }
    
    next();
  };
};

// Verify KYC status (optional middleware)
export const requireKyc = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (req.user.kycStatus !== 'VERIFIED') {
    return next(
      new AppError(
        'KYC verification required. Please complete your KYC to access this feature.',
        403
      )
    );
  }
  
  next();
};

// Check if user owns the resource
export const checkOwnership = (resourceUserIdField = 'userId') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id || req.params.accountId || req.body.accountId;
      
      if (!resourceId) {
        return next(new AppError('Resource ID is required', 400));
      }

      // For admins, skip ownership check
      if (req.user.role === 'admin') {
        return next();
      }

      // Verify ownership based on the resource
      // This is a generic check - can be customized per route
      next();
    } catch (error) {
      next(error);
    }
  };
};
