import Papa from 'papaparse'
import type {
  Transaction,
  CSVRow,
  FileUploadResult,
} from '@/types/transaction'
import { categorizeTransaction } from './categorization'

/**
 * Bank format type
 */
export type BankFormat = 'nubank' | 'inter' | 'unknown'

/**
 * Detect the bank format from CSV text
 */
export function detectBankFormat(csvText: string): BankFormat {
  const lines = csvText.trim().split('\n')
  if (lines.length === 0) return 'unknown'

  const firstLine = lines[0].toLowerCase()
  const columns = firstLine.split(',').map((c) => c.trim().replace(/"/g, ''))

  // Check for Nubank format: data, descricao, valor, tipo
  const hasNubankColumns =
    columns.includes('data') &&
    columns.includes('descricao') &&
    columns.includes('valor') &&
    columns.includes('tipo')

  if (hasNubankColumns) return 'nubank'

  // Check for Inter format: Data, Descrição, Valor (or similar)
  // Inter uses Portuguese column names and DD/MM/YYYY date format
  const hasInterColumns =
    (columns.includes('data') || columns.includes('data')) &&
    (columns.includes('descrição') || columns.includes('descricao') || columns.includes('descricao')) &&
    columns.includes('valor')

  if (hasInterColumns) return 'inter'

  return 'unknown'
}

/**
 * Generate a unique ID for a transaction
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Parse Nubank CSV format
 * Nubank uses negative amounts for expenses
 */
export function parseNubankCSV(
  csvText: string,
  onProgress?: (percent: number) => void
): FileUploadResult {
  const transactions: Transaction[] = []
  const errors: string[] = []
  let skippedRows = 0
  let totalRows = 0

  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    encoding: 'UTF-8',
    step: (row) => {
      totalRows++
      const data = row.data as CSVRow

      try {
        const transaction = parseNubankRow(data)
        if (transaction) {
          transactions.push(transaction)
        } else {
          skippedRows++
        }
      } catch (error) {
        skippedRows++
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        errors.push(`Row ${totalRows}: ${errorMsg}`)
      }

      // Report progress every 100 rows
      if (onProgress && totalRows % 100 === 0) {
        // We don't know total upfront, so we just report activity
        onProgress(Math.min(90, (totalRows / 5000) * 100))
      }
    },
    complete: () => {
      if (onProgress) onProgress(100)
    },
    error: (error: Error) => {
      errors.push(`Parsing error: ${error.message}`)
    },
  })

  return {
    transactions,
    errors,
    skippedRows,
    totalRows,
  }
}

/**
 * Parse a single Nubank CSV row
 */
function parseNubankRow(row: CSVRow): Transaction | null {
  // Validate required fields
  const dateStr = row.data
  const description = row.descricao
  const valor = row.valor
  const tipo = row.tipo

  if (!dateStr || !description || valor === undefined || !tipo) {
    return null
  }

  // Parse date (YYYY-MM-DD format)
  const date = parseNubankDate(dateStr)
  if (!date) {
    throw new Error(`Invalid date format: ${dateStr}`)
  }

  // Parse amount (Nubank uses negative for expenses, but also has tipo column)
  const amount = Math.abs(parseFloat(String(valor).replace(',', '.')))
  if (isNaN(amount)) {
    throw new Error(`Invalid amount: ${valor}`)
  }

  // Parse type from 'tipo' column
  const type = tipo.toLowerCase() === 'receita' ? 'income' : 'expense'

  // Categorize the transaction
  const categorizationResult = categorizeTransaction(description)

  return {
    id: generateId(),
    date,
    description: description.trim(),
    amount,
    type,
    category: categorizationResult.category,
    source: 'nubank',
  }
}

/**
 * Parse date from Nubank format (YYYY-MM-DD)
 */
function parseNubankDate(dateStr: string): Date | null {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null

  const [, year, month, day] = match
  const date = new Date(`${year}-${month}-${day}T00:00:00`)

  // Check if date is valid
  if (isNaN(date.getTime())) return null

  return date
}

/**
 * Parse Inter bank CSV export format
 *
 * Inter Format (example - may vary):
 * - Date: DD/MM/YYYY (Brazilian format)
 * - Amount: Negative for expenses, positive for income
 * - Columns: Data, Descrição, Valor (may have additional columns)
 *
 * @param csvText - Raw CSV text from Inter export
 * @param onProgress - Optional progress callback (percent: 0-100)
 * @returns FileUploadResult with normalized Transaction[] compatible with rest of app
 *
 * @see parseNubankCSV() for Nubank format
 */
