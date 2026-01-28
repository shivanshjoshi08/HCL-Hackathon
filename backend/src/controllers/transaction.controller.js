import prisma from '../config/database.js';
import AppError from '../utils/AppError.js';
import { Prisma } from '@prisma/client';

// Mock deposit for testing (adds money instantly)
export const mockDeposit = async (req, res, next) => {
  try {
    const { accountId, amount } = req.body;

    // Default amount if not provided
    const depositAmount = amount || 1000;

    // Validate amount
    if (depositAmount <= 0 || depositAmount > 100000) {
      return next(new AppError('Amount must be between ₹1 and ₹100,000', 400));
    }

    // Check if account belongs to user
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: req.user.id,
      },
    });

    if (!account) {
      return next(new AppError('Account not found or does not belong to you', 404));
    }

    if (account.status !== 'ACTIVE') {
      return next(new AppError('Account is not active', 400));
    }

    // Perform mock deposit
    const result = await prisma.$transaction(async (tx) => {
      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: depositAmount,
          },
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          toAccountId: accountId,
          transactionType: 'DEPOSIT',
          amount: depositAmount,
          balanceAfter: updatedAccount.balance,
          description: '💰 Mock deposit for testing',
          status: 'COMPLETED',
        },
      });

      return { account: updatedAccount, transaction };
    });

    res.status(200).json({
      success: true,
      message: `Mock deposit of ₹${depositAmount} completed successfully`,
      data: {
        transaction: {
          id: result.transaction.id,
          amount: result.transaction.amount.toString(),
          balanceAfter: result.transaction.balanceAfter.toString(),
        },
        newBalance: result.account.balance.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deposit = async (req, res, next) => {
  try {
    const { accountId, amount, description } = req.body;

    // Validate amount
    if (amount <= 0) {
      return next(new AppError('Amount must be greater than zero', 400));
    }

    // Check if account belongs to user
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: req.user.id,
      },
    });

    if (!account) {
      return next(new AppError('Account not found or does not belong to you', 404));
    }

    if (account.status !== 'ACTIVE') {
      return next(new AppError('Account is not active', 400));
    }

    // Perform deposit in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update account balance
      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          toAccountId: accountId,
          transactionType: 'DEPOSIT',
          amount: amount,
          balanceAfter: updatedAccount.balance,
          description: description || 'Cash deposit',
          status: 'COMPLETED',
        },
      });

      return { updatedAccount, transaction };
    });

    res.status(200).json({
      success: true,
      message: 'Deposit successful',
      data: {
        transactionId: result.transaction.id,
        newBalance: result.updatedAccount.balance.toString(),
        transaction: {
          type: 'DEPOSIT',
          amount: result.transaction.amount.toString(),
          timestamp: result.transaction.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const transfer = async (req, res, next) => {
  try {
    const { fromAccountId, toAccountNumber, amount, description } = req.body;

    // Validate amount
    if (amount <= 0) {
      return next(new AppError('Amount must be greater than 0', 400));
    }

    // Get from account
    const fromAccount = await prisma.account.findFirst({
      where: {
        id: fromAccountId,
        userId: req.user.id,
      },
    });

    if (!fromAccount) {
      return next(new AppError('Source account not found or does not belong to you', 404));
    }

    if (fromAccount.status !== 'ACTIVE') {
      return next(new AppError('Source account is not active', 400));
    }

    // Check sufficient balance
    if (parseFloat(fromAccount.balance) < amount) {
      return next(new AppError('your balance is not sufficient', 400));
    }

    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyTransactions = await prisma.transaction.aggregate({
      where: {
        fromAccountId: fromAccountId,
        transactionType: 'TRANSFER',
        createdAt: {
          gte: today,
        },
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });

    const dailyTotal = parseFloat(dailyTransactions._sum.amount || 0);
    if (dailyTotal + amount > parseFloat(fromAccount.dailyLimit)) {
      return next(new AppError('Daily transfer limit exceeded', 400));
    }

    // Find destination account
    const toAccount = await prisma.account.findUnique({
      where: { accountNumber: toAccountNumber },
    });

    if (!toAccount) {
      return next(new AppError('Destination account not found', 404));
    }

    if (toAccount.status !== 'ACTIVE') {
      return next(new AppError('Destination account is not active', 400));
    }

    if (fromAccount.id === toAccount.id) {
      return next(new AppError('Cannot transfer to the same account', 400));
    }

    // Perform transfer in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Debit from source account
      const updatedFromAccount = await tx.account.update({
        where: { id: fromAccountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Credit to destination account
      const updatedToAccount = await tx.account.update({
        where: { id: toAccount.id },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          fromAccountId: fromAccountId,
          toAccountId: toAccount.id,
          transactionType: 'TRANSFER',
          amount: amount,
          balanceAfter: updatedFromAccount.balance,
          description: description || `Transfer to ${toAccountNumber}`,
          status: 'COMPLETED',
        },
      });

      return { updatedFromAccount, updatedToAccount, transaction };
    });

    res.status(200).json({
      success: true,
      message: 'Transfer successful',
      data: {
        transactionId: result.transaction.id,
        newBalance: result.updatedFromAccount.balance.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionHistory = async (req, res, next) => {
  try {
    const { accountId, limit = 20, offset = 0 } = req.query;

    if (!accountId) {
      return next(new AppError('Account ID is required', 400));
    }

    // Check if account belongs to user
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: req.user.id,
      },
    });

    if (!account) {
      return next(new AppError('Account not found or does not belong to you', 404));
    }

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { fromAccountId: accountId },
          { toAccountId: accountId },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      include: {
        fromAccount: {
          select: {
            accountNumber: true,
          },
        },
        toAccount: {
          select: {
            accountNumber: true,
          },
        },
      },
    });

    // Count total transactions
    const total = await prisma.transaction.count({
      where: {
        OR: [
          { fromAccountId: accountId },
          { toAccountId: accountId },
        ],
      },
    });

    // Format transactions
    const formattedTransactions = transactions.map((txn) => {
      const isDebit = txn.fromAccountId === accountId;
      return {
        id: txn.id,
        type: txn.transactionType,
        amount: isDebit ? `-${txn.amount.toString()}` : `${txn.amount.toString()}`,
        balanceAfter: txn.balanceAfter.toString(),
        description: txn.description,
        status: txn.status,
        createdAt: txn.createdAt,
        otherParty: isDebit
          ? `Account ${txn.toAccount?.accountNumber || 'N/A'}`
          : `Account ${txn.fromAccount?.accountNumber || 'N/A'}`,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        transactions: formattedTransactions,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get account statement (detailed view)
export const getAccountStatement = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const { startDate, endDate } = req.query;

    // Check if account belongs to user
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: req.user.id,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            address: true,
          },
        },
      },
    });

    if (!account) {
      return next(new AppError('Account not found or does not belong to you', 404));
    }

    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { fromAccountId: accountId },
          { toAccountId: accountId },
        ],
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        fromAccount: {
          select: {
            accountNumber: true,
          },
        },
        toAccount: {
          select: {
            accountNumber: true,
          },
        },
      },
    });

    // Calculate totals
    const totalDeposits = transactions
      .filter((t) => t.toAccountId === accountId)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalWithdrawals = transactions
      .filter((t) => t.fromAccountId === accountId)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Format statement
    const statement = {
      accountInfo: {
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        accountHolder: `${account.user.firstName} ${account.user.lastName}`,
        email: account.user.email,
        phone: account.user.phone,
        address: account.user.address,
        currentBalance: account.balance.toString(),
        status: account.status,
      },
      period: {
        from: startDate || transactions[transactions.length - 1]?.createdAt,
        to: endDate || new Date(),
      },
      summary: {
        openingBalance: parseFloat(account.balance) - totalDeposits + totalWithdrawals,
        totalDeposits: totalDeposits.toFixed(2),
        totalWithdrawals: totalWithdrawals.toFixed(2),
        closingBalance: account.balance.toString(),
        transactionCount: transactions.length,
      },
      transactions: transactions.map((txn) => {
        const isDebit = txn.fromAccountId === accountId;
        return {
          date: txn.createdAt,
          description: txn.description,
          type: txn.transactionType,
          debit: isDebit ? txn.amount.toString() : '0.00',
          credit: !isDebit ? txn.amount.toString() : '0.00',
          balance: txn.balanceAfter.toString(),
          reference: txn.id,
        };
      }),
    };

    res.status(200).json({
      success: true,
      data: statement,
    });
  } catch (error) {
    next(error);
  }
};
