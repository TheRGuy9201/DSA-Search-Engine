import { useState, useEffect, useCallback } from 'react';
import { fetchAllProblemStats } from '../services/problemStatsApi';
import type { ProblemStats } from '../services/problemStatsApi';
import { 
  getSolvedProblemStats, 
  defaultActivityData, 
  logActivity 
} from '../services/activityTrackingService';
import type { ActivityData } from '../services/activityTrackingService';

interface UseProblemStatsResult {
  problemStats: ProblemStats;
  activityData: ActivityData;
  isLoading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
  totalSolved: number;
  getProblemStatus: (problemId: number, source: string, problemData?: { contestId?: number; index?: string; slug?: string }) => 'Solved' | 'Attempted' | 'Not Attempted';
  updateProblemStatus: (
    problemId: number, 
    status: 'Solved' | 'Attempted' | 'Not Attempted', 
    source: string
  ) => void;
}

export const useProblemStats = (leetcodeId?: string, codeforcesId?: string): UseProblemStatsResult => {
  const [problemStats, setProblemStats] = useState<ProblemStats>({
    leetcode: { total: 0, easy: 0, medium: 0, hard: 0, success: false },
    codeforces: { total: 0, success: false }
  });
  const [activityData, setActivityData] = useState<ActivityData>(defaultActivityData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
    // Maps of solved problems would be tracked in a future implementation
  // For now we'll use local storage to track problem status
  
  /**
   * Fetch combined stats from all sources
   */
  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch raw platform API stats
      const apiStats = await fetchAllProblemStats(
        leetcodeId || '',
        codeforcesId || ''
      );
      
      setProblemStats(apiStats);
      
      // Fetch combined activity data including all platform stats
      const activityStats = await getSolvedProblemStats(
        leetcodeId,
        codeforcesId
      );
      
      setActivityData(activityStats);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch problem statistics');
      console.error('Error fetching problem stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [leetcodeId, codeforcesId]);
  
  /**
   * Get status for a specific problem
   */
  const getProblemStatus = useCallback((
    problemId: number, 
    source: string,
    problemData?: { contestId?: number; index?: string; slug?: string }
  ): 'Solved' | 'Attempted' | 'Not Attempted' => {
    // Check local storage data first for manual overrides
    const localData = localStorage.getItem('dsa-search-engine-problem-data');
    if (localData) {
      try {
        const userData = JSON.parse(localData);
        const compositeId = `${source}-${problemId}`;
        
        if (userData[compositeId]) {
          return userData[compositeId].status;
        }
      } catch (error) {
        console.error('Error parsing problem data:', error);
      }
    }
    
    // Check actual API data from cache
    try {
      if (source.toLowerCase().includes('leetcode') && leetcodeId) {
        const cacheKey = `leetcode-solved:${leetcodeId}`;
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const leetcodeData = JSON.parse(cachedData);
          if (leetcodeData.solvedProblemIds && leetcodeData.solvedProblemIds.includes(problemId)) {
            return 'Solved';
          }
        }
      }
      
      if (source.toLowerCase().includes('codeforces') && codeforcesId && problemData) {
        const cacheKey = `codeforces-solved:${codeforcesId}`;
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const codeforcesData = JSON.parse(cachedData);
          if (codeforcesData.solvedProblemIds && problemData.contestId && problemData.index) {
            const problemKey = `${problemData.contestId}-${problemData.index}`;
            if (codeforcesData.solvedProblemIds.includes(problemKey)) {
              return 'Solved';
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking cached API data:', error);
    }
    
    return 'Not Attempted';
  }, [leetcodeId, codeforcesId]);

  /**
   * Update status for a specific problem
   */
  const updateProblemStatus = useCallback((
    problemId: number,
    status: 'Solved' | 'Attempted' | 'Not Attempted',
    source: string = 'unknown'
  ): void => {
    // Generate a composite ID for the problem
    const compositeId = `${source}-${problemId}`;
    
    // Get the current status from local storage
    const localData = localStorage.getItem('dsa-search-engine-problem-data') || '{}';
    const userData = JSON.parse(localData);
    const currentStatus = userData[compositeId]?.status;
    
    // Update the status
    userData[compositeId] = {
      ...(userData[compositeId] || {}),
      status,
      bookmarked: userData[compositeId]?.bookmarked || false
    };
    
    // Save the updated status
    localStorage.setItem('dsa-search-engine-problem-data', JSON.stringify(userData));
    
    // If the problem was newly solved, log an activity
    if (status === 'Solved' && currentStatus !== 'Solved') {
      logActivity(1);
      
      // Update the activity data in memory
      setActivityData(prev => ({
        ...prev,
        totalSolved: {
          ...prev.totalSolved,
          platform: prev.totalSolved.platform + 1,
          total: prev.totalSolved.total + 1
        }
      }));
    }
  }, []);
  
  useEffect(() => {
    // Only fetch if we have at least one platform ID
    fetchStats();
  }, [fetchStats]);
  
  // Calculate total solved problems across all platforms
  const totalSolved = activityData.totalSolved.total;
    
  return {
    problemStats,
    activityData,
    isLoading,
    error,
    refreshStats: fetchStats,
    totalSolved,
    getProblemStatus,
    updateProblemStatus
  };
};
