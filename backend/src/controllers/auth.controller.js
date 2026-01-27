import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { generateAccountNumber } from '../utils/helpers.js';
import AppError from '../utils/AppError.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, address, dateOfBirth, idType, idNumber } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new AppError('User with this email already exists', 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and account in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user with KYC data
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone: phone || null,
          address: address || null,
          dateOfBirth: dateOfBirth || null,
          idType: idType || null,
          idNumber: idNumber || null,
          kycStatus: 'PENDING', // User must upload document
        },
      });

      // Create default savings account
      const account = await tx.account.create({
        data: {
          accountNumber: generateAccountNumber(),
          accountType: 'SAVINGS',
          userId: user.id,
          balance: 0,
        },
      });

      return { user, account };
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please upload KYC document.',
      data: {
        userId: result.user.id,
        email: result.user.email,
        accountNumber: result.account.accountNumber,
        kycStatus: result.user.kycStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Generate tokens with claims
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          kycStatus: user.kycStatus,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
