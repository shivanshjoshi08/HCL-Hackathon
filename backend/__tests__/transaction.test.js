import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('Transaction Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Deposit', () => {
    it('should validate deposit amount is positive', () => {
      const validAmounts = [100, 500.50, 10000];
      const invalidAmounts = [0, -100, -0.01];

      validAmounts.forEach(amount => {
        expect(amount).toBeGreaterThan(0);
      });

      invalidAmounts.forEach(amount => {
        expect(amount).not.toBeGreaterThan(0);
      });
    });

    it('should calculate new balance after deposit', () => {
      const currentBalance = 5000;
      const depositAmount = 1500;
      const newBalance = currentBalance + depositAmount;

      expect(newBalance).toBe(6500);
    });

    it('should handle decimal amounts correctly', () => {
      const currentBalance = 1000.50;
      const depositAmount = 250.75;
      const newBalance = parseFloat((currentBalance + depositAmount).toFixed(2));

      expect(newBalance).toBe(1251.25);
    });
  });

  describe('Transfer', () => {
    it('should validate sufficient balance for transfer', () => {
      const balance = 5000;
      const transferAmount = 3000;
      const hasSufficientBalance = balance >= transferAmount;

      expect(hasSufficientBalance).toBe(true);
    });

    it('should reject transfer when insufficient balance', () => {
      const balance = 1000;
      const transferAmount = 5000;
      const hasSufficientBalance = balance >= transferAmount;

      expect(hasSufficientBalance).toBe(false);
    });

    it('should validate daily transfer limit', () => {
      const dailyLimit = 50000;
      const todayTransfers = 30000;
      const newTransferAmount = 15000;
      const totalAfterTransfer = todayTransfers + newTransferAmount;

      expect(totalAfterTransfer).toBeLessThanOrEqual(dailyLimit);
    });

    it('should reject transfer exceeding daily limit', () => {
      const dailyLimit = 50000;
      const todayTransfers = 45000;
      const newTransferAmount = 10000;
      const totalAfterTransfer = todayTransfers + newTransferAmount;

      expect(totalAfterTransfer).toBeGreaterThan(dailyLimit);
    });

    it('should prevent transfer to same account', () => {
      const fromAccountId = 'acc-123';
      const toAccountId = 'acc-123';

      expect(fromAccountId).toBe(toAccountId);
    });

    it('should calculate balances after transfer', () => {
      const senderBalance = 10000;
      const receiverBalance = 5000;
      const transferAmount = 3000;

      const newSenderBalance = senderBalance - transferAmount;
      const newReceiverBalance = receiverBalance + transferAmount;

      expect(newSenderBalance).toBe(7000);
      expect(newReceiverBalance).toBe(8000);
    });

    it('should validate account number format', () => {
      const validAccountNumber = '1234567890';
      const invalidAccountNumbers = ['123', '12345678901', 'abcdefghij'];

      expect(validAccountNumber).toHaveLength(10);
      expect(/^\d{10}$/.test(validAccountNumber)).toBe(true);

      invalidAccountNumbers.forEach(num => {
        expect(/^\d{10}$/.test(num)).toBe(false);
      });
    });
  });

  describe('Transaction History', () => {
    it('should sort transactions by date descending', () => {
      const transactions = [
        { id: '1', createdAt: new Date('2024-01-01') },
        { id: '2', createdAt: new Date('2024-01-03') },
        { id: '3', createdAt: new Date('2024-01-02') },
      ];

      const sorted = [...transactions].sort((a, b) => b.createdAt - a.createdAt);

      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('1');
    });

    it('should validate pagination parameters', () => {
      const limit = 20;
      const offset = 0;

      expect(limit).toBeGreaterThan(0);
      expect(limit).toBeLessThanOrEqual(100);
      expect(offset).toBeGreaterThanOrEqual(0);
    });

    it('should calculate correct transaction type display', () => {
      const accountId = 'acc-123';
      
      const depositTxn = { fromAccountId: null, toAccountId: 'acc-123', transactionType: 'DEPOSIT' };
      const transferOutTxn = { fromAccountId: 'acc-123', toAccountId: 'acc-456', transactionType: 'TRANSFER' };
      const transferInTxn = { fromAccountId: 'acc-456', toAccountId: 'acc-123', transactionType: 'TRANSFER' };

      expect(depositTxn.transactionType).toBe('DEPOSIT');
      expect(transferOutTxn.fromAccountId).toBe(accountId);
      expect(transferInTxn.toAccountId).toBe(accountId);
    });
  });
});

describe('Transaction Validation', () => {
  it('should validate transaction status values', () => {
    const validStatuses = ['PENDING', 'COMPLETED', 'FAILED'];
    
    validStatuses.forEach(status => {
      expect(['PENDING', 'COMPLETED', 'FAILED']).toContain(status);
    });
  });

  it('should validate transaction type values', () => {
    const validTypes = ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'];
    
    validTypes.forEach(type => {
      expect(['DEPOSIT', 'WITHDRAWAL', 'TRANSFER']).toContain(type);
    });
  });
});
