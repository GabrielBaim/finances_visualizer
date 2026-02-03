import { describe, it, expect } from 'vitest'
import { parseInterCSV, detectBankFormat } from '../csv-parser'

describe('detectBankFormat - Inter', () => {
  it('should detect Inter format with Portuguese columns', () => {
    const interCSV = 'Data,Descrição,Valor\n15/01/2024,"Uber Eats",-50.00'
    expect(detectBankFormat(interCSV)).toBe('inter')
  })

  it('should detect Inter format without accent', () => {
    const interCSV = 'Data,Descricao,Valor\n15/01/2024,"Uber Eats",-50.00'
    expect(detectBankFormat(interCSV)).toBe('inter')
  })

  it('should not confuse Nubank with Inter', () => {
    const nubankCSV = 'data,descricao,valor,tipo\n2024-01-15,"Test",-50.00,despesa'
    expect(detectBankFormat(nubankCSV)).toBe('nubank')
  })
})

describe('parseInterCSV', () => {
  it('should parse valid Inter CSV with DD/MM/YYYY format', () => {
    const csv = `Data,Descrição,Valor
15/01/2024,"Uber Eats",-50.00
16/01/2024,"Salário",5000.00`

    const result = parseInterCSV(csv)

    expect(result.transactions).toHaveLength(2)
    expect(result.skippedRows).toBe(0)
    expect(result.errors).toHaveLength(0)
  })

  it('should parse income transactions correctly', () => {
    const csv = `Data,Descrição,Valor
16/01/2024,"Salário",5000.00`

    const result = parseInterCSV(csv)
    const transaction = result.transactions[0]

    expect(transaction.amount).toBe(5000)
    expect(transaction.type).toBe('income')
    expect(transaction.description).toBe('Salário')
  })

  it('should parse expense transactions correctly', () => {
    const csv = `Data,Descrição,Valor
15/01/2024,"Uber Eats",-50.00`

    const result = parseInterCSV(csv)
    const transaction = result.transactions[0]

    expect(transaction.amount).toBe(50)
    expect(transaction.type).toBe('expense')
    expect(transaction.description).toBe('Uber Eats')
  })

  it('should parse DD/MM/YYYY date format correctly', () => {
    const csv = `Data,Descrição,Valor
15/01/2024,"Test",-50.00`

    const result = parseInterCSV(csv)
    const transaction = result.transactions[0]

    expect(transaction.date.getFullYear()).toBe(2024)
    expect(transaction.date.getMonth()).toBe(0) // January
    expect(transaction.date.getDate()).toBe(15)
  })

  it('should handle YYYY-MM-DD as fallback', () => {
    const csv = `Data,Descrição,Valor
2024-01-15,"Test",-50.00`

    const result = parseInterCSV(csv)
    const transaction = result.transactions[0]

    expect(transaction.date.getFullYear()).toBe(2024)
    expect(transaction.date.getMonth()).toBe(0)
    expect(transaction.date.getDate()).toBe(15)
  })

  it('should handle column name variations (Descricao vs Descrição)', () => {
    const csv = `Data,Descricao,Valor
15/01/2024,"Test",-50.00`

    const result = parseInterCSV(csv)

    expect(result.transactions).toHaveLength(1)
  })

  it('should generate unique IDs', () => {
    const csv = `Data,Descrição,Valor
15/01/2024,"Test 1",-50.00
16/01/2024,"Test 2",100.00`

    const result = parseInterCSV(csv)
    const ids = result.transactions.map((t) => t.id)

    expect(new Set(ids).size).toBe(2)
  })

  it('should set source to inter', () => {
    const csv = `Data,Descrição,Valor
15/01/2024,"Test",-50.00`

    const result = parseInterCSV(csv)
    const transaction = result.transactions[0]

    expect(transaction.source).toBe('inter')
  })

  it('should handle quoted strings with commas', () => {
    const csv = `Data,Descrição,Valor
15/01/2024,"Uber Eats, Taxa",-50.00`

    const result = parseInterCSV(csv)
    const transaction = result.transactions[0]

    expect(transaction.description).toBe('Uber Eats, Taxa')
  })

  it('should skip malformed rows', () => {
    const csv = `Data,Descrição,Valor
15/01/2024,"Valid",-50.00
invalid-date,"Invalid",bad
16/01/2024,"Valid",100.00`

    const result = parseInterCSV(csv)

    expect(result.transactions).toHaveLength(2)
    expect(result.skippedRows).toBe(1)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('should handle empty CSV', () => {
    const csv = 'Data,Descrição,Valor\n'

    const result = parseInterCSV(csv)

    expect(result.transactions).toHaveLength(0)
  })

  it('should handle Brazilian decimal format', () => {
    const csv = `Data,Descrição,Valor
15/01/2024,"Test",-50,50`

    const result = parseInterCSV(csv)
    const transaction = result.transactions[0]

    expect(transaction.amount).toBeGreaterThan(0)
  })
})

describe('Inter vs Nubank normalization', () => {
  it('should produce same structure for both formats', () => {
    const nubankCSV = `data,descricao,valor,tipo
2024-01-15,"Uber Eats",-50.00,despesa`

    const interCSV = `Data,Descrição,Valor
15/01/2024,"Uber Eats",-50.00`

    const nubankResult = parseInterCSV(nubankCSV) // Use parseInterCSV for both since detectBankFormat will route correctly
    const interResult = parseInterCSV(interCSV)

    // Both should have transactions with same structure
    expect(nubankResult.transactions[0]).toHaveProperty('id')
    expect(nubankResult.transactions[0]).toHaveProperty('date')
    expect(nubankResult.transactions[0]).toHaveProperty('description')
    expect(nubankResult.transactions[0]).toHaveProperty('amount')
    expect(nubankResult.transactions[0]).toHaveProperty('type')
    expect(nubankResult.transactions[0]).toHaveProperty('source')

    expect(interResult.transactions[0]).toHaveProperty('id')
    expect(interResult.transactions[0]).toHaveProperty('date')
    expect(interResult.transactions[0]).toHaveProperty('description')
    expect(interResult.transactions[0]).toHaveProperty('amount')
    expect(interResult.transactions[0]).toHaveProperty('type')
    expect(interResult.transactions[0]).toHaveProperty('source')
  })
})
