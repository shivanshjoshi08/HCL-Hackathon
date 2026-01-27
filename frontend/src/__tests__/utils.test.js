import { describe, it, expect } from 'vitest';
import { cn } from '../lib/utils';

describe('Utility Functions', () => {
  describe('cn (className merger)', () => {
    it('merges class names', () => {
      const result = cn('class1', 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      const result = cn('base', isActive && 'active');
      expect(result).toContain('active');
    });

    it('filters out falsy values', () => {
      const result = cn('base', false, null, undefined, 'valid');
      expect(result).not.toContain('false');
      expect(result).not.toContain('null');
      expect(result).toContain('valid');
    });

    it('handles empty input', () => {
      const result = cn();
      expect(typeof result).toBe('string');
    });
  });
});

describe('Currency Formatting', () => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  it('formats positive amounts', () => {
    expect(formatCurrency(1000)).toContain('1,000');
  });

  it('formats large amounts with proper grouping', () => {
    const result = formatCurrency(1000000);
    expect(result).toContain('10,00,000');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toContain('0');
  });
});

describe('Date Formatting', () => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  it('formats date correctly', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('2024');
    expect(result).toContain('Jan');
  });

  it('handles Date objects', () => {
    const result = formatDate(new Date(2024, 0, 15));
    expect(result).toContain('15');
  });
});

describe('Account Number Validation', () => {
  const isValidAccountNumber = (num) => /^\d{10}$/.test(num);

  it('validates 10-digit account numbers', () => {
    expect(isValidAccountNumber('1234567890')).toBe(true);
  });

  it('rejects short account numbers', () => {
    expect(isValidAccountNumber('12345')).toBe(false);
  });

  it('rejects account numbers with letters', () => {
    expect(isValidAccountNumber('123456789a')).toBe(false);
  });

  it('rejects account numbers with special characters', () => {
    expect(isValidAccountNumber('123-456-78')).toBe(false);
  });
});

describe('Amount Validation', () => {
  const isValidAmount = (amount) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= 10000000;
  };

  it('validates positive amounts', () => {
    expect(isValidAmount(100)).toBe(true);
    expect(isValidAmount(50000)).toBe(true);
  });

  it('rejects zero', () => {
    expect(isValidAmount(0)).toBe(false);
  });

  it('rejects negative amounts', () => {
    expect(isValidAmount(-100)).toBe(false);
  });

  it('rejects amounts exceeding limit', () => {
    expect(isValidAmount(100000000)).toBe(false);
  });

  it('rejects non-numeric values', () => {
    expect(isValidAmount('abc')).toBe(false);
  });
});

describe('Balance Calculations', () => {
  it('calculates total balance from multiple accounts', () => {
    const accounts = [
      { balance: 5000 },
      { balance: 3000 },
      { balance: 2000 },
    ];
    
    const total = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
    expect(total).toBe(10000);
  });

  it('handles empty accounts array', () => {
    const accounts = [];
    const total = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
    expect(total).toBe(0);
  });

  it('handles string balances', () => {
    const accounts = [
      { balance: '5000.50' },
      { balance: '3000.25' },
    ];
    
    const total = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
    expect(total).toBe(8000.75);
  });
});