export function parseInterCSV(
  csvText: string,
  onProgress?: (percent: number) => void
): FileUploadResult {
  const transactions: Transaction[] = []
  const errors: string[] = []
  let skippedRows = 0
  let totalRows = 0

  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    encoding: 'UTF-8',
    step: (row) => {
      totalRows++
      const data = row.data as CSVRow

      try {
        const transaction = parseInterRow(data)
        if (transaction) {
          transactions.push(transaction)
        } else {
          skippedRows++
        }
      } catch (error) {
        skippedRows++
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        errors.push(`Row ${totalRows}: ${errorMsg}`)
      }

      // Report progress every 100 rows
      if (onProgress && totalRows % 100 === 0) {
        onProgress(Math.min(90, (totalRows / 5000) * 100))
      }
    },
    complete: () => {
      if (onProgress) onProgress(100)
    },
    error: (error: Error) => {
      errors.push(`Parsing error: ${error.message}`)
    },
  })

  return {
    transactions,
    errors,
    skippedRows,
    totalRows,
  }
}

/**
 * Parse a single Inter CSV row
 *
 * Inter format differences from Nubank:
 * - Date: DD/MM/YYYY instead of YYYY-MM-DD
 * - May use "Descrição" or "Descricao" (with/without accent)
 * - Amount: Negative for expenses, positive for income
 * - No separate 'tipo' column - determined by sign of amount
 */
function parseInterRow(row: CSVRow): Transaction | null {
  // Inter may use various column names
  const dateStr = row.data || row.Data
  const description = row.descrição || row.descricao || row.Descricao || row.Descrição
  const valor = row.valor || row.Valor

  if (!dateStr || !description || valor === undefined) {
    return null
  }

  // Parse date (DD/MM/YYYY format - Brazilian)
  const date = parseInterDate(dateStr)
  if (!date) {
    throw new Error(`Invalid date format: ${dateStr}`)
  }

  // Parse amount - Inter uses negative for expenses
  const rawAmount = parseFloat(String(valor).replace(',', '.').replace(/\./g, '').replace(',', '.'))
  if (isNaN(rawAmount)) {
    throw new Error(`Invalid amount: ${valor}`)
  }

  const amount = Math.abs(rawAmount)
  const type = rawAmount >= 0 ? 'income' : 'expense'

  // Categorize the transaction
  const categorizationResult = categorizeTransaction(description)

  return {
    id: generateId(),
    date,
    description: description.trim(),
    amount,
    type,
    category: categorizationResult.category,
    source: 'inter',
  }
}

/**
 * Parse date from Inter format (DD/MM/YYYY)
 * Handles Brazilian date format
 */
function parseInterDate(dateStr: string): Date | null {
  // Handle DD/MM/YYYY format
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (match) {
    const [, day, month, year] = match
    const date = new Date(`${year}-${month}-${day}T00:00:00`)

    if (!isNaN(date.getTime())) {
      return date
    }
  }

  // Also try YYYY-MM-DD as fallback (some Inter exports may use this)
  const ymdMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (ymdMatch) {
    const [, year, month, day] = ymdMatch
    const date = new Date(`${year}-${month}-${day}T00:00:00`)

    if (!isNaN(date.getTime())) {
      return date
    }
  }

  return null
}

/**
 * Validate a transaction object
 */
export function validateTransaction(transaction: unknown): transaction is Transaction {
  if (!transaction || typeof transaction !== 'object') {
    return false
  }

  const t = transaction as Partial<Transaction>

  return (
    typeof t.id === 'string' &&
    t.id.length > 0 &&
    t.date instanceof Date &&
    !isNaN(t.date.getTime()) &&
    typeof t.description === 'string' &&
    t.description.length > 0 &&
    typeof t.amount === 'number' &&
    !isNaN(t.amount) &&
    t.amount >= 0 &&
    (t.type === 'income' || t.type === 'expense') &&
    (t.source === 'nubank' || t.source === 'inter')
  )
}

/**
 * Read and parse a CSV file
 */
export function parseCSVFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<FileUploadResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string
        const format = detectBankFormat(csvText)

        if (format === 'unknown') {
          reject(
            new Error(
              'Formato de arquivo não reconhecido. Use arquivos exportados do Nubank ou Inter.'
            )
          )
          return
        }

        if (format === 'nubank') {
          const result = parseNubankCSV(csvText, onProgress)
          resolve(result)
        } else if (format === 'inter') {
          const result = parseInterCSV(csvText, onProgress)
          resolve(result)
        } else {
          reject(new Error('Formato não suportado.'))
        }
      } catch (error) {
        reject(
          new Error(
            `Erro ao processar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
          )
        )
      }
    }

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo.'))
    }

    reader.readAsText(file, 'UTF-8')
  })
}

/**
 * Validate file before parsing
 */
export function validateCSVFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.name.endsWith('.csv')) {
    return {
      valid: false,
      error: 'Tipo de arquivo inválido. Por favor, selecione um arquivo .csv',
    }
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Arquivo muito grande. Tamanho máximo: 10MB',
    }
  }

  // Check empty file
  if (file.size === 0) {
    return { valid: false, error: 'Arquivo vazio.' }
  }

  return { valid: true }
}
