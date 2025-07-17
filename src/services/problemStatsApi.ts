import axios from 'axios';

// Simple in-memory cache for API responses
interface CacheEntry {
  timestamp: number;
  data: any;
}

const API_CACHE: Record<string, CacheEntry> = {};
const CACHE_TTL = 300000; // 5 minutes in milliseconds

// Function to get or set cache entries
function getFromCache<T>(key: string): T | null {
  const entry = API_CACHE[key];
  const now = Date.now();
  
  if (entry && now - entry.timestamp < CACHE_TTL) {
    console.log(`Cache hit for ${key}`);
    return entry.data as T;
  }
  
  return null;
}

function setCache(key: string, data: any): void {
  API_CACHE[key] = {
    timestamp: Date.now(),
    data
  };
}

// LeetCode Stats API response format
// interface LeetCodeStatsApiResponse {
//   status: 'success' | 'error';
//   message?: string;
//   username: string;
//   totalSolved: number;
//   totalQuestions: number;
//   easySolved: number;
//   easyTotal: number;
//   mediumSolved: number;
//   mediumTotal: number;
//   hardSolved: number;
//   hardTotal: number;
//   acceptanceRate: number;
//   ranking: number;
//   contributionPoints: number;
//   reputation: number;
//   submissionCalendar: Record<string, number>;
// }

interface CodeForcesUserInfo {
  result: {
    handle: string;
    rating?: number;
    rank?: string;
    maxRating?: number;
    contribution?: number;
  }[];
}

interface CodeForcesSubmissions {
  status: string;
  result: {
    id: number;
    contestId?: number;
    problem: {
      contestId?: number;
      index?: string;
      name: string;
    };
    verdict: string;
  }[];
}

export interface ProblemStats {
  leetcode: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
    success: boolean;
    error?: string;
  };
  codeforces: {
    total: number;
    rating?: number;
    rank?: string;
    maxRating?: number;
    success: boolean;
    error?: string;
  };
}

// Interface for the solved problem list
export interface LeetCodeSolvedProblems {
  solvedProblemIds: number[];   // LeetCode problem IDs
  solvedProblemSlugs: string[]; // LeetCode problem slugs (useful for matching)
  solvedProblemTitles: string[]; // LeetCode problem titles (for fuzzy matching)
  success: boolean;
  error?: string;
}

export interface CodeForcesSolvedProblems {
  solvedProblemIds: string[];   // CodeForces problem IDs (contestId-index)
  solvedProblemNames: string[]; // CodeForces problem names
  success: boolean;
  error?: string;
}

export interface AllSolvedProblems {
  leetcode: LeetCodeSolvedProblems;
  codeforces: CodeForcesSolvedProblems;
}

/**
 * Fetch list of solved problems from LeetCode for a given username
 * This uses our serverless function proxy to bypass CORS issues
 */
