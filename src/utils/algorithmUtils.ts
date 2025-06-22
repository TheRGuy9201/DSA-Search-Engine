import React from 'react';
import { QuickSortAnimation } from '../components/animations/QuickSortAnimation';
import { BinarySearchAnimation } from '../components/animations/BinarySearchAnimation';
import { BFSAnimation } from '../components/animations/BFSAnimation';
import { DFSAnimation } from '../components/animations/DFSAnimation';
import { LinkedListAnimation } from '../components/animations/LinkedListAnimation';
import { MergeSortAnimation } from '../components/animations/MergeSortAnimation';
import { HashTableAnimation } from '../components/animations/HashTableAnimation';
import { HeapSortAnimation } from '../components/animations/HeapSortAnimation';
import { KMPAnimation } from '../components/animations/KMPAnimation';

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
    case 'string':
      return { bg: 'bg-pink-100', text: 'text-pink-800' };
    case 'union find':
      return { bg: 'bg-cyan-100', text: 'text-cyan-800' };
    case 'pathfinding':
      return { bg: 'bg-indigo-100', text: 'text-indigo-800' };
    default:
      return { bg: 'bg-gray-200', text: 'text-gray-800' };
  }
};

// Import algorithm implementations
import { binarySearchImplementations, binarySearchRelatedProblems, binarySearchUseCases } from '../algorithms/binary-search/implementations';
import { quickSortImplementations, quickSortRelatedProblems, quickSortUseCases } from '../algorithms/quick-sort/implementations';
import { heapSortImplementations, heapSortRelatedProblems, heapSortUseCases } from '../algorithms/heap-sort/implementations';
import { mergeSortImplementations, mergeSortRelatedProblems, mergeSortUseCases } from '../algorithms/merge-sort/implementations';
import { breadthFirstSearchImplementations, breadthFirstSearchRelatedProblems, breadthFirstSearchUseCases } from '../algorithms/breadth-first-search/implementations';
import { linkedListImplementations, linkedListRelatedProblems, linkedListUseCases } from '../algorithms/linked-list/implementations';
import { depthFirstSearchImplementations, depthFirstSearchRelatedProblems, depthFirstSearchUseCases } from '../algorithms/depth-first-search/implementations';
import { hashTableImplementations, hashTableRelatedProblems, hashTableUseCases } from '../algorithms/hash-table/implementations';
import { kmpImplementations, kmpRelatedProblems, kmpUseCases } from '../algorithms/kmp-algorithm/implementations';

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
  },
  'breadth-first-search': {
    component: BFSAnimation,
    title: 'Breadth-First Search Visualization',
    description: 'Observe how BFS explores a graph by visiting all neighbors of a node before moving to the next level. The blue node is currently being explored, orange nodes are in the queue waiting to be visited, and green nodes have been fully explored.'
  },
  'depth-first-search': {
    component: DFSAnimation,
    title: 'Depth-First Search Visualization',
    description: 'Watch how DFS explores a graph by following a path as far as possible before backtracking. The amber node is currently being explored, purple nodes are in the stack waiting to be visited, and green nodes have been fully explored.'
  },  'linked-list': {
    component: LinkedListAnimation,
    title: 'Linked List Operations Visualization',
    description: 'Explore how linked list operations work through this interactive visualization. Insert new nodes at the end of the list, delete nodes from the beginning, and traverse the entire list to see how pointers connect each node to the next one.'
  },
  'merge-sort': {
    component: MergeSortAnimation,
    title: 'Merge Sort Visualization',
    description: 'Visualize how Merge Sort divides the array into halves, sorts each half recursively, and then merges the sorted halves to produce a fully sorted array. See the divide-and-conquer approach in action with stable sorting capabilities.'  },'heap-sort': {
    component: HeapSortAnimation,
    title: 'Heap Sort Visualization',
    description: 'Watch how Heap Sort builds a max-heap data structure and repeatedly extracts the maximum element to create a sorted array in ascending order.'
  },
  'hash-table': {
    component: HashTableAnimation,
    title: 'Hash Table Visualization',
    description: 'Explore how hash tables work with collision resolution using chaining. See how items are inserted, looked up, and deleted based on their hash values.'
  },
  'dynamic-programming': {
    component: BinarySearchAnimation, // Using BinarySearchAnimation as a placeholder
    title: 'Dynamic Programming Visualization',
    description: 'Visualize how dynamic programming breaks down complex problems into simpler subproblems and builds up solutions by storing intermediate results.'
  },  'trie': {
    component: DFSAnimation, // Using DFSAnimation as a placeholder
    title: 'Trie Data Structure Visualization',
    description: 'Explore how a trie efficiently stores and retrieves strings, enabling fast prefix matching, autocomplete, and dictionary operations.'
  },
  'union-find': {
    component: LinkedListAnimation, // Using LinkedListAnimation as a base
    title: 'Union-Find (Disjoint Set) Visualization',
    description: 'See how the Union-Find data structure efficiently keeps track of elements partitioned into disjoint sets, with path compression and union by rank optimizations.'
  },  'kmp-algorithm': {
    component: KMPAnimation,
    title: 'KMP Pattern Matching Visualization',
    description: 'Visualize how the Knuth-Morris-Pratt algorithm efficiently finds occurrences of a pattern in a string by using a preprocessed pattern table to avoid redundant comparisons.'
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
  },  'quick-sort': {
    implementations: quickSortImplementations,
    relatedProblems: quickSortRelatedProblems.map(p => ({ 
      title: p.title, 
      link: p.url, 
      difficulty: p.difficulty 
    })),
    useCases: quickSortUseCases.map(uc => uc.description)
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
  },
  'dynamic-programming': {
    implementations: {
      'javascript': `function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo);
  return memo[n];
}`,
      'python': `def fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]`,
      'java': `public class Fibonacci {
    private Map<Integer, Integer> memo = new HashMap<>();
    
    public int fibonacci(int n) {
        if (memo.containsKey(n)) return memo.get(n);
        if (n <= 1) return n;
        
        int result = fibonacci(n-1) + fibonacci(n-2);
        memo.put(n, result);
        return result;
    }
}`
    },
    relatedProblems: [
      { title: "Longest Common Subsequence", link: "https://leetcode.com/problems/longest-common-subsequence/", difficulty: "Medium" },
      { title: "Coin Change", link: "https://leetcode.com/problems/coin-change/", difficulty: "Medium" },
      { title: "Climbing Stairs", link: "https://leetcode.com/problems/climbing-stairs/", difficulty: "Easy" },
      { title: "Knapsack Problem", link: "https://leetcode.com/problems/ones-and-zeroes/", difficulty: "Medium" },
      { title: "Maximum Subarray", link: "https://leetcode.com/problems/maximum-subarray/", difficulty: "Easy" }
    ],
    useCases: [
      "Optimization problems requiring best decisions", 
      "Resource allocation and planning", 
      "Sequence alignment in computational biology", 
      "Shortest path algorithms in networks",
      "Financial modeling and investment planning"
    ]
  },
  'trie': {
    implementations: {
      'javascript': `class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  
  insert(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }
  
  search(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) return false;
      node = node.children[char];
    }
    return node.isEndOfWord;
  }
  
  startsWith(prefix) {
    let node = this.root;
    for (let char of prefix) {
      if (!node.children[char]) return false;
      node = node.children[char];
    }
    return true;
  }
}`,
      'python': `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True
    
    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end_of_word
    
    def starts_with(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True`,
      'java': `class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isEndOfWord;
}

class Trie {
    private TrieNode root;
    
    public Trie() {
        root = new TrieNode();
    }
    
    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            if (!node.children.containsKey(c)) {
                node.children.put(c, new TrieNode());
            }
            node = node.children.get(c);
        }
        node.isEndOfWord = true;
    }
    
    public boolean search(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            if (!node.children.containsKey(c)) return false;
            node = node.children.get(c);
        }
        return node.isEndOfWord;
    }
    
    public boolean startsWith(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            if (!node.children.containsKey(c)) return false;
            node = node.children.get(c);
        }
        return true;
    }
}`
    },
    relatedProblems: [
      { title: "Implement Trie (Prefix Tree)", link: "https://leetcode.com/problems/implement-trie-prefix-tree/", difficulty: "Medium" },
      { title: "Word Search II", link: "https://leetcode.com/problems/word-search-ii/", difficulty: "Hard" },
      { title: "Design Add and Search Words Data Structure", link: "https://leetcode.com/problems/design-add-and-search-words-data-structure/", difficulty: "Medium" },
      { title: "Replace Words", link: "https://leetcode.com/problems/replace-words/", difficulty: "Medium" },
      { title: "Maximum XOR of Two Numbers in an Array", link: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/", difficulty: "Medium" }
    ],
    useCases: [
      "Autocomplete and predictive text", 
      "Spell checkers", 
      "IP routing in network routers", 
      "Word games and board games",
      "Dictionary implementations"
    ]
  },
  'union-find': {
    implementations: {
      'javascript': `class UnionFind {
  constructor(n) {
    this.parent = Array(n).fill().map((_, i) => i);
    this.rank = Array(n).fill(0);
  }
  
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }
  
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    
    if (rootX === rootY) return false;
    
    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    
    return true;
  }
  
  connected(x, y) {
    return this.find(x) === this.find(y);
  }
}`,
      'python': `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]
    
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False
        
        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        
        return True
    
    def connected(self, x, y):
        return self.find(x) == self.find(y)`,
      'java': `class UnionFind {
    private int[] parent;
    private int[] rank;
    
    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }
    
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    }
    
    public boolean union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) return false;
        
        // Union by rank
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        
        return true;
    }
    
    public boolean connected(int x, int y) {
        return find(x) == find(y);
    }
}`
    },
    relatedProblems: [
      { title: "Number of Provinces", link: "https://leetcode.com/problems/number-of-provinces/", difficulty: "Medium" },
      { title: "Redundant Connection", link: "https://leetcode.com/problems/redundant-connection/", difficulty: "Medium" },
      { title: "Accounts Merge", link: "https://leetcode.com/problems/accounts-merge/", difficulty: "Medium" },
      { title: "Graph Valid Tree", link: "https://leetcode.com/problems/graph-valid-tree/", difficulty: "Medium" },
      { title: "Satisfiability of Equality Equations", link: "https://leetcode.com/problems/satisfiability-of-equality-equations/", difficulty: "Medium" }
    ],
    useCases: [
      "Network connectivity problems", 
      "Image processing for connected components", 
      "Social network friend clusters", 
      "Detecting cycles in undirected graphs",
      "Kruskal's minimum spanning tree algorithm"
    ]  },
  'kmp-algorithm': {
    implementations: kmpImplementations,
    relatedProblems: kmpRelatedProblems.map(p => ({ 
      title: p.title, 
      link: p.url, 
      difficulty: p.difficulty 
    })),
    useCases: kmpUseCases.map(uc => uc.description)
  }
};
