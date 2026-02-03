import { describe, it, expect } from 'vitest';
import {
  categorizeTransaction,
  categorizeTransactions,
  normalizeText,
  addKeyword,
  getKeywords,
  getAllMappings,
} from '../categorization';

describe('normalizeText', () => {
  it('should convert to lowercase', () => {
    expect(normalizeText('UBER EATS')).toBe('uber eats');
  });

  it('should remove accents', () => {
    expect(normalizeText('çafé')).toBe('cafe');
    expect(normalizeText('ação')).toBe('acao');
    expect(normalizeText('Eletricidade')).toBe('eletricidade');
  });

  it('should remove extra whitespace', () => {
    expect(normalizeText('  uber   eats  ')).toBe('uber eats');
  });

  it('should handle empty string', () => {
    expect(normalizeText('')).toBe('');
  });
});

describe('categorizeTransaction', () => {
  describe('Alimentação', () => {
    it('should categorize Uber Eats', () => {
      const result = categorizeTransaction('Uber Eats');
      expect(result.category).toBe('Alimentação');
      expect(result.confidence).toBeGreaterThan(60);
    });

    it('should categorize iFood', () => {
      const result = categorizeTransaction('iFood Restaurante');
      expect(result.category).toBe('Alimentação');
      expect(result.confidence).toBeGreaterThanOrEqual(60);
    });

    it('should categorize Mercado', () => {
      const result = categorizeTransaction('Mercado Extra');
      expect(result.category).toBe('Alimentação');
    });
  });

  describe('Transporte', () => {
    it('should categorize Uber (ride)', () => {
      const result = categorizeTransaction('Uber Viagem');
      expect(result.category).toBe('Transporte');
      expect(result.confidence).toBeGreaterThan(60);
    });

    it('should categorize gasolina', () => {
      const result = categorizeTransaction('Posto Shell Gasolina');
      expect(result.category).toBe('Transporte');
    });

    it('should categorize estacionamento', () => {
      const result = categorizeTransaction('Estacionamento Shopping');
      expect(result.category).toBe('Transporte');
    });
  });

  describe('Moradia', () => {
    it('should categorize luz', () => {
      const result = categorizeTransaction('Conta de Luz');
      expect(result.category).toBe('Moradia');
    });

    it('should categorize aluguel', () => {
      const result = categorizeTransaction('Aluguel Apartamento');
      expect(result.category).toBe('Moradia');
    });

    it('should categorize internet', () => {
      const result = categorizeTransaction('Net Fibra Internet');
      expect(result.category).toBe('Moradia');
    });
  });

  describe('Lazer', () => {
    it('should categorize cinema', () => {
      const result = categorizeTransaction('Cinema');
      expect(result.category).toBe('Lazer');
    });

    it('should categorize show', () => {
      const result = categorizeTransaction('Show de Musica');
      expect(result.category).toBe('Lazer');
    });

    it('should categorize academia', () => {
      const result = categorizeTransaction('Academia Personal');
      expect(result.category).toBe('Lazer');
    });
  });

  describe('Saúde', () => {
    it('should categorize farmacia', () => {
      const result = categorizeTransaction('Drogasil Farmacia');
      expect(result.category).toBe('Saúde');
    });

    it('should categorize hospital', () => {
      const result = categorizeTransaction('Hospital Albert Einstein');
      expect(result.category).toBe('Saúde');
    });

    it('should categorize drogaria', () => {
      const result = categorizeTransaction('Drogaria SP');
      expect(result.category).toBe('Saúde');
    });
  });

  describe('Educação', () => {
    it('should categorize curso online', () => {
      const result = categorizeTransaction('Curso Online Python');
      expect(result.category).toBe('Educação');
    });

    it('should categorize faculdade', () => {
      const result = categorizeTransaction('Faculdade Unip');
      expect(result.category).toBe('Educação');
    });
  });

  describe('Compras', () => {
    it('should categorize Amazon', () => {
      const result = categorizeTransaction('Amazon Compra');
      expect(result.category).toBe('Compras');
    });

    it('should categorize shopping', () => {
      const result = categorizeTransaction('Loja Shopping Center');
      expect(result.category).toBe('Compras');
    });

    it('should categorize mercado livre (longer keyword wins)', () => {
      const result = categorizeTransaction('Mercado Livre Compra');
      // "mercado livre" (13 chars) vs "mercado" (7 chars) - longer wins
      expect(result.category).toBe('Compras');
    });
  });

  describe('Serviços', () => {
    it('should categorize tarifa', () => {
      const result = categorizeTransaction('Tarifa Bancaria');
      expect(result.category).toBe('Serviços');
    });

    it('should categorize assinatura', () => {
      const result = categorizeTransaction('Assinatura Mensal');
      expect(result.category).toBe('Serviços');
    });
  });

  describe('Transferências', () => {
    it('should categorize PIX', () => {
      const result = categorizeTransaction('PIX Transferencia');
      expect(result.category).toBe('Transferências');
    });

    it('should categorize ted', () => {
      const result = categorizeTransaction('TED Banco');
      expect(result.category).toBe('Transferências');
    });
  });

  describe('Fallback to Outros', () => {
    it('should return Outros for unmatched description', () => {
      const result = categorizeTransaction('XYZ Unknown Company 12345');
      expect(result.category).toBe('Outros');
      expect(result.confidence).toBe(0);
      expect(result.matchType).toBe('none');
    });

    it('should return Outros for empty description', () => {
      const result = categorizeTransaction('');
      expect(result.category).toBe('Outros');
      expect(result.confidence).toBe(0);
    });

    it('should return Outros for whitespace only', () => {
      const result = categorizeTransaction('   ');
      expect(result.category).toBe('Outros');
      expect(result.confidence).toBe(0);
    });
  });

  describe('Confidence scoring', () => {
    it('should return 100 for exact match', () => {
      const result = categorizeTransaction('uber eats');
      expect(result.confidence).toBe(100);
      expect(result.matchType).toBe('exact');
    });

    it('should return 60-80 for partial match', () => {
      const result = categorizeTransaction('Pagamento Uber Eats');
      expect(result.confidence).toBeGreaterThanOrEqual(60);
      expect(result.confidence).toBeLessThanOrEqual(80);
      expect(result.matchType).toBe('partial');
    });
  });

  describe('Accent handling', () => {
    it('should match regardless of accents', () => {
      const result1 = categorizeTransaction('Energia Elétrica');
      const result2 = categorizeTransaction('Energia Eletrica');
      const result3 = categorizeTransaction('Conta de Luz');

      expect(result1.category).toBe('Moradia');
      expect(result2.category).toBe('Moradia');
      expect(result3.category).toBe('Moradia');
    });
  });

  describe('Category priority for overlapping keywords', () => {
    it('should prioritize Alimentação over Compras for mercado', () => {
      const result = categorizeTransaction('Mercado Extra');
      expect(result.category).toBe('Alimentação');
    });
  });
});

