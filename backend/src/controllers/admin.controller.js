import prisma from '../config/database.js';
import AppError from '../utils/AppError.js';

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'customer', // Only show customers, not admins
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        accounts: {
          select: {
            id: true,
            accountNumber: true,
            accountType: true,
            balance: true,
            status: true,
          },
        },
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

// Get all accounts
export const getAllAccounts = async (req, res, next) => {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        user: {
          role: 'customer', // Only show customer accounts
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
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

// Get all transactions
export const getAllTransactions = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const transactions = await prisma.transaction.findMany({
      include: {
        fromAccount: {
          select: {
            accountNumber: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        toAccount: {
          select: {
            accountNumber: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    const total = await prisma.transaction.count();

    res.status(200).json({
      success: true,
      data: {
        transactions,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res, next) => {
  try {
    // Total users (customers only)
    const totalUsers = await prisma.user.count({
      where: { role: 'customer' },
    });

    // Total accounts (customer accounts only)
    const totalAccounts = await prisma.account.count({
      where: {
        user: {
          role: 'customer',
        },
      },
    });

    // Active accounts (customer accounts only)
    const activeAccounts = await prisma.account.count({
      where: {
        status: 'ACTIVE',
        user: {
          role: 'customer',
        },
      },
    });

    // Total balance across all customer accounts
    const balanceAggregate = await prisma.account.aggregate({
      where: {
        user: {
          role: 'customer',
        },
      },
      _sum: {
        balance: true,
      },
    });

    // Total transactions
    const totalTransactions = await prisma.transaction.count();

    // Today's transactions
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTransactions = await prisma.transaction.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    // Total transaction volume today
    const todayVolume = await prisma.transaction.aggregate({
      where: {
        createdAt: {
          gte: today,
        },
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });

    // Recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      take: 10,
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

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalAccounts,
        activeAccounts,
        totalBalance: balanceAggregate._sum.balance?.toString() || '0',
        totalTransactions,
        todayTransactions,
        todayVolume: todayVolume._sum.amount?.toString() || '0',
        recentTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Freeze/Unfreeze account
export const updateAccountStatus = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'FROZEN', 'CLOSED'].includes(status)) {
      return next(new AppError('Invalid status. Must be ACTIVE, FROZEN, or CLOSED', 400));
    }

    const account = await prisma.account.update({
      where: { id: accountId },
      data: { status },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: `Account ${status.toLowerCase()} successfully`,
      data: {
        account,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user details with all accounts and transactions
export const getUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        accounts: {
          include: {
            transactionsFrom: {
              take: 10,
              orderBy: {
                createdAt: 'desc',
              },
            },
            transactionsTo: {
              take: 10,
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
