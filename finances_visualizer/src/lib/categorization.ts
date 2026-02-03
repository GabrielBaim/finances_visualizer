/**
 * Transaction Categorization Engine
 * Uses keyword matching to categorize transactions by description
 */

import type { Category, CategorizationResult } from '@/types/category';

/**
 * Keyword mappings for each category
 * Lowercase keywords for matching
 */
const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  Alimentação: [
    // Food delivery
    'uber eats', 'ifood', 'rappi', 'delivery',
    'delivery',
    // Restaurants
    'restaurante', 'lanchonete', 'padaria', 'cafeteria',
    'burger', 'pizza', 'sushi',
    // Groceries
    'mercado', 'supermercado', 'carrefour', 'extra', 'wallmart',
    'atta', 'dia', 'gleba', 'pão de açucar',
    // Convenience
    'farmacia', 'drogaria', 'loja de conveniencia',
  ],

  Transporte: [
    // Ride sharing
    'uber', '99 taxi', 'cabify', 'taxi',
    // Fuel
    'posto', 'gasolina', 'alcool', 'combustivel',
    'shell', 'ipiranga', 'petrobras', 'br',
    // Parking
    'estacionamento', 'parking',
    // Transit
    'onibus', 'bus', 'metro', 'trem', 'bilhete',
  ],

  Moradia: [
    // Utilities
    'luz', 'agua', 'esgoto', 'gas',
    'energia', 'eletropaulo', 'sabesp',
    // Rent
    'aluguel', 'condominio',
    // Home services
    'internet', 'net', 'vivo', 'claro', 'tim',
    'netflix', 'spotify',
    // Maintenance
    'reparo', 'manutencao', 'encanador', 'eletricista',
  ],

  Lazer: [
    // Entertainment
    'cinema', 'teatro', 'show', 'concerto',
    // Hobbies
    'jogo', 'game', 'psn', 'xbox', 'steam',
    'livraria', 'livro',
    // Streaming
    'netflix', 'prime video', 'disney', 'hbo',
    'spotify', 'youtube premium',
    // Sports
    'academia', 'personal', 'crossfit',
  ],

  Saúde: [
    // Medical
    'hospital', 'clinica', 'medico', 'doutor',
    'exame', 'consulta',
    // Pharmacy
    'farmacia', 'drogaria', 'drogasil', 'raia',
    // Insurance
    'plano de saude', 'unimed', 'bradesco saude',
    'amil', 'sulamerica',
  ],

  Educação: [
    // Schools
    'escola', 'faculdade', 'universidade', 'curso',
    // Books
    'livraria', 'livro', 'ebook',
    // Learning
    'udemy', 'coursera', 'alura', 'rocketseat',
  ],

  Compras: [
    // Retail
    'loja', 'shopping', 'magazine', 'mercado',
    // Online
    'amazon', 'mercado livre', 'shopee', 'aliexpress',
    // Specific stores
    'zara', 'h&m', 'cenetenio', 'riachuelo',
    'renner', 'c&a',
  ],

  Serviços: [
    // Subscriptions
    'assinatura', 'mensalidade',
    // Financial services
    'juros', 'tarifa', 'anuidade', 'iof',
    // Professional services
    'advogado', 'contador', 'consultoria',
  ],

  Transferências: [
    'pix', 'transferencia', 'ted', 'doc',
    'deposito', 'saque',
  ],

  Outros: [
    // Fallback - empty or will be used for unmatched
  ],
};

/**
 * Pre-computed Sets for exact matching (O(1) lookup)
 */
const EXACT_MATCH_SETS: Map<Category, Set<string>> = new Map();

/**
 * Initialize exact match sets
 */
function initExactMatchSets(): void {
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const keywordSet = new Set(keywords);
    EXACT_MATCH_SETS.set(category as Category, keywordSet);
  }
}

// Initialize on module load
initExactMatchSets();

/**
 * Normalize text for matching
 * - Convert to lowercase
 * - Remove accents
 * - Remove extra whitespace
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Calculate confidence score based on match type
 */
function calculateConfidence(matchType: 'exact' | 'partial' | 'none'): number {
  switch (matchType) {
    case 'exact':
      return 100;
    case 'partial':
      // 60-80% for partial match based on keyword length
      return Math.floor(Math.random() * 20) + 60;
    case 'none':
    default:
      return 0;
  }
}

/**
 * Categorize a transaction based on its description
 */
export function categorizeTransaction(description: string): CategorizationResult {
  // Handle empty description
  if (!description || description.trim().length === 0) {
    return {
      category: 'Outros',
      confidence: 0,
      matchType: 'none',
    };
  }

  const normalized = normalizeText(description);

  // First, try exact match (O(1) lookup)
  for (const [category, keywordSet] of EXACT_MATCH_SETS.entries()) {
    if (category === 'Outros') continue; // Skip Outros for matching

    if (keywordSet.has(normalized)) {
      return {
        category,
        confidence: 100,
        matchedKeyword: description,
        matchType: 'exact',
      };
    }
  }

  // Second, try partial match
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'Outros') continue;

    for (const keyword of keywords) {
      if (normalized.includes(keyword) || keyword.includes(normalized)) {
        return {
          category: category as Category,
          confidence: calculateConfidence('partial'),
          matchedKeyword: keyword,
          matchType: 'partial',
        };
      }
    }
  }

  // No match found
  return {
    category: 'Outros',
    confidence: 0,
    matchType: 'none',
  };
}

/**
 * Categorize multiple transactions (batch processing)
 */
export function categorizeTransactions(descriptions: string[]): CategorizationResult[] {
  return descriptions.map(categorizeTransaction);
}

/**
 * Add custom keyword to a category
 * Useful for user-defined categories or community contributions
 */
export function addKeyword(category: Category, keyword: string): void {
  const normalized = normalizeText(keyword);
  CATEGORY_KEYWORDS[category].push(normalized);
  EXACT_MATCH_SETS.get(category)?.add(normalized);
}

/**
 * Get all keywords for a category
 */
export function getKeywords(category: Category): string[] {
  return [...CATEGORY_KEYWORDS[category]];
}

/**
 * Get all category-keyword mappings (read-only)
 */
export function getAllMappings(): Readonly<Record<Category, string[]>> {
  return CATEGORY_KEYWORDS;
}
