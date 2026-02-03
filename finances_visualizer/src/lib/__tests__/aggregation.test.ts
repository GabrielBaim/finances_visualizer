import { describe, it, expect } from 'vitest';
import {
  calculateSummary,
  filterByDateRange,
  groupByCategory,
  groupByMonth,
  formatPercentage,
  calculateSummaryWithFilter,
  getTopCategories,
} from '../aggregation';
import type { Transaction } from '@/types/transaction';
import type { DateRangeFilter } from '@/types/aggregation';

// Helper to create test transactions
function createTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: `test-${Date.now()}-${Math.random()}`,
    date: new Date('2024-01-15'),
    description: 'Test Transaction',
    amount: 100,
    type: 'expense',
    source: 'nubank',
    category: 'Outros',
    ...overrides,
  };
}

describe('calculateSummary', () => {
  it('should handle empty array', () => {
    const result = calculateSummary([]);

    expect(result.totalIncome).toBe(0);
    expect(result.totalExpense).toBe(0);
    expect(result.netBalance).toBe(0);
    expect(result.transactionCount).toBe(0);
    expect(result.dateRange.start).toBeNull();
    expect(result.dateRange.end).toBeNull();
  });

  it('should calculate income and expense totals', () => {
    const transactions: Transaction[] = [
      createTransaction({ type: 'income', amount: 1000 }),
      createTransaction({ type: 'income', amount: 500 }),
      createTransaction({ type: 'expense', amount: 200 }),
      createTransaction({ type: 'expense', amount: 300 }),
    ];

    const result = calculateSummary(transactions);

    expect(result.totalIncome).toBe(1500);
    expect(result.totalExpense).toBe(500);
    expect(result.netBalance).toBe(1000);
    expect(result.transactionCount).toBe(4);
  });

  it('should find date range', () => {
    const transactions: Transaction[] = [
      createTransaction({ date: new Date('2024-01-01') }),
      createTransaction({ date: new Date('2024-01-15') }),
      createTransaction({ date: new Date('2024-01-31') }),
    ];

    const result = calculateSummary(transactions);

    expect(result.dateRange.start).toEqual(new Date('2024-01-01'));
    expect(result.dateRange.end).toEqual(new Date('2024-01-31'));
  });

  it('should handle single transaction', () => {
    const transactions = [createTransaction({ type: 'income', amount: 100 })];

    const result = calculateSummary(transactions);

    expect(result.totalIncome).toBe(100);
    expect(result.totalExpense).toBe(0);
    expect(result.netBalance).toBe(100);
    expect(result.transactionCount).toBe(1);
  });
});

describe('filterByDateRange', () => {
  const baseTransactions: Transaction[] = [
    createTransaction({ date: new Date('2024-01-10') }),
    createTransaction({ date: new Date('2024-01-20') }),
    createTransaction({ date: new Date('2024-02-05') }),
    createTransaction({ date: new Date('2024-02-15') }),
  ];

  it('should return all when no filter provided', () => {
    const result = filterByDateRange(baseTransactions, {});

    expect(result).toHaveLength(4);
  });

  it('should filter by start date', () => {
    const result = filterByDateRange(baseTransactions, {
      start: new Date('2024-01-15'),
    });

    expect(result).toHaveLength(3);
    expect(result[0].date).toEqual(new Date('2024-01-20'));
  });

  it('should filter by end date', () => {
    const result = filterByDateRange(baseTransactions, {
      end: new Date('2024-01-31'),
    });

    expect(result).toHaveLength(2);
    expect(result[1].date).toEqual(new Date('2024-01-20'));
  });

  it('should filter by both start and end date', () => {
    const result = filterByDateRange(baseTransactions, {
      start: new Date('2024-01-15'),
      end: new Date('2024-02-10'),
    });

    expect(result).toHaveLength(2);
  });

  it('should return empty when no matches', () => {
    const result = filterByDateRange(baseTransactions, {
      start: new Date('2024-03-01'),
    });

    expect(result).toHaveLength(0);
  });
});

