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
    case 'dynamic programming':
      return { bg: 'bg-amber-100', text: 'text-amber-800' };
    case 'greedy':
      return { bg: 'bg-rose-100', text: 'text-rose-800' };
    default:
      return { bg: 'bg-gray-200', text: 'text-gray-800' };
  }
};

// Import algorithm implementations
import { binarySearchImplementations, binarySearchRelatedProblems, binarySearchUseCases } from '../algorithms/binary-search/implementations';
import { quickSortImplementations, quickSortRelatedProblems, quickSortUseCases } from '../algorithms/quick-sort/implementations';
import { dijkstraImplementations, dijkstraRelatedProblems, dijkstraUseCases } from '../algorithms/dijkstra/implementations';
import { heapSortImplementations, heapSortRelatedProblems, heapSortUseCases } from '../algorithms/heap-sort/implementations';
import { mergeSortImplementations, mergeSortRelatedProblems, mergeSortUseCases } from '../algorithms/merge-sort/implementations';
import { breadthFirstSearchImplementations, breadthFirstSearchRelatedProblems, breadthFirstSearchUseCases } from '../algorithms/breadth-first-search/implementations';
import { linkedListImplementations, linkedListRelatedProblems, linkedListUseCases } from '../algorithms/linked-list/implementations';
import { depthFirstSearchImplementations, depthFirstSearchRelatedProblems, depthFirstSearchUseCases } from '../algorithms/depth-first-search/implementations';
import { hashTableImplementations, hashTableRelatedProblems, hashTableUseCases } from '../algorithms/hash-table/implementations';

// Map algorithm IDs to their implementations
export const algorithmImplementationsMap: Record<string, any> = {
  'binary-search': {
    implementations: binarySearchImplementations,
    relatedProblems: binarySearchRelatedProblems,
    useCases: binarySearchUseCases
  },
  'quick-sort': {
    implementations: quickSortImplementations,
    relatedProblems: quickSortRelatedProblems,
    useCases: quickSortUseCases
  },
  'dijkstra': {
    implementations: dijkstraImplementations,
    relatedProblems: dijkstraRelatedProblems,
    useCases: dijkstraUseCases
  },
  'heap-sort': {
    implementations: heapSortImplementations,
    relatedProblems: heapSortRelatedProblems,
    useCases: heapSortUseCases
  },
  'merge-sort': {
    implementations: mergeSortImplementations,
    relatedProblems: mergeSortRelatedProblems,
    useCases: mergeSortUseCases
  },
  'breadth-first-search': {
    implementations: breadthFirstSearchImplementations,
    relatedProblems: breadthFirstSearchRelatedProblems,
    useCases: breadthFirstSearchUseCases
  },
  'linked-list': {
    implementations: linkedListImplementations,
    relatedProblems: linkedListRelatedProblems,
    useCases: linkedListUseCases
  },
  'depth-first-search': {
    implementations: depthFirstSearchImplementations,
    relatedProblems: depthFirstSearchRelatedProblems,
    useCases: depthFirstSearchUseCases
  },
  'hash-table': {
    implementations: hashTableImplementations,
    relatedProblems: hashTableRelatedProblems,
    useCases: hashTableUseCases
  }
};

// Function to get algorithm animation component based on ID
export const getAlgorithmAnimation = (algorithmId: string) => {
  switch (algorithmId) {
    case 'binary-search':
      return {
        title: 'Binary Search Animation',
        description: 'This animation demonstrates how binary search iteratively halves the search space until it locates the target element.'
      };
    case 'quick-sort':
      return {
        title: 'Quick Sort Animation',
        description: 'This animation shows the partitioning and divide-and-conquer process of the quick sort algorithm.'
      };
    case 'dijkstra':
      return {
        title: 'Dijkstra Algorithm Animation',
        description: 'This animation visualizes how Dijkstra\'s algorithm finds the shortest path in a weighted graph.'
      };
    case 'heap-sort':
      return {
        title: 'Heap Sort Animation',
        description: 'This animation shows the process of building a max heap and then extracting elements one by one to create a sorted array.'
      };
    case 'merge-sort':
      return {
        title: 'Merge Sort Animation',
        description: 'This animation demonstrates the divide-and-conquer approach of merge sort, splitting the array into subarrays and merging them in sorted order.'
      };
    case 'breadth-first-search':
      return {
        title: 'Breadth-First Search Animation',
        description: 'This animation demonstrates how BFS explores a graph level by level, visiting all nodes at the current depth before moving to nodes at the next depth.'
      };
    default:
      return null;
  }
};

// Get time complexity descriptions
export const getTimeComplexityDetails = (algorithmId: string) => {
  const complexityDetails: Record<string, { best: string, average: string, worst: string }> = {
    'binary-search': {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)'
    },
    'quick-sort': {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)'
    },
    'dijkstra': {
      best: 'O((V + E) log V)',
      average: 'O((V + E) log V)',
      worst: 'O((V + E) log V)'
    },
    'heap-sort': {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    'merge-sort': {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    'breadth-first-search': {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)'
    }
  };

  return complexityDetails[algorithmId] || { best: '-', average: '-', worst: '-' };
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
