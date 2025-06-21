export const quickSortImplementations = {
  c: `
void swap(int* a, int* b) {
  int t = *a;
  *a = *b;
  *b = t;
}

int partition(int arr[], int low, int high) {
  int pivot = arr[high];
  int i = (low - 1);
  
  for (int j = low; j <= high - 1; j++) {
    if (arr[j] < pivot) {
      i++;
      swap(&arr[i], &arr[j]);
    }
  }
  swap(&arr[i + 1], &arr[high]);
  return (i + 1);
}

void quickSort(int arr[], int low, int high) {
  if (low < high) {
    int pi = partition(arr, low, high);
    
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}
`,

  cpp: `
void quickSort(vector<int>& arr, int low, int high) {
  if (low < high) {
    // Choose pivot, here we use the last element
    int pivot = arr[high];
    
    // Index of smaller element
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
      // If current element is smaller than the pivot
      if (arr[j] < pivot) {
        i++;
        swap(arr[i], arr[j]);
      }
    }
    
    // Place pivot in its correct position
    swap(arr[i + 1], arr[high]);
    int pi = i + 1;
    
    // Recursively sort elements
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}
`,

  python: `
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

# Alternative implementation with in-place sorting
def quick_sort_inplace(arr, low, high):
    if low < high:
        # Find pivot element
        pivot_index = partition(arr, low, high)
        
        # Recursively sort elements before and after partition
        quick_sort_inplace(arr, low, pivot_index - 1)
        quick_sort_inplace(arr, pivot_index + 1, high)
    
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
`,

  java: `
public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        // Find pivot element
        int pivotIndex = partition(arr, low, high);
        
        // Recursively sort elements before and after pivot
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
}

private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1; // Index of smaller element
    
    for (int j = low; j < high; j++) {
        // If current element is smaller than pivot
        if (arr[j] < pivot) {
            i++;
            // Swap arr[i] and arr[j]
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    // Swap arr[i+1] and arr[high] (pivot)
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    
    return i + 1;
}
`
};

export const quickSortRelatedProblems = [
  {
    id: "912",
    platform: "leetcode",
    title: "Sort an Array",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/sort-an-array/"
  },
  {
    id: "215",
    platform: "leetcode",
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/kth-largest-element-in-an-array/"
  },
  {
    id: "75",
    platform: "leetcode",
    title: "Sort Colors",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/sort-colors/"
  },
  {
    id: "148C",
    platform: "codeforces",
    title: "Sort an Array",
    difficulty: "Medium",
    url: "https://codeforces.com/contest/1480/problem/C"
  }
];

export const quickSortUseCases = [
  {
    title: "In-place Sorting of Large Datasets",
    description: "QuickSort is particularly efficient for large datasets that need to be sorted in-place, saving memory resources."
  },
  {
    title: "System Sorting Libraries",
    description: "Many programming language standard libraries implement QuickSort (or variants) as their default sorting algorithm due to its average-case efficiency."
  },
  {
    title: "Data Analytics & Processing",
    description: "When analyzing large datasets, QuickSort provides efficient sorting capabilities for preparing data for further analysis or visualization."
  },
  {
    title: "Real-time Applications",
    description: "In scenarios where sorting speed is critical (like real-time applications), QuickSort's average O(n log n) performance makes it a preferred choice."
  }
];