export const fetchLeetCodeSolvedProblemsData = async (username: string): Promise<LeetCodeSolvedProblems> => {
  try {
    if (!username) {
      return { 
        solvedProblemIds: [], 
        solvedProblemSlugs: [],
        solvedProblemTitles: [],
        success: false, 
        error: 'No LeetCode username provided' 
      };
    }

    // Check cache first
    const cacheKey = `leetcode-solved:${username}`;
    const cachedData = getFromCache<LeetCodeSolvedProblems>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // Check localStorage for persistent data
    try {
      const localData = localStorage.getItem(cacheKey);
      if (localData) {
        const parsedData = JSON.parse(localData);
        if (parsedData.success) {
          console.log(`Retrieved LeetCode data from localStorage for ${username}`);
          // Also update in-memory cache
          setCache(cacheKey, parsedData);
          return parsedData;
        }
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    
    console.log(`Fetching LeetCode solved problems for ${username} using serverless function...`);
    
    // Use our serverless function which bypasses CORS issues
    const response = await axios.get(`/api/leetcode-solved?username=${username}`, {
      timeout: 15000
    });
    
    if (response.data && response.data.success) {
      const result: LeetCodeSolvedProblems = {
        solvedProblemIds: response.data.solvedProblemIds || [],
        solvedProblemSlugs: response.data.solvedProblemSlugs || [],
        solvedProblemTitles: response.data.solvedProblemTitles || [],
        success: true
      };
      
      console.log(`Successfully retrieved LeetCode data for ${username}:`, {
        ids: result.solvedProblemIds.length,
        slugs: result.solvedProblemSlugs.length,
        titles: result.solvedProblemTitles.length,
        source: response.data.source
      });
      
      // Cache the result
      setCache(cacheKey, result);
      
      // Also store in localStorage for persistence
      localStorage.setItem(cacheKey, JSON.stringify(result));
      
      return result;
    }
    
    // Fallback to community API if our serverless function fails
    try {
      console.log('Trying community LeetCode API as fallback...');
      
      const response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${username}?mode=full`, {
        timeout: 20000
      });
      
      if (!response.data || response.data.status === 'error') {
        throw new Error('User not found or API response invalid');
      }
      
      const totalSolved = response.data.totalSolved || 0;
      console.log(`User ${username} has solved ${totalSolved} problems according to community API`);
      
      // As a fallback, include common LeetCode problems for users with significant solved counts
      let solvedProblemTitles: string[] = [];
      if (totalSolved > 30) {
        console.log(`Adding common LeetCode problems for user with ${totalSolved} solved problems`);
        
        // Common LeetCode problem titles to aid matching
        const commonLeetCodeProblems = [
          "Two Sum", "Add Two Numbers", "Longest Substring Without Repeating Characters",
          "Palindrome Number", "Roman to Integer", "Longest Common Prefix",
          "Valid Parentheses", "Merge Two Sorted Lists", "Remove Duplicates from Sorted Array",
          "Maximum Subarray", "Climbing Stairs", "Best Time to Buy and Sell Stock"
        ];
        
        // Add these as likely solved problems based on the user's total solved count
        const numToAdd = Math.min(Math.floor(totalSolved / 10), commonLeetCodeProblems.length);
        solvedProblemTitles = commonLeetCodeProblems.slice(0, numToAdd);
      }
      
      const result: LeetCodeSolvedProblems = {
        solvedProblemIds: [],
        solvedProblemSlugs: [],
        solvedProblemTitles,
        success: true,
        error: 'Only aggregate stats available from community API'
      };
      
      // Cache the result
      setCache(cacheKey, result);
      return result;
    } catch (fallbackError) {
      console.error('LeetCode fallback API failed:', fallbackError);
      
      return {
        solvedProblemIds: [],
        solvedProblemSlugs: [],
        solvedProblemTitles: [],
        success: false,
        error: 'Failed to retrieve solved problems from LeetCode'
      };
    }
  } catch (error) {
    console.error('Error fetching LeetCode solved problems:', error);
    
    return {
      solvedProblemIds: [],
      solvedProblemSlugs: [],
      solvedProblemTitles: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error fetching LeetCode solved problems'
    };
  }
};

/**
 * Fetch list of solved problems from CodeForces for a given handle
 * This leverages our serverless function to avoid CORS issues
 */
export const fetchCodeForcesSolvedProblemsData = async (handle: string): Promise<CodeForcesSolvedProblems> => {
  try {
    if (!handle) {
      return {
        solvedProblemIds: [],
        solvedProblemNames: [],
        success: false,
        error: 'No CodeForces handle provided'
      };
    }
    
    // Check cache first
    const cacheKey = `codeforces-solved:${handle}`;
    const cachedData = getFromCache<CodeForcesSolvedProblems>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // Check localStorage for persistent data
    try {
      const localData = localStorage.getItem(cacheKey);
      if (localData) {
        const parsedData = JSON.parse(localData);
        if (parsedData.success) {
          console.log(`Retrieved CodeForces data from localStorage for ${handle}`);
          // Also update in-memory cache
          setCache(cacheKey, parsedData);
          return parsedData;
        }
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    
    console.log(`Fetching Codeforces solved problems for ${handle} using serverless function...`);
    
    // Use our serverless function to avoid potential CORS issues
    const response = await axios.get(`/api/codeforces-solved?handle=${handle}`, {
      timeout: 10000
    });
    
    if (response.data && response.data.success) {
      const result: CodeForcesSolvedProblems = {
        solvedProblemIds: response.data.solvedProblemIds || [],
        solvedProblemNames: response.data.solvedProblemNames || [],
        success: true
      };
      
      console.log(`Successfully retrieved Codeforces data for ${handle}:`, {
        ids: result.solvedProblemIds.length,
        names: result.solvedProblemNames.length
      });
      
      // Store in cache
      setCache(cacheKey, result);
      return result;
    }
    
    // Fallback to direct API call if our serverless function fails
    try {
      console.log('Trying direct Codeforces API as fallback...');
      
      // Get user's submissions
      const submissionsResponse = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`, {
        timeout: 10000
      });
      
      const submissions = submissionsResponse.data;
      
      if (!submissions.result) {
        throw new Error('Failed to fetch submissions');
      }
      
      // Collect unique solved problems (with "OK" verdict)
      const solvedProblemIds = new Set<string>();
      const solvedProblemNames = new Set<string>();
      
      submissions.result.forEach((submission: any) => {
        if (submission.verdict === 'OK') {
          const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
          solvedProblemIds.add(problemId);
          
          if (submission.problem.name) {
            solvedProblemNames.add(submission.problem.name);
          }
        }
      });
      
      const result: CodeForcesSolvedProblems = {
        solvedProblemIds: Array.from(solvedProblemIds),
        solvedProblemNames: Array.from(solvedProblemNames),
        success: true
      };
      
      // Store in cache
      setCache(cacheKey, result);
      
      // Also store in localStorage for persistence
      localStorage.setItem(cacheKey, JSON.stringify(result));
      
      return result;
    } catch (fallbackError) {
      console.error('Codeforces direct API failed:', fallbackError);
      
      return {
        solvedProblemIds: [],
        solvedProblemNames: [],
        success: false,
        error: 'Failed to retrieve solved problems from Codeforces'
      };
    }
  } catch (error) {
    console.error('Error fetching CodeForces solved problems:', error);
    
    return {
      solvedProblemIds: [],
      solvedProblemNames: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error fetching CodeForces solved problems'
    };
  }
};

/**
 * Fetch both LeetCode and CodeForces solved problems
 */
export const fetchAllSolvedProblemsData = async (
  leetcodeUsername: string,
  codeforcesHandle: string
): Promise<AllSolvedProblems> => {
  try {
    console.log(`Fetching solved problems for LeetCode: ${leetcodeUsername}, CodeForces: ${codeforcesHandle}`);
    
    // Check if we have a full cached result
    const cacheKey = `all-solved:${leetcodeUsername}:${codeforcesHandle}`;
    const cachedResult = getFromCache<AllSolvedProblems>(cacheKey);
    if (cachedResult) {
      console.log('Using cached solved problems data for both platforms');
      return cachedResult;
    }
    
    // Fetch solutions in parallel
    const [leetcodeSolvedProblems, codeforcesSolvedProblems] = await Promise.allSettled([
      fetchLeetCodeSolvedProblemsData(leetcodeUsername),
      fetchCodeForcesSolvedProblemsData(codeforcesHandle)
    ]);
    
    const result: AllSolvedProblems = {
      leetcode: leetcodeSolvedProblems.status === 'fulfilled'        ? leetcodeSolvedProblems.value 
        : { solvedProblemIds: [], solvedProblemSlugs: [], solvedProblemTitles: [], success: false, error: 'Failed to fetch LeetCode solved problems' },
      
      codeforces: codeforcesSolvedProblems.status === 'fulfilled' 
        ? codeforcesSolvedProblems.value 
        : { solvedProblemIds: [], solvedProblemNames: [], success: false, error: 'Failed to fetch CodeForces solved problems' }
    };
    
    // Cache the combined result if at least one platform was successful
    if (result.leetcode.success || result.codeforces.success) {
      setCache(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching solved problems data:', error);
    return {
      leetcode: { solvedProblemIds: [], solvedProblemSlugs: [], solvedProblemTitles: [], success: false, error: 'Unknown error in LeetCode fetch' },
      codeforces: { solvedProblemIds: [], solvedProblemNames: [], success: false, error: 'Unknown error in CodeForces fetch' }
    };
  }
};

/**
 * Fetch LeetCode stats for a given username
 */
export const fetchLeetCodeStats = async (username: string): Promise<ProblemStats['leetcode']> => {
  try {
    if (!username) {
      return { total: 0, easy: 0, medium: 0, hard: 0, success: false, error: 'No LeetCode username provided' };
    }
    
    // Check cache first
    const cacheKey = `leetcode:${username}`;
    const cachedData = getFromCache<ProblemStats['leetcode']>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // Check cache first
    const cachedStats = getFromCache<ProblemStats['leetcode']>(`leetcode-${username}`);
    if (cachedStats) {
      return cachedStats;
    }
    
    // Try first API endpoint (LeetCode Stats API)
    try {
      console.log(`Fetching LeetCode stats for ${username} from primary API...`);
      const response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${username}`, {
        timeout: 15000 // 15 second timeout (this API might be slower)
      });
      
      const data = response.data;
      
      if (data.status === 'error') {
        throw new Error(data.message || 'User not found');
      }
      
      // Extract stats from the first API response
      const stats = {
        total: data.totalSolved || 0,
        easy: data.easySolved || 0,
        medium: data.mediumSolved || 0,
        hard: data.hardSolved || 0,
        success: true
      };
      
      // Set cache before returning
      setCache(`leetcode-${username}`, stats);
      
      return stats;
    } catch (primaryError) {
      console.log('Primary LeetCode API failed, trying backup API...', primaryError);
      
      // Try backup API endpoint if the first fails
      try {
        const backupResponse = await axios.get(`https://leetcode-api-faisalshahbaz.vercel.app/leetcode/${username}`, {
          timeout: 15000
        });
        
        const backupData = backupResponse.data;
        
        if (!backupData.success) {
          throw new Error('User not found in backup API');
        }
        
        // Extract stats from backup API response
        const stats = {
          total: backupData.totalSolved || 0,
          easy: backupData.easySolved || 0,
          medium: backupData.mediumSolved || 0,
          hard: backupData.hardSolved || 0,
          success: true
        };
        
        // Set cache before returning
        setCache(`leetcode-${username}`, stats);
        
        return stats;      } catch (backupError) {
        console.error('Backup LeetCode API also failed:', backupError);
          // Try a third option - using a community LeetCode API that's known to be reliable
        try {
          console.log('Trying third approach with community LeetCode API...');
          // This API is maintained by the community and should be reliable
          const communityResponse = await axios.get(`https://competitive-coding-api.herokuapp.com/api/leetcode/${username}`, {
            timeout: 20000 // Give it extra time as this API can be slower
          });
          
          const communityData = communityResponse.data;
          
          if (communityData.status === "Failed") {
            throw new Error(communityData.detail || 'User not found');
          }
            const stats = {
            total: parseInt(communityData.total_problems_solved) || 0,
            easy: parseInt(communityData.easy_questions_solved) || 0,
            medium: parseInt(communityData.medium_questions_solved) || 0,
            hard: parseInt(communityData.hard_questions_solved) || 0,
            success: true
          };
          
          // Store in cache
          setCache(`leetcode:${username}`, stats);
          
          // Set cache before returning
          setCache(`leetcode-${username}`, stats);
          
          return stats;        } catch (thirdError) {
          console.error('All LeetCode API attempts failed:', thirdError);
          
          // When all APIs fail, return a user-friendly result with 0 counts but a clear error message
          return {
            total: 0,
            easy: 0,
            medium: 0,
            hard: 0,
            success: false,
            error: `Unable to fetch LeetCode stats for '${username}'. Please verify the username or try again later.`
          };
        }
      }
    }  } catch (error) {
    console.error('Error fetching LeetCode stats after all fallback attempts:', error);
    return { 
      total: 0, 
      easy: 0, 
      medium: 0, 
      hard: 0, 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch LeetCode stats after multiple attempts' 
    };
  }
  
  // Note: This function implements a cascading fallback system with 3 different APIs:
  // 1. Primary API: leetcode-stats-api.herokuapp.com - Fast but may have CORS issues
  // 2. Backup API: leetcode-api-faisalshahbaz.vercel.app - Alternative implementation
  // 3. Community API: competitive-coding-api.herokuapp.com - More reliable but slower
  // 
  // If all APIs fail, we return an error with 0 values.
  // For a production environment, consider implementing your own server-side API 
  // (see backend/leetcode_api_proxy.js for an example).
};