describe('categorizeTransactions (batch)', () => {
  it('should categorize multiple transactions', () => {
    const descriptions = [
      'Uber Eats',
      'Cinema',
      'Gasolina',
      'XYZ Unknown',
    ];

    const results = categorizeTransactions(descriptions);

    expect(results).toHaveLength(4);
    expect(results[0].category).toBe('Alimentação');
    expect(results[1].category).toBe('Lazer');
    expect(results[2].category).toBe('Transporte');
    expect(results[3].category).toBe('Outros');
  });

  it('should handle empty array', () => {
    const results = categorizeTransactions([]);
    expect(results).toEqual([]);
  });
});

describe('addKeyword', () => {
  it('should add keyword to category', () => {
    addKeyword('Alimentação', 'my custom restaurant');

    const result = categorizeTransaction('my custom restaurant');
    expect(result.category).toBe('Alimentação');
    expect(result.confidence).toBe(100);
  });

  it('should add keyword to Outros and match it', () => {
    addKeyword('Outros', 'custom expense');

    const result = categorizeTransaction('custom expense');
    expect(result.category).toBe('Outros');
    expect(result.confidence).toBe(100);
  });
});

describe('getKeywords', () => {
  it('should return keywords for category', () => {
    const keywords = getKeywords('Alimentação');

    expect(Array.isArray(keywords)).toBe(true);
    expect(keywords.length).toBeGreaterThan(0);
    expect(keywords).toContain('uber eats');
  });
});

describe('getAllMappings', () => {
  it('should return all category-keyword mappings', () => {
    const mappings = getAllMappings();

    expect(typeof mappings).toBe('object');
    expect(Object.keys(mappings).length).toBe(10);
    expect(mappings.Alimentação).toBeDefined();
    expect(mappings.Transporte).toBeDefined();
  });
});
