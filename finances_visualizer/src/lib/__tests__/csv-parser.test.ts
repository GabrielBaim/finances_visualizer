import { describe, it, expect } from 'vitest'
import {
  detectBankFormat,
  parseNubankCSV,
  validateTransaction,
  validateCSVFile,
} from '../csv-parser'
import type { Transaction } from '@/types/transaction'

describe('detectBankFormat', () => {
  it('should detect Nubank format', () => {
    const nubankCSV = 'data,descricao,valor,tipo\n2024-01-15,"Test",100.00,receita'
    expect(detectBankFormat(nubankCSV)).toBe('nubank')
  })

  it('should detect Nubank format with different column order', () => {
    const nubankCSV = 'tipo,data,valor,descricao\nreceita,2024-01-15,100.00,"Test"'
    expect(detectBankFormat(nubankCSV)).toBe('nubank')
  })

  it('should return unknown for unrecognized format', () => {
    const unknownCSV = 'col1,col2,col3\nval1,val2,val3'
    expect(detectBankFormat(unknownCSV)).toBe('unknown')
  })

  it('should return unknown for empty string', () => {
    expect(detectBankFormat('')).toBe('unknown')
  })

  it('should be case insensitive for Nubank format', () => {
    const mixedCase = 'Data,Descricao,Valor,Tipo\n2024-01-15,"Test",100.00,receita'
    expect(detectBankFormat(mixedCase)).toBe('nubank')
  })
})