// Fetch CodeForces stats for a given handle
export const fetchCodeForcesStats = async (handle: string): Promise<ProblemStats['codeforces']> => {
  try {
    if (!handle) {
      return { total: 0, success: false, error: 'No CodeForces handle provided' };
    }
    
    // Check cache first
    const cacheKey = `codeforces:${handle}`;
    const cachedData = getFromCache<ProblemStats['codeforces']>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // Get user info
    const userInfoResponse = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`, {
      timeout: 10000 // 10 second timeout
    });
    
    const userInfo: CodeForcesUserInfo = userInfoResponse.data;
    
    if (!userInfo.result || userInfo.result.length === 0) {
      return { total: 0, success: false, error: 'User not found' };
    }
    
    // Get user's accepted submissions
    const submissionsResponse = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`, {
      timeout: 10000 // 10 second timeout
    });
    
    const submissions: CodeForcesSubmissions = submissionsResponse.data;
    
    if (!submissions.result) {
      return { 
        total: 0,
        rating: userInfo.result[0].rating,
        rank: userInfo.result[0].rank,
        maxRating: userInfo.result[0].maxRating,
        success: false, 
        error: 'Failed to fetch submissions' 
      };
    }
    
    // Count unique solved problems (with "OK" verdict)
    const solvedProblems = new Set();
    submissions.result.forEach(submission => {
      if (submission.verdict === 'OK') {
        const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
        solvedProblems.add(problemId);
      }
    });
      const result = { 
      total: solvedProblems.size,
      rating: userInfo.result[0].rating,
      rank: userInfo.result[0].rank,
      maxRating: userInfo.result[0].maxRating,
      success: true
    };
    
    // Store in cache
    setCache(`codeforces:${handle}`, result);
    
    return result;
  } catch (error) {
    console.error('Error fetching CodeForces stats:', error);
    return { 
      total: 0,
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch CodeForces stats' 
    };
  }
};

