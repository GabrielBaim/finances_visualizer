import { describe, it, expect } from 'vitest'

describe('Sample Test', () => {
  it('should verify Vitest is working', () => {
    expect(1 + 1).toBe(2)
  })

  it('should verify basic assertions work', () => {
    const message = 'Visualizador de Finanças'
    expect(message).toContain('Finanças')
    expect(message.length).toBeGreaterThan(10)
  })
})
