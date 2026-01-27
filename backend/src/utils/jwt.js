import jwt from 'jsonwebtoken';

// Generate access token with claims
export const generateToken = (user) => {
  const payload = {
    sub: user.id,           // Subject (user ID)
    email: user.email,      // User email
    role: user.role,        // User role (customer/admin)
    type: 'access',         // Token type
    iat: Math.floor(Date.now() / 1000),  // Issued at
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    issuer: 'SmartBank',
    audience: 'SmartBank-Users',
  });
};

// Generate refresh token
export const generateRefreshToken = (userId) => {
  const payload = {
    sub: userId,
    type: 'refresh',
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: 'SmartBank',
    audience: 'SmartBank-Users',
  });
};

// Verify token with proper validation
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'SmartBank',
      audience: 'SmartBank-Users',
    });
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Decode token without verification (for debugging)
export const decodeToken = (token) => {
  return jwt.decode(token, { complete: true });
};
