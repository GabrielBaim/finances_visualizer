import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, clamp } from '../utils'

describe('formatCurrency', () => {
  it('should format positive numbers correctly', () => {
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56')
  })

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('R$ 0,00')
  })

  it('should format negative numbers correctly', () => {
    expect(formatCurrency(-100)).toBe('-R$ 100,00')
  })
})

describe('formatDate', () => {
  it('should format date to Brazilian locale', () => {
    const date = new Date('2026-02-03')
    const formatted = formatDate(date)
    expect(formatted).toContain('02')
    expect(formatted).toContain('2026')
  })
})

describe('clamp', () => {
  it('should return min when value is below min', () => {
    expect(clamp(5, 10, 20)).toBe(10)
  })

  it('should return max when value is above max', () => {
    expect(clamp(25, 10, 20)).toBe(20)
  })

  it('should return value when within range', () => {
    expect(clamp(15, 10, 20)).toBe(15)
  })
})
