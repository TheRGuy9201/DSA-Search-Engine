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
  },
  // Adding new algorithms
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'Sort',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: 'A divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.',
    implementation: `function mergeSort(arr) {
  // Base case: arrays with 0 or 1 element are already sorted
  if (arr.length <= 1) return arr;
  
  // Split the array into two halves
  const mid = Math.floor(arr.length / 2);
  const leftArr = arr.slice(0, mid);
  const rightArr = arr.slice(mid);
  
  // Recursively sort both halves
  const leftSorted = mergeSort(leftArr);
  const rightSorted = mergeSort(rightArr);
  
  // Merge the sorted halves
  return merge(leftSorted, rightSorted);
}

function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  // Compare elements from both arrays and add smaller one to result
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  // Add remaining elements from either array
  return [...result, ...left.slice(leftIndex), ...right.slice(rightIndex)];
}`,
    useCases: [
      'Stable sorting of large datasets',
      'External sorting',
      'Sorting linked lists',
      'Counting inversions in an array'
    ]
  },
  {
    id: 'breadth-first-search',
    name: 'Breadth-First Search',
    category: 'Graph',
    timeComplexity: 'O(V + E) where V is vertices and E is edges',
    spaceComplexity: 'O(V)',
    description: 'A graph traversal algorithm that explores all neighbors at the present depth before moving on to nodes at the next depth level.',
    useCases: [
      'Finding shortest path in unweighted graphs',
      'Web crawlers',
      'Social networking features',
      'Garbage collection algorithms'
    ]
  },
  {
    id: 'depth-first-search',
    name: 'Depth-First Search',
    category: 'Graph',
    timeComplexity: 'O(V + E) where V is vertices and E is edges',
    spaceComplexity: 'O(V)',
    description: 'A graph traversal algorithm that explores as far as possible along each branch before backtracking.',
    useCases: [
      'Topological sorting',
      'Finding connected components',
      'Maze generation',
      'Solving puzzles with backtracking'
    ]
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    category: 'Data Structure',
    timeComplexity: 'O(1) for insertion/deletion at beginning, O(n) for access',
    spaceComplexity: 'O(n)',
    description: 'A linear data structure where elements are stored in nodes and each node points to the next node in the sequence.',
    useCases: [
      'Implementing stacks and queues',
      'Dynamic memory allocation',
      'Representing graphs (adjacency lists)',
      'Undo functionality in applications'
    ]
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra\'s Algorithm',
    category: 'Graph',
    timeComplexity: 'O(V² without heap, O(E + V log V) with binary heap',
    spaceComplexity: 'O(V)',
    description: 'A shortest-path algorithm that finds the shortest path from a source node to all other nodes in a weighted graph with positive edge weights.',
    useCases: [
      'GPS navigation systems',
      'Network routing protocols',
      'Flight scheduling',
      'Robotics path planning'
    ]
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'Sort',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    description: 'A comparison-based sorting algorithm that uses a binary heap data structure to build a max-heap and then repeatedly extracts the maximum element.',
    useCases: [
      'In-place sorting with guaranteed O(n log n) performance',
      'Priority queue implementation',
      'External sorting with limited memory',
      'Systems with real-time constraints'
    ]
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    category: 'Dynamic Programming',
    timeComplexity: 'Varies by problem',
    spaceComplexity: 'Varies by problem',
    description: 'A method for solving complex problems by breaking them down into simpler subproblems and storing the solutions to avoid redundant calculations.',
    useCases: [
      'Optimization problems',
      'Resource allocation',
      'Sequence alignment in bioinformatics',
      'Shortest path algorithms'
    ]
  },
  {
    id: 'trie',
    name: 'Trie',
    category: 'Data Structure',
    timeComplexity: 'O(m) for operations where m is key length',
    spaceComplexity: 'O(ALPHABET_SIZE * m * n) where n is number of keys',
    description: 'A tree-like data structure that stores a dynamic set of strings, with nodes representing characters and paths representing words or prefixes.',
    useCases: [
      'Autocomplete suggestions',
      'Spell checkers',
      'IP routing',
      'Word games'
    ]
  },
  {
    id: 'a-star-search',
    name: 'A* Search Algorithm',
    category: 'Pathfinding',
    timeComplexity: 'O(b^d) where b is branching factor and d is depth',
    spaceComplexity: 'O(b^d)',
    description: 'An informed search algorithm that finds the shortest path between nodes using a heuristic function to guide the search.',
    useCases: [
      'Game pathfinding',
      'Robot navigation',
      'Route planning in maps',
      'Puzzle solving'
    ]
  },
  {
    id: 'union-find',
    name: 'Union-Find',
    category: 'Union Find',
    timeComplexity: 'Nearly O(1) amortized with path compression',
    spaceComplexity: 'O(n)',
    description: 'A data structure that keeps track of elements partitioned into disjoint sets, with operations to find which set an element belongs to and merge sets.',
    useCases: [
      'Detecting cycles in undirected graphs',
      'Finding connected components',
      'Kruskal\'s algorithm for minimum spanning trees',
      'Network connectivity'
    ]
  },
  {
    id: 'kmp-algorithm',
    name: 'KMP Algorithm',
    category: 'String',
    timeComplexity: 'O(n + m) where n is text length and m is pattern length',
    spaceComplexity: 'O(m)',
    description: 'A string-matching algorithm that uses information about previous partial matches to avoid redundant character comparisons.',
    useCases: [
      'Efficient string searching',
      'Pattern matching in texts',
      'Bioinformatics for DNA pattern matching',
      'Plagiarism detection'
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
