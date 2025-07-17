import { fetchAllProblemStats } from './problemStatsApi';

// Interface for the activity data
export interface ActivityData {
  streak: number;
  lastWeek: number[]; // problems solved per day for the last 7 days
  totalSolved: {
    leetcode: number;
    codeforces: number;
    platform: number; // Problems solved on the platform itself (not via API)
    total: number;    // Sum of all solved problems
  };
}

// Default activity data
export const defaultActivityData: ActivityData = {
  streak: 0,
  lastWeek: [0, 0, 0, 0, 0, 0, 0], // problems solved per day
  totalSolved: {
    leetcode: 0,
    codeforces: 0,
    platform: 0,
    total: 0
  }
};

/**
 * Get the solved problem stats including user's activity
 * @param leetcodeId LeetCode username
 * @param codeforcesId CodeForces username
 * @returns Promise with activity data
 */
export const getSolvedProblemStats = async (
  leetcodeId: string | undefined, 
  codeforcesId: string | undefined
): Promise<ActivityData> => {
  try {
    // Get stats from LeetCode and CodeForces APIs
    const externalStats = await fetchAllProblemStats(
      leetcodeId || '',
      codeforcesId || ''
    );
    
    // Get platform-solved problems from localStorage
    const localData = localStorage.getItem('dsa-search-engine-problem-data');
    let platformSolvedCount = 0;
    
    if (localData) {
      try {
        const userData = JSON.parse(localData);
        // Count problems marked as 'Solved' in localStorage
        platformSolvedCount = Object.values(userData).filter(
          (item: any) => item.status === 'Solved'
        ).length;
      } catch (e) {
        console.error('Error parsing local problem data:', e);
      }
    }
      // Get weekly activity data
    const weekActivity = getWeekActivity();
    
    // Current streak (calculated based on activity log)
    const streak = calculateStreak();

    // Calculate total solved across all platforms
    const leetcodeSolved = externalStats.leetcode.success ? externalStats.leetcode.total : 0;
    const codeforcesSolved = externalStats.codeforces.success ? externalStats.codeforces.total : 0;
    const totalSolved = leetcodeSolved + codeforcesSolved + platformSolvedCount;
    
    return {
      streak,
      lastWeek: weekActivity,
      totalSolved: {
        leetcode: leetcodeSolved,
        codeforces: codeforcesSolved,
        platform: platformSolvedCount,
        total: totalSolved
      }
    };
  } catch (error) {
    console.error('Error getting solved problem stats:', error);
    return defaultActivityData;
  }
};

/**
 * Get the weekly activity from localStorage
 * @returns Array of problem counts for the last 7 days
 */
export const getWeekActivity = (): number[] => {
  try {
    // Get activity log from localStorage
    const activityLog = localStorage.getItem('dsa-activity-log');
    if (!activityLog) {
      return [0, 0, 0, 0, 0, 0, 0];
    }
    
    const log = JSON.parse(activityLog);
    const now = new Date();
    const weekActivity = [0, 0, 0, 0, 0, 0, 0];
    
    // Fill in the last 7 days of activity
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = formatDate(date);
      
      // Read from right to left (today is the last element)
      weekActivity[6 - i] = log[dateKey] || 0;
    }
    
    return weekActivity;
  } catch (e) {
    console.error('Error getting weekly activity:', e);
    return [0, 0, 0, 0, 0, 0, 0];
  }
};

/**
 * Calculate streak from activity log
 * @returns Current streak count
 */
