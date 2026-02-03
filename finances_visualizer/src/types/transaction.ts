/**
 * Transaction type for the Visualizador de Finanças app
 */

export type TransactionType = 'income' | 'expense';
export type BankSource = 'nubank' | 'inter';

/**
 * Raw CSV row interface for parsed data before validation
 */
export interface CSVRow {
  [key: string]: string | undefined;
}

/**
 * Normalized transaction interface
 */
export interface Transaction {
  id: string;                      // Generated unique ID
  date: Date;                      // Transaction date
  description: string;             // Transaction description
  amount: number;                  // Transaction amount (always positive)
  type: TransactionType;           // Transaction type
  category?: string;               // Will be added by categorization engine
  source: BankSource;              // Bank source
}

/**
 * File upload result
 */
export interface FileUploadResult {
  transactions: Transaction[];
  errors: string[];
  skippedRows: number;
  totalRows: number;
}

/**
 * Nubank CSV columns
 */
export interface NubankCSVRow {
  data: string;       // Date in YYYY-MM-DD format
  descricao: string;  // Description
  valor: string;      // Amount (negative for expenses)
  tipo: string;       // Type: 'receita' or 'despesa'
}

/**
 * Inter CSV columns
 */
export interface InterCSVRow {
  // Inter format will be defined in Story 1.3
  [key: string]: string;
}
