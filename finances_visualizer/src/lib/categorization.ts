/**
 * Transaction Categorization Engine
 * Uses keyword matching to categorize transactions by description
 */

import type { Category, CategorizationResult } from '@/types/category';

/**
 * Keyword mappings for each category
 * Lowercase keywords for matching
 * Order matters: more specific keywords first
 */
const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  Alimentação: [
    // Food delivery (specific)
    'uber eats', 'ifood', 'rappi',
    // Restaurants
    'restaurante', 'lanchonete', 'padaria', 'cafeteria',
    'burger', 'pizza', 'sushi',
    // Groceries (more specific first - excluding "mercado livre")
    'carrefour', 'extra', 'atta', 'dia', 'gleba',
    'supermercado',
    // General grocery - after Compras checks
    'mercado',
    // Convenience
    'loja de conveniencia',
  ],

  Transporte: [
    // Ride sharing
    '99 taxi', 'cabify',
    'uber', 'taxi',
    // Fuel
    'posto', 'gasolina', 'alcool', 'combustivel',
    'shell', 'ipiranga', 'petrobras',
    // Parking
    'estacionamento', 'parking',
    // Transit
    'onibus', 'metro', 'trem', 'bilhete',
  ],

  Moradia: [
    // Utilities
    'eletropaulo', 'sabesp',
    'luz', 'agua', 'esgoto',
    'energia', 'energia eletrica', 'conta de luz',
    // Rent
    'aluguel', 'condominio',
    // Home services (internet/phone - not streaming)
    'net fibra', 'vivo fibra', 'claro fibra', 'tim fibra',
    // Maintenance
    'reparo', 'manutencao', 'encanador', 'eletricista',
  ],

  Lazer: [
    // Entertainment venues
    'cinema', 'teatro', 'show', 'concerto',
    // Gaming
    'jogo', 'game', 'psn', 'xbox', 'steam',
    // Streaming (specific services)
    'prime video', 'disney plus', 'hbo max', 'hbo',
    'youtube premium',
    // Sports/Fitness
    'academia', 'personal', 'crossfit',
  ],

  Saúde: [
    // Medical facilities
    'hospital', 'clinica', 'consultorio',
    // Professionals
    'medico', 'doutor',
    // Services
    'exame', 'consulta',
    // Pharmacies (specific chains)
    'drogasil', 'droga raia', 'raia',
    'farmacia', 'drogaria',
    // Insurance
    'plano de saude', 'unimed', 'bradesco saude',
    'amil', 'sulamerica',
  ],

  Educação: [
    // Institutions
    'escola', 'faculdade', 'universidade',
    // Learning
    'curso online', 'udemy', 'coursera', 'alura', 'rocketseat',
    // Books
    'livraria cultura', 'livraria leitura',
  ],

  Compras: [
    // Online marketplaces (specific first to avoid Alimentação overlap)
    'mercado livre',
    // Retail stores
    'magazine luiza', 'magazine',
    // Online
    'amazon', 'shopee', 'aliexpress',
    // Clothing
    'zara', 'h&m', 'centenario', 'riachuelo',
    'renner', 'c&a',
    // General
    'loja', 'shopping',
  ],

  Serviços: [
    // Subscriptions
    'assinatura', 'mensalidade',
    // Financial
    'juros', 'tarifa', 'anuidade', 'iof',
    // Professional
    'advogado', 'contador', 'consultoria',
  ],

  Transferências: [
    'pix transferencia', 'pix para',
    'ted', 'doc',
    'transferencia', 'deposito', 'saque',
  ],

  Outros: [
    // Fallback - custom keywords added at runtime
  ],
};

/**
 * Category priority for overlapping keywords
 * Higher number = higher priority (checked first)
 */
const CATEGORY_PRIORITY: Record<Category, number> = {
  Alimentação: 10,
  Transporte: 9,
  Saúde: 8,
  Moradia: 7,
  Lazer: 6,
  Educação: 5,
  Compras: 4,
  Serviços: 3,
  Transferências: 2,
  Outros: 1,
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
 * Calculate confidence score based on match type and keyword length
 */
function calculateConfidence(matchType: 'exact' | 'partial' | 'none', keywordLength = 0): number {
  switch (matchType) {
    case 'exact':
      return 100;
    case 'partial': {
      // 60-95% for partial match based on keyword length (longer = more confident)
      const minConfidence = 60;
      // Scale confidence by keyword length (max additional 35% for long keywords)
      const lengthBonus = Math.min(keywordLength * 2, 35);
      return minConfidence + lengthBonus;
    }
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

  // Collect all matches with their priorities
  interface Match {
    category: Category;
    type: 'exact' | 'partial';
    keyword: string;
    priority: number;
  }

  const matches: Match[] = [];

  // Check exact matches (O(1) lookup)
  for (const [category, keywordSet] of EXACT_MATCH_SETS.entries()) {
    if (keywordSet.has(normalized)) {
      matches.push({
        category,
        type: 'exact',
        keyword: normalized,
        priority: CATEGORY_PRIORITY[category],
      });
    }
  }

  // If no exact match, check partial matches
  if (matches.length === 0) {
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      for (const keyword of keywords) {
        if (normalized.includes(keyword)) {
          matches.push({
            category: category as Category,
            type: 'partial',
            keyword,
            priority: CATEGORY_PRIORITY[category as Category],
          });
        }
      }
    }
  }

  // Sort by priority (highest first), then by type (exact > partial), then by keyword length (longer > shorter)
  matches.sort((a, b) => {
    // Exact matches always come first
    if (a.type === 'exact' && b.type !== 'exact') return -1;
    if (b.type === 'exact' && a.type !== 'exact') return 1;

    // For same type, prioritize longer keywords (more specific matches)
    if (a.keyword.length !== b.keyword.length) {
      return b.keyword.length - a.keyword.length;
    }

    // Then by priority
    return b.priority - a.priority;
  });

  // Return best match or fallback to Outros
  if (matches.length > 0) {
    const best = matches[0];
    return {
      category: best.category,
      confidence: calculateConfidence(best.type, best.keyword.length),
      matchedKeyword: best.keyword,
      matchType: best.type,
    };
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
