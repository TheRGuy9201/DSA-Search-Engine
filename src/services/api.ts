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
// CRITICAL: Make sure all IDs are string primitives to avoid "Cannot convert object to primitive value" errors
const mockAlgorithms: Algorithm[] = [
  {
    id: String('binary-search'),
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
    implementation: `class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  
  insertFront(data) {
    const newNode = new Node(data);
    newNode.next = this.head;
    this.head = newNode;
  }
  
  printList() {
    let current = this.head;
    while (current !== null) {
      console.log(current.data);
      current = current.next;
    }
  }
}`,
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
    implementation: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  
  while (queue.length > 0) {
    const vertex = queue.shift();
    console.log(vertex);
    
    for (const neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
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
    implementation: `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}`,
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
    implementation: `class HashTable {
  constructor(size = 53) {
    this.keyMap = new Array(size);
  }

  _hash(key) {
    let total = 0;
    let WEIRD_PRIME = 31;
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      let char = key[i];
      let value = char.charCodeAt(0) - 96;
      total = (total * WEIRD_PRIME + value) % this.keyMap.length;
    }
    return total;
  }

  set(key, value) {
    let index = this._hash(key);
    if (!this.keyMap[index]) {
      this.keyMap[index] = [];
    }
    this.keyMap[index].push([key, value]);
  }

  get(key) {
    let index = this._hash(key);
    if (this.keyMap[index]) {
      for (let i = 0; i < this.keyMap[index].length; i++) {
        if (this.keyMap[index][i][0] === key) {
          return this.keyMap[index][i][1];
        }
      }
    }
    return undefined;
  }
}`,
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

    // CRITICAL: Ensure all IDs are primitive strings to prevent "Cannot convert object to primitive value" errors
    const algorithms = mockAlgorithms.map(algo => {
      // Handle any potential edge cases
      let safeId;
      try {
        if (algo.id === undefined || algo.id === null) {
          console.error('Encountered algorithm with missing id', algo);
          safeId = `unknown-${Math.random().toString(36).substring(7)}`;
        } else if (typeof algo.id === 'object') {
          console.error('Encountered algorithm with object id', algo);
          safeId = `unknown-${Math.random().toString(36).substring(7)}`;
        } else {
          safeId = String(algo.id);
        }
      } catch (error) {
        console.error('Error converting algorithm ID to string', error);
        safeId = `unknown-${Math.random().toString(36).substring(7)}`;
      }

      return {
        ...algo,
        id: safeId // Ensure ID is always a primitive string
      };
    });

    if (!searchTerm) {
      return algorithms;
    }

    const term = searchTerm.toLowerCase();
    return algorithms.filter(algo =>
      algo.name.toLowerCase().includes(term) ||
      algo.category.toLowerCase().includes(term) ||
      algo.description.toLowerCase().includes(term) ||
      algo.timeComplexity.toLowerCase().includes(term)
    );
  },

  // Get a single algorithm by ID
  getAlgorithmById: async (id: string): Promise<Algorithm | undefined> => {
    await delay(300); // Simulate network delay
    
    try {
      // CRITICAL: Convert search ID to string for reliable comparison
      const searchId = String(id);
      console.log(`Looking for algorithm with ID: "${searchId}"`);
      
      // Find algorithm by comparing string representations
      const algorithm = mockAlgorithms.find(algo => {
        const algoId = String(algo.id);
        const match = algoId === searchId;
        if (match) {
          console.log(`Found match: ${algoId} === ${searchId}`);
        }
        return match;
      });
      
      // Ensure the ID is a string in the returned object
      if (algorithm) {
        return { 
          ...algorithm, 
          id: String(algorithm.id) // Force ID to be a string 
        };
      }
      
      console.log(`No algorithm found with ID: "${searchId}"`);
      return undefined;
    } catch (error) {
      console.error('Error in getAlgorithmById:', error);
      return undefined;
    }
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
