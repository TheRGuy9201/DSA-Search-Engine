// Clear API cache utility
export const clearApiCache = () => {
  // Clear all items from localStorage that start with cache keys
  const keysToRemove = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.startsWith('leetcode-') || 
      key.startsWith('codeforces-') || 
      key.startsWith('all-solved:')
    )) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log(`Cleared ${keysToRemove.length} cache entries`);
  return keysToRemove.length;
};

// Add to window for debugging
if (typeof window !== 'undefined') {
  (window as any).clearApiCache = clearApiCache;
}
