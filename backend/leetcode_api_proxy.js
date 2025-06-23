// This is a server function that could be deployed as an API route or serverless function
// For example in Next.js API routes or Vercel serverless functions
// This would be placed in a separate API service

/**
 * LeetCode User Stats Proxy API
 * 
 * This function acts as a proxy to fetch LeetCode user statistics
 * while avoiding CORS issues. It should be deployed as a serverless
 * function, for example on Vercel.
 */
export async function getLeetCodeUserStats(username) {
  // Server-side code without CORS restrictions
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Content-Type': 'application/json',
    'Referer': 'https://leetcode.com'
  };

  try {
    // This is the GraphQL query that would run server-side
    const query = `
      query userProblemsSolved($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables: { username }
      }),
    });

    const data = await response.json();
    
    if (!data.data?.matchedUser) {
      return { 
        success: false,
        error: 'User not found' 
      };
    }

    // Process the data
    const stats = { success: true, totalSolved: 0, easy: 0, medium: 0, hard: 0 };
    
    data.data.matchedUser.submitStats.acSubmissionNum.forEach(item => {
      if (item.difficulty === 'Easy') stats.easy = item.count;
      else if (item.difficulty === 'Medium') stats.medium = item.count;
      else if (item.difficulty === 'Hard') stats.hard = item.count;
      
      stats.totalSolved += item.count;
    });

    return stats;
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    return { 
      success: false,
      error: error.message || 'Failed to fetch LeetCode stats'
    };
  }
}
