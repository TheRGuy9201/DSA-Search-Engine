export const mergeSortImplementations = {
  c: `
// Merge two subarrays of arr[].
// First subarray is arr[l..m]
// Second subarray is arr[m+1..r]
void merge(int arr[], int l, int m, int r) {
  int i, j, k;
  int n1 = m - l + 1;
  int n2 = r - m;
  
  // Create temp arrays
  int L[n1], R[n2];
  
  // Copy data to temp arrays L[] and R[]
  for (i = 0; i < n1; i++)
    L[i] = arr[l + i];
  for (j = 0; j < n2; j++)
    R[j] = arr[m + 1 + j];
    
  // Merge the temp arrays back into arr[l..r]
  i = 0; // Initial index of first subarray
  j = 0; // Initial index of second subarray
  k = l; // Initial index of merged subarray
  
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    k++;
  }
  
  // Copy the remaining elements of L[], if there are any
  while (i < n1) {
    arr[k] = L[i];
    i++;
    k++;
  }
  
  // Copy the remaining elements of R[], if there are any
  while (j < n2) {
    arr[k] = R[j];
    j++;
    k++;
  }
}

// Main function that sorts arr[l..r] using merge()
void mergeSort(int arr[], int l, int r) {
  if (l < r) {
    // Same as (l+r)/2, but avoids overflow for large l and r
    int m = l + (r - l) / 2;
    
    // Sort first and second halves
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    
    merge(arr, l, m, r);
  }
}
`,

  cpp: `
void merge(vector<int>& arr, int left, int mid, int right) {
  int n1 = mid - left + 1;
  int n2 = right - mid;
  
  // Create temp arrays
  vector<int> L(n1), R(n2);
  
  // Copy data to temp arrays L[] and R[]
  for (int i = 0; i < n1; i++)
    L[i] = arr[left + i];
  for (int j = 0; j < n2; j++)
    R[j] = arr[mid + 1 + j];
    
  // Merge the temp arrays back into arr[left..right]
  int i = 0; // Initial index of first subarray
  int j = 0; // Initial index of second subarray
  int k = left; // Initial index of merged subarray
  
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    k++;
  }
  
  // Copy the remaining elements of L[], if there are any
  while (i < n1) {
    arr[k] = L[i];
    i++;
    k++;
  }
  
  // Copy the remaining elements of R[], if there are any
  while (j < n2) {
    arr[k] = R[j];
    j++;
    k++;
  }
}

// Main function that sorts arr[l..r] using merge()
void mergeSort(vector<int>& arr, int left, int right) {
  if (left < right) {
    // Same as (l+r)/2, but avoids overflow for large l and r
    int mid = left + (right - left) / 2;
    
    // Sort first and second halves
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    
    merge(arr, left, mid, right);
  }
}
`,

  python: `
def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2  # Finding the mid of the array
        L = arr[:mid]  # Dividing the array elements into 2 halves
        R = arr[mid:]
        
        merge_sort(L)  # Sorting the first half
        merge_sort(R)  # Sorting the second half
        
        i = j = k = 0
        
        # Copy data to temp arrays L[] and R[]
        while i < len(L) and j < len(R):
            if L[i] < R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1
        
        # Checking if any element was left
        while i < len(L):
            arr[k] = L[i]
            i += 1
            k += 1
        
        while j < len(R):
            arr[k] = R[j]
            j += 1
            k += 1
    
    return arr
`,

  java: `
public static void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        // Find the middle point
        int m = l + (r - l) / 2;
        
        // Sort first and second halves
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        
        // Merge the sorted halves
        merge(arr, l, m, r);
    }
}

// Merges two subarrays of arr[]
private static void merge(int[] arr, int l, int m, int r) {
    // Find sizes of two subarrays to be merged
    int n1 = m - l + 1;
    int n2 = r - m;
    
    // Create temp arrays
    int[] L = new int[n1];
    int[] R = new int[n2];
    
    // Copy data to temp arrays
    for (int i = 0; i < n1; ++i)
        L[i] = arr[l + i];
    for (int j = 0; j < n2; ++j)
        R[j] = arr[m + 1 + j];
    
    // Merge the temp arrays
    int i = 0, j = 0;
    int k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    // Copy remaining elements of L[] if any
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    // Copy remaining elements of R[] if any
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}
`
};

export const mergeSortRelatedProblems = [
  {
    id: "912",
    platform: "leetcode",
    title: "Sort an Array",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/sort-an-array/"
  },
  {
    id: "148",
    platform: "leetcode",
    title: "Sort List",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/sort-list/"
  },
  {
    id: "315",
    platform: "leetcode",
    title: "Count of Smaller Numbers After Self",
    difficulty: "Hard",
    url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/"
  },
  {
    id: "493",
    platform: "leetcode",
    title: "Reverse Pairs",
    difficulty: "Hard",
    url: "https://leetcode.com/problems/reverse-pairs/"
  }
];

export const mergeSortUseCases = [
  {
    title: "External Sorting",
    description: "When dealing with large datasets that don't fit into memory, merge sort is preferred because of its stable and predictable O(n log n) performance."
  },
  {
    title: "Inversion Count Problems",
    description: "Merge sort is used to efficiently count inversions in an array, which are pairs of elements where a larger value precedes a smaller one."
  },
  {
    title: "Linked List Sorting",
    description: "Merge sort is particularly effective for sorting linked lists, as it doesn't require random access to elements like other sorting algorithms."
  },
  {
    title: "Stable Sorting Applications",
    description: "In applications where the original order of equal elements needs to be preserved (like sorting custom objects), merge sort's stability makes it ideal."
  }
];
