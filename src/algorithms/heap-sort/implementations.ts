export const heapSortImplementations = {
  c: `
void heapify(int arr[], int n, int i) {
  int largest = i;   // Initialize largest as root
  int left = 2 * i + 1; 
  int right = 2 * i + 2;
  
  // If left child is larger than root
  if (left < n && arr[left] > arr[largest])
    largest = left;
  
  // If right child is larger than largest so far
  if (right < n && arr[right] > arr[largest])
    largest = right;
  
  // If largest is not root
  if (largest != i) {
    // Swap i and largest
    int temp = arr[i];
    arr[i] = arr[largest];
    arr[largest] = temp;
    
    // Recursively heapify the affected sub-tree
    heapify(arr, n, largest);
  }
}

// Main function to do heap sort
void heapSort(int arr[], int n) {
  // Build heap (rearrange array)
  for (int i = n / 2 - 1; i >= 0; i--)
    heapify(arr, n, i);
  
  // Extract elements from heap one by one
  for (int i = n - 1; i > 0; i--) {
    // Move current root to end
    int temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    
    // Call max heapify on the reduced heap
    heapify(arr, i, 0);
  }
}
`,

  cpp: `
void heapify(vector<int>& arr, int n, int i) {
  int largest = i;       // Initialize largest as root
  int left = 2 * i + 1;  // left child
  int right = 2 * i + 2; // right child
  
  // If left child is larger than root
  if (left < n && arr[left] > arr[largest])
    largest = left;
  
  // If right child is larger than largest so far
  if (right < n && arr[right] > arr[largest])
    largest = right;
  
  // If largest is not root
  if (largest != i) {
    swap(arr[i], arr[largest]);
    
    // Recursively heapify the affected sub-tree
    heapify(arr, n, largest);
  }
}

// Main function to do heap sort
void heapSort(vector<int>& arr) {
  int n = arr.size();
  
  // Build heap (rearrange array)
  for (int i = n / 2 - 1; i >= 0; i--)
    heapify(arr, n, i);
  
  // One by one extract an element from heap
  for (int i = n - 1; i > 0; i--) {
    // Move current root to end
    swap(arr[0], arr[i]);
    
    // Call max heapify on the reduced heap
    heapify(arr, i, 0);
  }
}
`,

  python: `
def heapify(arr, n, i):
    # Initialize largest as root
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    # See if left child of root exists and is greater than root
    if left < n and arr[left] > arr[largest]:
        largest = left
    
    # See if right child of root exists and is greater than root
    if right < n and arr[right] > arr[largest]:
        largest = right
    
    # Change root if needed
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]  # swap
        
        # Heapify the root
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)
    
    # Build a maxheap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    
    # One by one extract elements
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]  # swap
        heapify(arr, i, 0)
    
    return arr
`,

  java: `
public static void heapSort(int[] arr) {
    int n = arr.length;
    
    // Build heap (rearrange array)
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    
    // One by one extract an element from heap
    for (int i = n - 1; i > 0; i--) {
        // Move current root to end
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        
        // Call max heapify on the reduced heap
        heapify(arr, i, 0);
    }
}

// To heapify a subtree rooted with node i which is an index in arr[]
private static void heapify(int[] arr, int n, int i) {
    int largest = i;  // Initialize largest as root
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    // If left child is larger than root
    if (left < n && arr[left] > arr[largest])
        largest = left;
    
    // If right child is larger than largest so far
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    // If largest is not root
    if (largest != i) {
        int swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;
        
        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest);
    }
}
`
};

export const heapSortRelatedProblems = [
  {
    id: "215",
    platform: "leetcode",
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/kth-largest-element-in-an-array/"
  },
  {
    id: "347",
    platform: "leetcode",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/top-k-frequent-elements/"
  },
  {
    id: "703",
    platform: "leetcode",
    title: "Kth Largest Element in a Stream",
    difficulty: "Easy",
    url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/"
  },
  {
    id: "295",
    platform: "leetcode",
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    url: "https://leetcode.com/problems/find-median-from-data-stream/"
  }
];

export const heapSortUseCases = [
  {
    title: "Priority Queues",
    description: "Heap Sort is the underlying mechanism for priority queue implementation, essential for operating systems, job scheduling, and network routing."
  },
  {
    title: "External Sorting",
    description: "When dealing with large datasets that don't fit into memory, heapsort is used as a component in efficient external sorting algorithms."
  },
  {
    title: "K-way Merging",
    description: "Heap sort is used to efficiently merge k sorted arrays by using a min-heap to track the smallest element across arrays."
  },
  {
    title: "Graph Algorithms",
    description: "In Dijkstra's and Prim's algorithms, heaps are used to efficiently select the next vertex with minimum distance or weight."
  }
];