describe('parseNubankCSV', () => {
  it('should parse valid Nubank CSV', () => {
    const csv = `data,descricao,valor,tipo
2024-01-15,"Uber Eats",-50.00,despesa
2024-01-16,"Salário",5000.00,receita`

    const result = parseNubankCSV(csv)

    expect(result.transactions).toHaveLength(2)
    expect(result.skippedRows).toBe(0)
    expect(result.errors).toHaveLength(0)
  })

  it('should parse income transactions correctly', () => {
    const csv = `data,descricao,valor,tipo
2024-01-16,"Salário",5000.00,receita`

    const result = parseNubankCSV(csv)
    const transaction = result.transactions[0]

    expect(transaction.amount).toBe(5000)
    expect(transaction.type).toBe('income')
    expect(transaction.description).toBe('Salário')
  })

  it('should parse expense transactions correctly', () => {
    const csv = `data,descricao,valor,tipo
2024-01-15,"Uber Eats",-50.00,despesa`

    const result = parseNubankCSV(csv)
    const transaction = result.transactions[0]

    expect(transaction.amount).toBe(50)
    expect(transaction.type).toBe('expense')
    expect(transaction.description).toBe('Uber Eats')
  })

  it('should handle quoted strings with commas', () => {
    const csv = `data,descricao,valor,tipo
2024-01-15,"Uber Eats, Taxa",-50.00,despesa`

    const result = parseNubankCSV(csv)
    const transaction = result.transactions[0]

    expect(transaction.description).toBe('Uber Eats, Taxa')
  })

  it('should generate unique IDs for each transaction', () => {
    const csv = `data,descricao,valor,tipo
2024-01-15,"Test 1",50.00,despesa
2024-01-16,"Test 2",100.00,receita`

    const result = parseNubankCSV(csv)
    const ids = result.transactions.map((t) => t.id)

    expect(new Set(ids).size).toBe(2)
    expect(ids[0]).not.toBe(ids[1])
  })

  it('should parse dates correctly', () => {
    const csv = `data,descricao,valor,tipo
2024-01-15,"Test",50.00,despesa`

    const result = parseNubankCSV(csv)
    const transaction = result.transactions[0]

    expect(transaction.date.getFullYear()).toBe(2024)
    expect(transaction.date.getMonth()).toBe(0) // January
    expect(transaction.date.getDate()).toBe(15)
  })

  it('should skip malformed rows', () => {
    const csv = `data,descricao,valor,tipo
2024-01-15,"Valid",50.00,despesa
invalid-data,"Invalid",bad,despesa
2024-01-16,"Valid",100.00,receita`

    const result = parseNubankCSV(csv)

    expect(result.transactions).toHaveLength(2)
    expect(result.skippedRows).toBe(1)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('should handle empty CSV', () => {
    const csv = 'data,descricao,valor,tipo\n'

    const result = parseNubankCSV(csv)

    expect(result.transactions).toHaveLength(0)
  })

  it('should set source to nubank', () => {
    const csv = `data,descricao,valor,tipo
2024-01-15,"Test",50.00,despesa`

    const result = parseNubankCSV(csv)
    const transaction = result.transactions[0]

    expect(transaction.source).toBe('nubank')
  })

  it('should handle positive amounts for expenses', () => {
    const csv = `data,descricao,valor,tipo
2024-01-15,"Test",50.00,despesa`

    const result = parseNubankCSV(csv)
    const transaction = result.transactions[0]

    expect(transaction.amount).toBe(50)
    expect(transaction.type).toBe('expense')
  })
})

describe('validateTransaction', () => {
  it('should validate correct transaction', () => {
    const transaction: Transaction = {
      id: 'test-id',
      date: new Date('2024-01-15'),
      description: 'Test',
      amount: 100,
      type: 'income',
      source: 'nubank',
    }

    expect(validateTransaction(transaction)).toBe(true)
  })

  it('should reject transaction with invalid date', () => {
    const transaction = {
      id: 'test-id',
      date: new Date('invalid'),
      description: 'Test',
      amount: 100,
      type: 'income',
      source: 'nubank',
    } as Transaction

    expect(validateTransaction(transaction)).toBe(false)
  })

  it('should reject transaction with negative amount', () => {
    const transaction = {
      id: 'test-id',
      date: new Date('2024-01-15'),
      description: 'Test',
      amount: -10,
      type: 'income',
      source: 'nubank',
    } as Transaction

    expect(validateTransaction(transaction)).toBe(false)
  })

  it('should reject transaction with invalid type', () => {
    const transaction = {
      id: 'test-id',
      date: new Date('2024-01-15'),
      description: 'Test',
      amount: 100,
      type: 'invalid',
      source: 'nubank',
    } as unknown

    expect(validateTransaction(transaction)).toBe(false)
  })

  it('should reject transaction with invalid source', () => {
    const transaction = {
      id: 'test-id',
      date: new Date('2024-01-15'),
      description: 'Test',
      amount: 100,
      type: 'income',
      source: 'invalid',
    } as unknown

    expect(validateTransaction(transaction)).toBe(false)
  })

  it('should reject null', () => {
    expect(validateTransaction(null)).toBe(false)
  })

  it('should reject object without required fields', () => {
    expect(validateTransaction({})).toBe(false)
  })
})

describe('validateCSVFile', () => {
  it('should validate correct CSV file', () => {
    const file = new File(['test'], 'test.csv', { type: 'text/csv' })
    const result = validateCSVFile(file)

    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('should reject non-CSV file', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const result = validateCSVFile(file)

    expect(result.valid).toBe(false)
    expect(result.error).toContain('.csv')
  })

  it('should reject file that is too large', () => {
    const content = 'x'.repeat(11 * 1024 * 1024) // 11MB
    const file = new File([content], 'test.csv', { type: 'text/csv' })
    const result = validateCSVFile(file)

    expect(result.valid).toBe(false)
    expect(result.error).toContain('10MB')
  })

  it('should reject empty file', () => {
    const file = new File([], 'test.csv', { type: 'text/csv' })
    const result = validateCSVFile(file)

    expect(result.valid).toBe(false)
    expect(result.error).toContain('vazio')
  })

  it('should accept file at size limit', () => {
    const content = 'x'.repeat(10 * 1024 * 1024) // Exactly 10MB
    const file = new File([content], 'test.csv', { type: 'text/csv' })
    const result = validateCSVFile(file)

    expect(result.valid).toBe(true)
  })
})