export const calculateStreak = (): number => {
  try {
    // Get activity log from localStorage for full history
    const activityLog = localStorage.getItem('dsa-activity-log');
    if (!activityLog) {
      return 0;
    }
    
    const log = JSON.parse(activityLog);
    const now = new Date();
    let streak = 0;
    
    // Check if there's activity today
    const today = formatDate(now);
    if (!log[today] || log[today] === 0) {
      // Check if there was activity yesterday
      now.setDate(now.getDate() - 1);
      const yesterday = formatDate(now);
      
      if (!log[yesterday] || log[yesterday] === 0) {
        // No activity today or yesterday, streak is 0
        return 0;
      }
    }
    
    // Calculate streak by checking consecutive days with activity
    for (let i = 0; ; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = formatDate(date);
      
      if (log[dateKey] && log[dateKey] > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  } catch (e) {
    console.error('Error calculating streak:', e);
    return 0;
  }
};

/**
 * Format a date as YYYY-MM-DD for activity logging
 * @param date Date object
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
};

/**
 * Log an activity (problem solved) for today
 * @param count Number of problems to log (default: 1)
 */
export const logActivity = (count: number = 1): void => {
  try {
    const activityLog = localStorage.getItem('dsa-activity-log') || '{}';
    const log = JSON.parse(activityLog);
    
    const today = formatDate(new Date());
    log[today] = (log[today] || 0) + count;
    
    localStorage.setItem('dsa-activity-log', JSON.stringify(log));
  } catch (e) {
    console.error('Error logging activity:', e);
  }
};

/**
 * Gets combined solved status for a problem, checking both local storage and external APIs
 * Enhanced with better matching algorithms between our problems and external platform problems
 * 
 * @param problemId Problem ID
 * @param source Problem source (LeetCode or Codeforces)
 * @param externalSolvedProblems Optional object with external solved problems data
 * @param problem Optional problem object with additional details like slug/title
 * @returns Problem status string
 */
export const getCombinedProblemStatus = (
  problemId: number,
  source: string = 'unknown',
  externalSolvedProblems?: any,
  problem?: any
): 'Solved' | 'Attempted' | 'Not Attempted' => {
  // First check local storage
  const problemData = localStorage.getItem('dsa-search-engine-problem-data');
  const compositeId = `${source}-${problemId}`;
  
  if (problemData) {
    try {
      const userData = JSON.parse(problemData);
      if (userData[compositeId]?.status === 'Solved') {
        return 'Solved';
      }
      if (userData[compositeId]?.status === 'Attempted') {
        return 'Attempted';
      }
    } catch (e) {
      console.error('Error parsing problem data:', e);
    }
  }
  
  // Then check external data if provided
  if (externalSolvedProblems) {
    const normalizedSource = source.toLowerCase();
    
    // Debug logging to help troubleshoot
    console.debug(`Checking problem status: ID=${problemId}, Source=${source}, Title=${problem?.title}`);
    
    // Check LeetCode problems
    if (normalizedSource.includes('leetcode') && externalSolvedProblems.leetcode?.success) {
      console.debug(`LeetCode API returned: ${externalSolvedProblems.leetcode.solvedProblemIds?.length || 0} IDs, ${externalSolvedProblems.leetcode.solvedProblemSlugs?.length || 0} slugs, ${externalSolvedProblems.leetcode.solvedProblemTitles?.length || 0} titles`);
      
      // Enhanced matching for LeetCode problems
        // Match 1: Direct ID match
      if (externalSolvedProblems.leetcode.solvedProblemIds?.includes(problemId)) {
        return 'Solved';
      }
        // Match 2: By slug if available (more reliable for LeetCode)
      const slug = problem?.slug;
      if (slug && externalSolvedProblems.leetcode.solvedProblemSlugs?.includes(slug)) {
        return 'Solved';
      }
      
      // Match 3: By title exact match
      const title = problem?.title;
      if (title && externalSolvedProblems.leetcode.solvedProblemTitles?.includes(title)) {
        return 'Solved';
      }
      
      // Match 4: Extract numbers from title and check against solved IDs
      if (title && typeof title === 'string') {
        const numbersInTitle = title.match(/\d+/g);
        if (numbersInTitle && numbersInTitle.length > 0) {
          for (const numStr of numbersInTitle) {
            const possibleId = parseInt(numStr);
            if (!isNaN(possibleId) && externalSolvedProblems.leetcode.solvedProblemIds?.includes(possibleId)) {
              console.debug(`Problem ${problemId} found in LeetCode solved list by number in title: ${possibleId}`);
              return 'Solved';
            }
          }
        }
      }
      
      // Match 5: Extract problem number from URL
      if (problem?.url) {
        const url = problem.url;
        const problemNumber = url.match(/\/problems\/[\w-]+\/(\d+)/);
        if (problemNumber && problemNumber[1]) {
          const urlId = parseInt(problemNumber[1]);
          if (!isNaN(urlId) && externalSolvedProblems.leetcode.solvedProblemIds?.includes(urlId)) {
            console.debug(`Problem ${problemId} found in LeetCode solved list by URL ID: ${urlId}`);
            return 'Solved';
          }
        }
        
        // Also try to extract slug from URL and match
        const slugMatch = url.match(/\/problems\/([\w-]+)/);
        if (slugMatch && slugMatch[1]) {
          const urlSlug = slugMatch[1];
          if (externalSolvedProblems.leetcode.solvedProblemSlugs?.includes(urlSlug)) {
            console.debug(`Problem ${problemId} found in LeetCode solved list by URL slug: ${urlSlug}`);
            return 'Solved';
          }
        }
      }
      
      // Match 6: Fuzzy match for titles with slight variations
      if (title && 
          typeof title === 'string' && 
          externalSolvedProblems.leetcode.solvedProblemTitles && 
          Array.isArray(externalSolvedProblems.leetcode.solvedProblemTitles)) {
        
        // Normalize the problem title
        const normalizedTitle = title.toLowerCase().replace(/[^\w\s]/g, '');
        const titleWords = normalizedTitle.split(/\s+/).filter(w => w.length > 2);
        
        // Skip very short titles to avoid false positives
        if (titleWords.length >= 2) {
          for (const solvedTitle of externalSolvedProblems.leetcode.solvedProblemTitles) {
            if (typeof solvedTitle === 'string') {
              // Normalize the solved title
              const normalizedSolvedTitle = solvedTitle.toLowerCase().replace(/[^\w\s]/g, '');
              const solvedWords = normalizedSolvedTitle.split(/\s+/).filter(w => w.length > 2);
              
              // Skip very short titles
              if (solvedWords.length >= 2) {
                // Count matching words
                let matchCount = 0;
                for (const word of titleWords) {
                  if (solvedWords.includes(word)) matchCount++;
                }
                
                // Calculate match percentage
                const matchPercentage = titleWords.length > 0 ? matchCount / titleWords.length : 0;
                
                // If more than 80% of words match, consider it solved
                if (matchPercentage > 0.8) {
                  console.debug(`Problem ${problemId} fuzzy matched with "${solvedTitle}" (${Math.round(matchPercentage * 100)}%)`);
                  return 'Solved';
                }
              }
            }
          }
        }
      }
    }
     
    // Check CodeForces problems
    else if (normalizedSource.includes('codeforces') && externalSolvedProblems.codeforces?.success) {
      // Enhanced matching for CodeForces problems
      
      // Match 1: Direct ID match as string
      const stringId = String(problemId);
      if (externalSolvedProblems.codeforces.solvedProblemIds?.includes(stringId)) {
        console.debug(`Problem ${problemId} found in CodeForces solved list by direct ID match: ${stringId}`);
        return 'Solved';
      }
      
      // Match 2: Match by problem name/title
      const title = problem?.title;
      if (title && 
          externalSolvedProblems.codeforces.solvedProblemNames && 
          externalSolvedProblems.codeforces.solvedProblemNames.includes(title)) {
        console.debug(`Problem ${problemId} found in CodeForces solved list by exact title match: ${title}`);
        return 'Solved';
      }
      
      // Match 3: Extract contest ID and problem index from URL
      if (problem?.url) {
        const url = problem.url;
        // Extract contestId and index in various formats
        const contestPatterns = [
          /contest\/(\d+)\/problem\/([A-Z\d]+)/,  // Standard format
          /problemset\/problem\/(\d+)\/([A-Z\d]+)/, // Problemset format
          /gym\/(\d+)\/problem\/([A-Z\d]+)/       // Gym format
        ];
        
        for (const pattern of contestPatterns) {
          const contestMatch = url.match(pattern);
          if (contestMatch && contestMatch.length >= 3) {
            const contestId = contestMatch[1];
            const index = contestMatch[2];
            
            // Try different formats of IDs used by Codeforces
            const formats = [
              `${contestId}-${index}`,      // Format: "1234-A"
              `${contestId}${index}`,       // Format: "1234A"
              contestId                     // Just the contest ID
            ];
            
            for (const format of formats) {
              if (externalSolvedProblems.codeforces.solvedProblemIds?.includes(format)) {
                console.debug(`Problem ${problemId} found in CodeForces solved list by format: ${format}`);
                return 'Solved';
              }
            }
          }
        }
      }
      
      // Match 4: Try to extract contest ID and problem index from title
      if (title && typeof title === 'string') {
        // Common formats:
        // "123A - Some Problem Name" 
        // "Problem A of Contest #123"
        // "Contest 123 - Problem A"
        
        // Pattern 1: "123A - Some Problem Name"
        const titlePattern1 = title.match(/^\s*(\d+)([A-Z\d])\s*[-:.]/);
        if (titlePattern1 && titlePattern1.length >= 3) {
          const contestId = titlePattern1[1];
          const index = titlePattern1[2];
          
          const formats = [
            `${contestId}-${index}`,
            `${contestId}${index}`,
            contestId
          ];
          
          for (const format of formats) {
            if (externalSolvedProblems.codeforces.solvedProblemIds?.includes(format)) {
              console.debug(`Problem ${problemId} found in CodeForces solved list by title format 1: ${format}`);
              return 'Solved';
            }
          }
        }
        
        // Pattern 2: "Problem A of Contest #123"
        const titlePattern2 = title.match(/Problem\s+([A-Z\d])\s+of\s+Contest\s+#?(\d+)/i);
        if (titlePattern2 && titlePattern2.length >= 3) {
          const index = titlePattern2[1];
          const contestId = titlePattern2[2];
          
          const formats = [
            `${contestId}-${index}`,
            `${contestId}${index}`,
            contestId
          ];
          
          for (const format of formats) {
            if (externalSolvedProblems.codeforces.solvedProblemIds?.includes(format)) {
              console.debug(`Problem ${problemId} found in CodeForces solved list by title format 2: ${format}`);
              return 'Solved';
            }
          }
        }
        
        // Pattern 3: "Contest 123 - Problem A"
        const titlePattern3 = title.match(/Contest\s+#?(\d+)\s*[-:]\s*Problem\s+([A-Z\d])/i);
        if (titlePattern3 && titlePattern3.length >= 3) {
          const contestId = titlePattern3[1];
          const index = titlePattern3[2];
          
          const formats = [
            `${contestId}-${index}`,
            `${contestId}${index}`,
            contestId
          ];
          
          for (const format of formats) {
            if (externalSolvedProblems.codeforces.solvedProblemIds?.includes(format)) {
              console.debug(`Problem ${problemId} found in CodeForces solved list by title format 3: ${format}`);
              return 'Solved';
            }
          }
        }
      }
      
      // Match 5: Fuzzy match for titles
      if (title && 
          typeof title === 'string' && 
          externalSolvedProblems.codeforces.solvedProblemNames && 
          Array.isArray(externalSolvedProblems.codeforces.solvedProblemNames)) {
          
        // Extract the problem name part (removing the problem ID/prefix if present)
        const problemNameMatch = title.match(/^.*?[-:]\s*(.*?)$/);
        const problemName = problemNameMatch ? problemNameMatch[1].trim() : title.trim();
        
        // Skip very short problem names
        if (problemName.length > 5) {
          for (const solvedName of externalSolvedProblems.codeforces.solvedProblemNames) {
            if (typeof solvedName === 'string' && solvedName.trim().length > 5) {
              // Check if the solved name contains the problem name or vice versa
              if (solvedName.toLowerCase().includes(problemName.toLowerCase()) ||
                  problemName.toLowerCase().includes(solvedName.toLowerCase())) {
                console.debug(`Problem ${problemId} fuzzy matched with Codeforces problem "${solvedName}"`);
                return 'Solved';
              }
            }
          }
        }
      }
    }
  }
  
  // If nothing was matched, return "Not Attempted"
  return 'Not Attempted';
};
