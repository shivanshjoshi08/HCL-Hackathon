import prisma from '../config/database.js';
import AppError from '../utils/AppError.js';
import { generateAccountNumber } from '../utils/helpers.js';

// Get all accounts for logged-in user
export const getAccounts = async (req, res, next) => {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: {
        accounts,
        total: accounts.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get account balance
export const getAccountBalance = async (req, res, next) => {
  try {
    const { accountId } = req.params;

    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: req.user.id,
      },
      select: {
        id: true,
        accountNumber: true,
        accountType: true,
        balance: true,
        status: true,
      },
    });

    if (!account) {
      return next(new AppError('Account not found or does not belong to you', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        account: {
          ...account,
          balance: account.balance.toString(),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create new account
export const createAccount = async (req, res, next) => {
  try {
    const { accountType, initialDeposit } = req.body;

    // Validate account type
    const validTypes = ['SAVINGS', 'CURRENT', 'FD'];
    if (!validTypes.includes(accountType)) {
      return next(new AppError('Invalid account type. Must be SAVINGS, CURRENT, or FD', 400));
    }

    // Check if user already has an account of this type
    const existingAccount = await prisma.account.findFirst({
      where: {
        userId: req.user.id,
        accountType: accountType,
      },
    });

    if (existingAccount) {
      return next(new AppError(`You already have a ${accountType} account. Only one account per type is allowed.`, 400));
    }

    // Validate initial deposit based on account type
    const minDepositMap = {
      'CURRENT': 0,
      'SAVINGS': 500,
      'FD': 1000
    };
    const minDeposit = minDepositMap[accountType];
    
    if (initialDeposit < minDeposit) {
      return next(new AppError(`Minimum deposit for ${accountType} account is ₹${minDeposit}`, 400));
    }

    // Create account
    const account = await prisma.account.create({
      data: {
        accountNumber: generateAccountNumber(),
        accountType,
        balance: initialDeposit,
        userId: req.user.id,
      },
    });

    // Log initial deposit transaction
    await prisma.transaction.create({
      data: {
        toAccountId: account.id,
        transactionType: 'DEPOSIT',
        amount: initialDeposit,
        balanceAfter: initialDeposit,
        description: `Initial deposit for ${accountType} account`,
        status: 'COMPLETED',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        account: {
          id: account.id,
          accountNumber: account.accountNumber,
          accountType: account.accountType,
          balance: account.balance.toString(),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
