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

/**
 * Problem type for coding platform problems
 */
export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Beginner' | 'Lower-Mid' | 'Mid-Level' | 'Upper-Mid' | 'Very Hard' | string;
  url: string;
  slug?: string;
  code?: string;  // For CodeChef problem code
  acceptance_rate?: number;
  tags?: string[];
  status?: 'Solved' | 'Attempted' | 'Not Attempted';
  bookmarked?: boolean;
  points?: number;  // For Codeforces problem rating
  source?: string;  // Platform source (leetcode, codeforces, codechef)
}

/**
 * Metadata for problem listings
 */
export interface ProblemsMetadata {
  total_problems: number;
  last_updated: string;
}

/**
 * Response structure for problems API
 */
export interface ProblemsResponse {
  metadata: ProblemsMetadata;
  problems: Problem[];
}

/**
 * Pagination state for problem lists
 */
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}