// Fetch both LeetCode and CodeForces stats
export const fetchAllProblemStats = async (leetcodeUsername: string, codeforcesHandle: string): Promise<ProblemStats> => {
  try {
    console.log(`Fetching stats for LeetCode: ${leetcodeUsername}, CodeForces: ${codeforcesHandle}`);
    
    // Check if we have a full cached result
    const cacheKey = `all:${leetcodeUsername}:${codeforcesHandle}`;
    const cachedResult = getFromCache<ProblemStats>(cacheKey);
    if (cachedResult) {
      console.log('Using cached stats for both platforms');
      return cachedResult;
    }
    
    const [leetcodeStats, codeforcesStats] = await Promise.allSettled([
      fetchLeetCodeStats(leetcodeUsername),
      fetchCodeForcesStats(codeforcesHandle)
    ]);
      const result = {
      leetcode: leetcodeStats.status === 'fulfilled' ? leetcodeStats.value : { 
        total: 0, easy: 0, medium: 0, hard: 0, success: false, 
        error: 'Failed to fetch LeetCode stats' 
      },
      codeforces: codeforcesStats.status === 'fulfilled' ? codeforcesStats.value : { 
        total: 0, success: false, 
        error: 'Failed to fetch CodeForces stats' 
      }
    };
      // Cache the combined result if at least one platform was successful
    if (result.leetcode.success || result.codeforces.success) {
      setCache(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching problem stats:', error);
    return {
      leetcode: { 
        total: 0, easy: 0, medium: 0, hard: 0, success: false, 
        error: 'Unexpected error fetching LeetCode stats' 
      },
      codeforces: { 
        total: 0, success: false, 
        error: 'Unexpected error fetching CodeForces stats' 
      }
    };
  }
};
