/**
 * Format a time complexity string for consistent display
 */
export const formatComplexity = (complexity: string): string => {
  // Already in good format, return as is
  return complexity;
};

/**
 * Group algorithms by category
 */
export const groupByCategory = <T extends { category: string }>(items: T[]): Record<string, T[]> => {
  return items.reduce((acc: Record<string, T[]>, item) => {
    const { category } = item;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
};

/**
 * Get color for different algorithm categories
 */
export const getCategoryColor = (category: string): { bg: string; text: string } => {
  switch (category.toLowerCase()) {
    case 'search':
      return { bg: 'bg-blue-100', text: 'text-blue-800' };
    case 'sort':
      return { bg: 'bg-green-100', text: 'text-green-800' };
    case 'graph':
      return { bg: 'bg-purple-100', text: 'text-purple-800' };
    case 'data structure':
      return { bg: 'bg-orange-100', text: 'text-orange-800' };
    default:
      return { bg: 'bg-gray-200', text: 'text-gray-800' };
  }
};

/**
 * Generate a code snippet with syntax highlighting classes
 * Note: This is a simple implementation. In a real app,
 * you'd use libraries like Prism.js or highlight.js
 */
export const formatCodeSnippet = (code: string): string => {
  // In a real implementation, this would apply syntax highlighting
  return code;
};

/**
 * Extract key points from algorithm description
 */
export const extractKeyPoints = (description: string): string[] => {
  // Simple implementation that splits by periods and filters out short sentences
  return description
    .split('.')
    .map(s => s.trim())
    .filter(s => s.length > 20)
    .map(s => s + '.');
};

/**
 * Compare two algorithms by their average time complexity (simplified)
 */
export const compareAlgorithms = (a: { timeComplexity: string }, b: { timeComplexity: string }): number => {
  const complexityOrder: Record<string, number> = {
    'O(1)': 1,
    'O(log n)': 2,
    'O(n)': 3,
    'O(n log n)': 4,
    'O(n²)': 5,
    'O(2^n)': 6,
    'O(n!)': 7
  };

  // Extract the primary complexity (ignoring "average", "worst case", etc.)
  const getMainComplexity = (complexity: string): number => {
    for (const [key, value] of Object.entries(complexityOrder)) {
      if (complexity.includes(key)) {
        return value;
      }
    }
    return 99; // Unknown complexity
  };

  return getMainComplexity(a.timeComplexity) - getMainComplexity(b.timeComplexity);
};
