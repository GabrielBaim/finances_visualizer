/**
 * Transaction categories for the Visualizador de Finanças app
 * Brazilian Portuguese category names
 */

/**
 * All available transaction categories
 */
export type Category =
  | 'Alimentação'      // Food, restaurants, delivery, groceries
  | 'Transporte'       // Uber, gas, parking, public transit
  | 'Moradia'          // Rent, utilities, home expenses
  | 'Lazer'            // Entertainment, hobbies, streaming
  | 'Saúde'            // Medical, pharmacy, insurance
  | 'Educação'         // Courses, books, school supplies
  | 'Compras'          // Retail shopping, online purchases
  | 'Serviços'         // Subscriptions, services, fees
  | 'Transferências'   // Transfers between accounts
  | 'Outros';          // Fallback for unmatched

/**
 * Categorization result interface
 */
export interface CategorizationResult {
  category: Category;
  confidence: number;        // 0-100
  matchedKeyword?: string;   // The keyword that matched
  matchType?: 'exact' | 'partial' | 'none';
}

/**
 * All category values as array (useful for UI selects, etc.)
 */
export const ALL_CATEGORIES: Category[] = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Compras',
  'Serviços',
  'Transferências',
  'Outros',
];
