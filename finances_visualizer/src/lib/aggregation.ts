/**
 * Data Aggregation and Summary Functions
 * Calculates summaries, groups by category and month
 */

import type { Transaction } from '@/types/transaction';
import type { Summary, CategorySummary, MonthlySummary, DateRangeFilter } from '@/types/aggregation';

/**
 * Calculate overall financial summary from transactions
 */
export function calculateSummary(transactions: Transaction[]): Summary {
  // Handle empty array
  if (transactions.length === 0) {
    return {
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
      transactionCount: 0,
      dateRange: { start: null, end: null },
    };
  }

  // Calculate totals
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((t) => {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
    }
  });

  // Find date range
  const dates = transactions.map((t) => t.date.getTime());
  const start = new Date(Math.min(...dates));
  const end = new Date(Math.max(...dates));

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    transactionCount: transactions.length,
    dateRange: { start, end },
  };
}

/**
 * Filter transactions by date range
 */
export function filterByDateRange(
  transactions: Transaction[],
  filter: DateRangeFilter
): Transaction[] {
  const { start, end } = filter;

  // If no filters, return all
  if (!start && !end) {
    return transactions;
  }

  return transactions.filter((t) => {
    const date = t.date.getTime();

    // Check start date
    if (start && date < start.getTime()) {
      return false;
    }

    // Check end date
    if (end && date > end.getTime()) {
      return false;
    }

    return true;
  });
}

/**
 * Group transactions by category (expenses only)
 */
export function groupByCategory(transactions: Transaction[]): CategorySummary[] {
  // Filter for expenses only
  const expenses = transactions.filter((t) => t.type === 'expense');

  // Handle empty case
  if (expenses.length === 0) {
    return [];
  }

  // Group by category
  const categoryMap = new Map<string, { amount: number; count: number }>();

  expenses.forEach((t) => {
    const category = t.category || 'Outros';
    const current = categoryMap.get(category) || { amount: 0, count: 0 };
    current.amount += t.amount;
    current.count++;
    categoryMap.set(category, current);
  });

  // Calculate total expense for percentages
  const totalExpense = Array.from(categoryMap.values()).reduce(
    (sum, data) => sum + data.amount,
    0
  );

  // Convert to array and sort by amount (descending)
  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      amount: data.amount,
      percentage: totalExpense > 0 ? (data.amount / totalExpense) * 100 : 0,
      transactionCount: data.count,
    }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Format date as YYYY-MM string for monthly grouping
 */
function formatMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Group transactions by month
 */
export function groupByMonth(transactions: Transaction[]): MonthlySummary[] {
  // Handle empty case
  if (transactions.length === 0) {
    return [];
  }

  // Group by month key
  const monthMap = new Map<string, { income: number; expense: number; count: number }>();

  transactions.forEach((t) => {
    const month = formatMonthKey(t.date);
    const current = monthMap.get(month) || { income: 0, expense: 0, count: 0 };

    if (t.type === 'income') {
      current.income += t.amount;
    } else {
      current.expense += t.amount;
    }
    current.count++;

    monthMap.set(month, current);
  });

  // Convert to array and sort chronologically
  return Array.from(monthMap.entries())
    .map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
      balance: data.income - data.expense,
      transactionCount: data.count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Format percentage for display
 * Note: formatCurrency is imported from utils.ts
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return value.toFixed(decimals) + '%';
}

/**
 * Calculate summary with optional date filter
 */
export function calculateSummaryWithFilter(
  transactions: Transaction[],
  filter?: DateRangeFilter
): Summary {
  const filtered = filter ? filterByDateRange(transactions, filter) : transactions;
  return calculateSummary(filtered);
}

/**
 * Get top N categories by expense amount
 */
export function getTopCategories(
  transactions: Transaction[],
  limit: number = 5
): CategorySummary[] {
  const categories = groupByCategory(transactions);
  return categories.slice(0, limit);
}
