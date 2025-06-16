// Type definitions
export type Algorithm = {
  id: string;
  name: string;
  category: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  implementation?: string;
  useCases?: string[];
  examples?: Example[];
};

export type Example = {
  title: string;
  code: string;
  explanation: string;
};

// Mock data - in a real app, this would come from an API
const mockAlgorithms: Algorithm[] = [
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'Search',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    description: 'A search algorithm that finds the position of a target value within a sorted array.',
    implementation: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    }
    
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Target not found
}`,
    useCases: [
      'Finding an element in a sorted array',
      'Dictionary lookup',
      'Finding routes on a map',
      'Used in many database indexing structures'
    ],
    examples: [
      {
        title: 'Find a number in a sorted array',
        code: `const arr = [1, 3, 5, 7, 9, 11, 13, 15];
const target = 7;
const result = binarySearch(arr, target);
console.log(result); // Output: 3`,
        explanation: 'The function returns 3, which is the index of 7 in the array.'
      }
    ]
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'Sort',
    timeComplexity: 'O(n log n) average, O(n²) worst case',
    spaceComplexity: 'O(log n)',
    description: 'A divide-and-conquer algorithm that works by selecting a pivot element and partitioning the array.',
    implementation: `function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;
  
  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}`,
    useCases: [
      'General purpose sorting',
      'Used in many standard library sort implementations',
      'Efficiently handling large datasets',
      'When average-case performance is important'
    ]
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    category: 'Data Structure',
    timeComplexity: 'Access: O(n), Insert: O(1)',
    spaceComplexity: 'O(n)',
    description: 'A linear data structure where each element points to the next element.',
    useCases: [
      'Implementing stacks and queues',
      'Creating dynamic memory allocation',
      'Building hash tables with chaining',
      'Representing graphs (adjacency lists)'
    ]
  },
  {
    id: 'breadth-first-search',
    name: 'Breadth-First Search (BFS)',
    category: 'Graph',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Algorithm for traversing or searching tree or graph data structures that explores all the vertices at the present depth before moving to vertices at the next depth level.',
    useCases: [
      'Shortest path in unweighted graphs',
      'Web crawlers',
      'Finding connected components',
      'Testing bipartiteness of a graph'
    ]
  },
  {
    id: 'depth-first-search',
    name: 'Depth-First Search (DFS)',
    category: 'Graph',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Algorithm for traversing or searching tree or graph data structures that explores as far as possible along each branch before backtracking.',
    useCases: [
      'Topological sorting',
      'Finding connected components',
      'Maze generation',
      'Cycle detection in graphs'
    ]
  },
  {
    id: 'hash-table',
    name: 'Hash Table',
    category: 'Data Structure',
    timeComplexity: 'Average: O(1) for search, insert, delete',
    spaceComplexity: 'O(n)',
    description: 'A data structure that implements an associative array abstract data type, a structure that can map keys to values.',
    useCases: [
      'Implementing dictionaries',
      'Database indexing',
      'Caching',
      'Symbol tables in compilers'
    ]
  }
];

// Simulate API calls with delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API service
const apiService = {
  // Get all algorithms with optional search term
  searchAlgorithms: async (searchTerm?: string): Promise<Algorithm[]> => {
    await delay(500); // Simulate network delay

    if (!searchTerm) {
      return mockAlgorithms;
    }

    const term = searchTerm.toLowerCase();
    return mockAlgorithms.filter(algo =>
      algo.name.toLowerCase().includes(term) ||
      algo.category.toLowerCase().includes(term) ||
      algo.description.toLowerCase().includes(term) ||
      algo.timeComplexity.toLowerCase().includes(term)
    );
  },

  // Get a single algorithm by ID
  getAlgorithmById: async (id: string): Promise<Algorithm | undefined> => {
    await delay(300); // Simulate network delay
    return mockAlgorithms.find(algo => algo.id === id);
  },

  // Get algorithms by category
  getAlgorithmsByCategory: async (category: string): Promise<Algorithm[]> => {
    await delay(300); // Simulate network delay
    return mockAlgorithms.filter(algo =>
      algo.category.toLowerCase() === category.toLowerCase()
    );
  }
};

export default apiService;