describe('groupByCategory', () => {
  it('should handle empty array', () => {
    const result = groupByCategory([]);

    expect(result).toEqual([]);
  });

  it('should group expenses by category', () => {
    const transactions: Transaction[] = [
      createTransaction({ type: 'expense', amount: 100, category: 'Alimentação' }),
      createTransaction({ type: 'expense', amount: 50, category: 'Alimentação' }),
      createTransaction({ type: 'expense', amount: 200, category: 'Transporte' }),
      createTransaction({ type: 'expense', amount: 75, category: 'Moradia' }),
      // Income should be ignored
      createTransaction({ type: 'income', amount: 1000, category: 'Salário' }),
    ];

    const result = groupByCategory(transactions);

    expect(result).toHaveLength(3);
    expect(result[0].category).toBe('Transporte'); // Sorted by amount descending
    expect(result[0].amount).toBe(200);
    expect(result[0].transactionCount).toBe(1);
  });

  it('should calculate percentages correctly', () => {
    const transactions: Transaction[] = [
      createTransaction({ type: 'expense', amount: 100, category: 'A' }),
      createTransaction({ type: 'expense', amount: 100, category: 'B' }),
      createTransaction({ type: 'expense', amount: 100, category: 'C' }),
    ];

    const result = groupByCategory(transactions);

    expect(result[0].percentage).toBeCloseTo(33.33, 1);
    expect(result[1].percentage).toBeCloseTo(33.33, 1);
    expect(result[2].percentage).toBeCloseTo(33.33, 1);
  });

  it('should handle transactions without category', () => {
    const transactions: Transaction[] = [
      createTransaction({ type: 'expense', amount: 100, category: 'Alimentação' }),
      createTransaction({ type: 'expense', amount: 50 }),
    ];

    const result = groupByCategory(transactions);

    expect(result).toHaveLength(2);
    expect(result[0].category).toBe('Alimentação');
    expect(result[1].category).toBe('Outros');
  });
});

describe('groupByMonth', () => {
  it('should handle empty array', () => {
    const result = groupByMonth([]);

    expect(result).toEqual([]);
  });

  it('should group by month', () => {
    const transactions: Transaction[] = [
      createTransaction({ date: new Date('2024-01-15'), type: 'income', amount: 1000 }),
      createTransaction({ date: new Date('2024-01-20'), type: 'expense', amount: 200 }),
      createTransaction({ date: new Date('2024-02-10'), type: 'income', amount: 1500 }),
      createTransaction({ date: new Date('2024-02-15'), type: 'expense', amount: 300 }),
    ];

    const result = groupByMonth(transactions);

    expect(result).toHaveLength(2);
    expect(result[0].month).toBe('2024-01');
    expect(result[0].income).toBe(1000);
    expect(result[0].expense).toBe(200);
    expect(result[0].balance).toBe(800);
    expect(result[1].month).toBe('2024-02');
    expect(result[1].balance).toBe(1200);
  });

  it('should sort chronologically', () => {
    const transactions: Transaction[] = [
      createTransaction({ date: new Date('2024-03-15T00:00:00') }),
      createTransaction({ date: new Date('2024-01-15T00:00:00') }),
      createTransaction({ date: new Date('2024-02-15T00:00:00') }),
    ];

    const result = groupByMonth(transactions);

    expect(result[0].month).toBe('2024-01');
    expect(result[1].month).toBe('2024-02');
    expect(result[2].month).toBe('2024-03');
  });
});

describe('formatPercentage', () => {
  it('should format percentage', () => {
    expect(formatPercentage(50.123)).toBe('50.1%');
    expect(formatPercentage(100)).toBe('100.0%');
    expect(formatPercentage(0)).toBe('0.0%');
  });

  it('should respect decimals parameter', () => {
    expect(formatPercentage(50.123, 0)).toBe('50%');
    expect(formatPercentage(50.123, 2)).toBe('50.12%');
  });
});

describe('calculateSummaryWithFilter', () => {
  it('should apply date filter before calculating', () => {
    const transactions: Transaction[] = [
      createTransaction({ date: new Date('2024-01-15'), type: 'income', amount: 1000 }),
      createTransaction({ date: new Date('2024-02-15'), type: 'income', amount: 500 }),
    ];

    const filter: DateRangeFilter = {
      start: new Date('2024-02-01'),
    };

    const result = calculateSummaryWithFilter(transactions, filter);

    expect(result.totalIncome).toBe(500);
    expect(result.transactionCount).toBe(1);
  });

  it('should calculate all when no filter', () => {
    const transactions = [createTransaction({ type: 'income', amount: 100 })];

    const result = calculateSummaryWithFilter(transactions);

    expect(result.totalIncome).toBe(100);
  });
});

describe('getTopCategories', () => {
  it('should return top N categories', () => {
    const transactions: Transaction[] = [
      createTransaction({ type: 'expense', amount: 100, category: 'A' }),
      createTransaction({ type: 'expense', amount: 200, category: 'B' }),
      createTransaction({ type: 'expense', amount: 300, category: 'C' }),
      createTransaction({ type: 'expense', amount: 50, category: 'D' }),
    ];

    const result = getTopCategories(transactions, 2);

    expect(result).toHaveLength(2);
    expect(result[0].category).toBe('C');
    expect(result[1].category).toBe('B');
  });

  it('should default to 5 categories', () => {
    const transactions: Transaction[] = Array.from({ length: 10 }, (_, i) =>
      createTransaction({ type: 'expense', amount: i * 10, category: `Cat${i}` })
    );

    const result = getTopCategories(transactions);

    expect(result).toHaveLength(5);
  });
});
