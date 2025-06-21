export const binarySearchImplementations = {
  c: `
int binarySearch(int arr[], int left, int right, int target) {
  while (left <= right) {
    int mid = left + (right - left) / 2;
    
    // Check if target is present at mid
    if (arr[mid] == target)
      return mid;
    
    // If target greater, ignore left half
    if (arr[mid] < target)
      left = mid + 1;
    
    // If target is smaller, ignore right half
    else
      right = mid - 1;
  }
  
  // Element not present
  return -1;
}
`,

  cpp: `
int binarySearch(vector<int>& nums, int target) {
  int left = 0;
  int right = nums.size() - 1;
  
  while (left <= right) {
    int mid = left + (right - left) / 2;
    
    if (nums[mid] == target)
      return mid;
    
    if (nums[mid] < target)
      left = mid + 1;
    else
      right = mid - 1;
  }
  
  return -1;
}
`,

  python: `
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        # Check if target is present at mid
        if arr[mid] == target:
            return mid
        
        # If target is greater, ignore left half
        elif arr[mid] < target:
            left = mid + 1
        
        # If target is smaller, ignore right half
        else:
            right = mid - 1
    
    # Element is not present
    return -1
`,

  java: `
public static int binarySearch(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        // Check if target is present at mid
        if (arr[mid] == target)
            return mid;
        
        // If target greater, ignore left half
        if (arr[mid] < target)
            left = mid + 1;
        
        // If target is smaller, ignore right half
        else
            right = mid - 1;
    }
    
    // Element is not found
    return -1;
}
`
};

export const binarySearchRelatedProblems = [
  {
    id: "704",
    platform: "leetcode",
    title: "Binary Search",
    difficulty: "Easy",
    url: "https://leetcode.com/problems/binary-search/"
  },
  {
    id: "35",
    platform: "leetcode",
    title: "Search Insert Position",
    difficulty: "Easy",
    url: "https://leetcode.com/problems/search-insert-position/"
  },
  {
    id: "74",
    platform: "leetcode",
    title: "Search a 2D Matrix",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/search-a-2d-matrix/"
  },
  {
    id: "4B",
    platform: "codeforces",
    title: "Binary Search",
    difficulty: "Medium",
    url: "https://codeforces.com/edu/course/2/lesson/6/1/practice/contest/283911/problem/B"
  }
];

export const binarySearchUseCases = [
  {
    title: "Database Indexing",
    description: "Binary search is extensively used in database systems to efficiently locate records in sorted indices, dramatically improving query performance."
  },
  {
    title: "Dictionary Lookup",
    description: "When searching for words in a dictionary or any sorted list, binary search allows for quick lookups by repeatedly dividing the search space."
  },
  {
    title: "Debugging & Log Analysis",
    description: "When pinpointing bugs in large codebases or analyzing large log files, binary search can help identify exactly when a problem was introduced."
  },
  {
    title: "Machine Learning",
    description: "In decision trees and other algorithms, binary search principles help efficiently partition data and locate optimal splitting points."
  }
];
