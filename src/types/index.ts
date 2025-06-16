/**
 * Algorithm category types
 */
export type AlgorithmCategory =
  | 'Search'
  | 'Sort'
  | 'Graph'
  | 'Tree'
  | 'String'
  | 'Dynamic Programming'
  | 'Greedy'
  | 'Data Structure';

/**
 * Complexity notation types
 */
export type ComplexityNotation =
  | 'O(1)'
  | 'O(log n)'
  | 'O(n)'
  | 'O(n log n)'
  | 'O(n²)'
  | 'O(n³)'
  | 'O(2^n)'
  | 'O(n!)'
  | string; // For custom complexity notations

/**
 * Filter options for algorithm search
 */
export interface AlgorithmFilter {
  categories?: AlgorithmCategory[];
  timeComplexity?: ComplexityNotation[];
  spaceComplexity?: ComplexityNotation[];
  searchTerm?: string;
}

/**
 * Options for sorting algorithm results
 */
export type SortOption = 'name' | 'category' | 'timeComplexity' | 'spaceComplexity' | 'popularity';
