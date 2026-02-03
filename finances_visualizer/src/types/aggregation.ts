/**
 * Data aggregation types for financial summaries
 */

/**
 * Overall financial summary
 */
export interface Summary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

/**
 * Per-category summary for expense breakdown
 */
export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number; // of total expenses (0-100)
  transactionCount: number;
}

/**
 * Monthly summary for trend analysis
 */
export interface MonthlySummary {
  month: string; // "2024-01" format (YYYY-MM)
  income: number;
  expense: number;
  balance: number;
  transactionCount: number;
}

/**
 * Date range filter options
 */
export interface DateRangeFilter {
  start?: Date;
  end?: Date;
}
