import React from 'react';
import { QuickSortAnimation } from '../components/animations/QuickSortAnimation';
import { BinarySearchAnimation } from '../components/animations/BinarySearchAnimation';

// Utility functions
export const formatComplexity = (complexity: string): string => {
  return complexity;
};

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

// Animation types and mapping
interface AnimationData {
  component: React.FC;
  title: string;
  description: string;
}

// Map of algorithm IDs to their animations
const animationMap: Record<string, AnimationData> = {
  'binary-search': {
    component: BinarySearchAnimation,
    title: 'Binary Search Visualization',
    description: 'Watch how binary search efficiently finds a target value by repeatedly dividing the search range in half. The amber bar shows the target value, the indigo bar shows the current middle element being compared, and the gray bars show the active search range.'
  },
  'quick-sort': {
    component: QuickSortAnimation,
    title: 'Quick Sort Visualization',
    description: 'See how Quick Sort partitions the array around a pivot element (shown in indigo). Elements being compared are highlighted in amber, and sorted elements turn green.'
  }
};

export const getAlgorithmAnimation = (algorithmId: string): AnimationData | null => {
  return animationMap[algorithmId] || null;
};

// Algorithm implementations mapping
export interface AlgorithmData {
  implementations: Record<string, string>;
  relatedProblems: Array<{ title: string; link: string; difficulty: string }>;
  useCases: string[];
}

export const algorithmImplementationsMap: Record<string, AlgorithmData> = {  
  'binary-search': {
    implementations: binarySearchImplementations,
    relatedProblems: binarySearchRelatedProblems.map(p => ({ 
      title: p.title, 
      link: p.url, 
      difficulty: p.difficulty 
    })),
    useCases: binarySearchUseCases.map(uc => uc.description)
  },
  'quick-sort': {
    implementations: quickSortImplementations,
    relatedProblems: quickSortRelatedProblems.map(p => ({ 
      title: p.title, 
      link: p.url, 
      difficulty: p.difficulty 
    })),
    useCases: quickSortUseCases.map(uc => uc.description)
  },
  'dijkstra': {
    implementations: dijkstraImplementations,
    relatedProblems: dijkstraRelatedProblems.map(p => ({ 
      title: p.title, 
      link: p.url, 
      difficulty: p.difficulty 
    })),
    useCases: dijkstraUseCases.map(uc => uc.description)
  },
  'heap-sort': {
    implementations: heapSortImplementations,
    relatedProblems: heapSortRelatedProblems.map(p => ({ 
      title: p.title, 
      link: p.url, 
      difficulty: p.difficulty 
    })),
    useCases: heapSortUseCases.map(uc => uc.description)
  },
  'merge-sort': {
    implementations: mergeSortImplementations,
    relatedProblems: mergeSortRelatedProblems.map(p => ({ 
      title: p.title, 
      link: p.url, 
      difficulty: p.difficulty 
    })),
    useCases: mergeSortUseCases.map(uc => uc.description)
  },
  'breadth-first-search': {
    implementations: breadthFirstSearchImplementations,
    relatedProblems: breadthFirstSearchRelatedProblems.map(p => ({ 
      title: p.title, 
      link: p.url, 
      difficulty: p.difficulty 
    })),
    useCases: breadthFirstSearchUseCases.map(uc => uc.description)
  },
  'linked-list': {
    implementations: linkedListImplementations,
    relatedProblems: linkedListRelatedProblems.map(p => ({ 
      title: p.title, 
      link: p.url, 
      difficulty: p.difficulty 
    })),
    useCases: linkedListUseCases.map(uc => uc.description)
  },
  'depth-first-search': {
    implementations: depthFirstSearchImplementations,
    relatedProblems: depthFirstSearchRelatedProblems.map(p => ({ 
      title: p.title, 
      link: p.url, 
      difficulty: p.difficulty 
    })),
    useCases: depthFirstSearchUseCases.map(uc => uc.description)
  },
  'hash-table': {
    implementations: hashTableImplementations,
    relatedProblems: hashTableRelatedProblems.map(p => ({ 
      title: p.title, 
      link: p.url, 
      difficulty: p.difficulty 
    })),
    useCases: hashTableUseCases.map(uc => uc.description)
  }
};
