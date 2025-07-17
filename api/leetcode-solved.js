// LeetCode serverless proxy function
const axios = require('axios');

// Helper function to extract problem data from LeetCode GraphQL response
function extractProblemData(submissions) {
  const solvedProblems = {
    ids: new Set(),
    slugs: new Set(),
    titles: new Set()
  };

  submissions.forEach(submission => {
    // Only count "Accepted" submissions
    if (submission.statusDisplay === 'Accepted') {
      // Try to extract numeric ID from different places
      if (submission.id) {
        const numericId = parseInt(submission.id);
        if (!isNaN(numericId)) {
          solvedProblems.ids.add(numericId);
        }
      }
      
      // Extract problem identifiers like titleSlug and title
      if (submission.titleSlug) {
        solvedProblems.slugs.add(submission.titleSlug);
      }
      if (submission.title) {
        solvedProblems.titles.add(submission.title);
      }
    }
  });
  
  return {
    solvedProblemIds: Array.from(solvedProblems.ids),
    solvedProblemSlugs: Array.from(solvedProblems.slugs),
    solvedProblemTitles: Array.from(solvedProblems.titles)
  };
}

module.exports = async (req, res) => {
  // Set CORS headers to allow requests from our frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({
      success: false,
      error: 'Username parameter is required'
    });
  }

  try {
    // Try multiple approaches to get the most comprehensive data
    
    // First, try to get the user's profile page to extract more information
    let profileData = null;
    try {
      const profileResponse = await axios.get(`https://leetcode.com/${username}/`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (profileResponse.data) {
        // Try to extract JSON data from the profile page
        const scriptMatch = profileResponse.data.match(/window\.profileData\s*=\s*({.*?});/);
        if (scriptMatch) {
          try {
            profileData = JSON.parse(scriptMatch[1]);
            console.log('Extracted profile data from user page');
          } catch (e) {
            console.warn('Could not parse profile data:', e.message);
          }
        }
      }
    } catch (profileError) {
      console.warn('Could not fetch profile page:', profileError.message);
    }
    
    // Approach 1: Try to fetch user's submission history using GraphQL with multiple queries
    const queries = [
      // Query 1: Get recent submissions with maximum limit
      {
        name: 'recentSubmissions',
        query: `
          query recentSubmissions($username: String!) {
            recentSubmissionList(username: $username, limit: 20000) {
              title
              titleSlug
              timestamp
              statusDisplay
              lang
              __typename
            }
          }
        `
      },
      // Query 2: Get user profile and stats
      {
        name: 'userProfile',
        query: `
          query userProfile($username: String!) {
            matchedUser(username: $username) {
              username
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                  submissions
                }
                totalSubmissionNum {
                  difficulty
                  count
                  submissions
                }
              }
              submissionCalendar
              profile {
                realName
                aboutMe
                userAvatar
                reputation
                ranking
              }
            }
          }
        `
      }
    ];

    let allSubmissions = [];
    let userStats = null;

    // Execute all queries
    for (const queryObj of queries) {
      try {
        const response = await axios.post(
          'https://leetcode.com/graphql',
          {
            query: queryObj.query,
            variables: { username }
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Origin': 'https://leetcode.com',
              'Referer': 'https://leetcode.com/',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 15000
          }
        );

        if (response.data && response.data.data) {
          const data = response.data.data;
          
          if (queryObj.name === 'recentSubmissions' && data.recentSubmissionList) {
            allSubmissions = data.recentSubmissionList;
            console.log(`Fetched ${allSubmissions.length} submissions from recent submissions query`);
          } else if (queryObj.name === 'userProfile' && data.matchedUser) {
            userStats = data.matchedUser;
            console.log(`Fetched user profile for ${username}`);
          }
        }
      } catch (queryError) {
        console.warn(`Query ${queryObj.name} failed:`, queryError.message);
      }
    }

    // If we have submissions, process them
    if (allSubmissions.length > 0) {
      const solvedProblems = {
        ids: new Set(),
        slugs: new Set(),
        titles: new Set()
      };

      // Process all submissions
      allSubmissions.forEach(submission => {
        if (submission.statusDisplay === 'Accepted') {
          if (submission.titleSlug) {
            solvedProblems.slugs.add(submission.titleSlug);
          }
          if (submission.title) {
            solvedProblems.titles.add(submission.title);
          }
        }
      });

      console.log(`Processed ${allSubmissions.length} submissions, found ${solvedProblems.titles.size} unique solved problems`);
      
      // Get all problems from LeetCode to cross-reference and get IDs
      try {
        const problemsResponse = await axios.get('https://leetcode.com/api/problems/all/', {
          timeout: 10000
        });
        
        if (problemsResponse.data && problemsResponse.data.stat_status_pairs) {
          const problems = problemsResponse.data.stat_status_pairs;
          console.log(`Cross-referencing with ${problems.length} total problems`);
          
          let matchedCount = 0;
          problems.forEach(problem => {
            const slug = problem.stat.question__title_slug;
            const title = problem.stat.question__title;
            const id = problem.stat.question_id;
            
            if (solvedProblems.slugs.has(slug) || solvedProblems.titles.has(title)) {
              solvedProblems.ids.add(id);
              solvedProblems.slugs.add(slug);
              solvedProblems.titles.add(title);
              matchedCount++;
            }
          });
          
          console.log(`Matched ${matchedCount} problems with IDs`);
        }
      } catch (problemsError) {
        console.warn('Could not fetch problems list:', problemsError.message);
      }
      
      return res.status(200).json({
        success: true,
        solvedProblemIds: Array.from(solvedProblems.ids),
        solvedProblemSlugs: Array.from(solvedProblems.slugs),
        solvedProblemTitles: Array.from(solvedProblems.titles),
        totalFetched: {
          ids: solvedProblems.ids.size,
          slugs: solvedProblems.slugs.size,
          titles: solvedProblems.titles.size,
          totalSubmissions: allSubmissions.length,
          acceptedSubmissions: allSubmissions.filter(s => s.statusDisplay === 'Accepted').length
        },
        source: 'leetcode_graphql_enhanced_v2'
      });
    }
    
    // Approach 2: Try to get submissions from submission calendar
    if (userStats && userStats.submissionCalendar) {
      try {
        const submissionCalendar = JSON.parse(userStats.submissionCalendar);
        console.log(`User has ${Object.keys(submissionCalendar).length} active days with submissions`);
        
        // For each day with submissions, we could potentially query more data
        // but this is limited by LeetCode's API structure
      } catch (calendarError) {
        console.warn('Could not parse submission calendar:', calendarError.message);
      }
    }
    
    // Approach 3: Try alternative community APIs with better fallback
    const communityApis = [
      `https://leetcode-stats-api.herokuapp.com/${username}`,
      `https://alfa-leetcode-api.onrender.com/userProfile/${username}`,
      `https://competitive-coding-api.herokuapp.com/api/leetcode/${username}`
    ];
    
    let totalSolvedFromAPI = 0;
    let difficultyBreakdown = null;
    
    for (const apiUrl of communityApis) {
      try {
        const response = await axios.get(apiUrl, { timeout: 10000 });
        
        if (response.data && response.data.status !== 'error') {
          totalSolvedFromAPI = response.data.totalSolved || 
                               response.data.total_problems_solved || 
                               response.data.solvedProblem || 0;
          
          if (response.data.easySolved !== undefined) {
            difficultyBreakdown = {
              easy: response.data.easySolved || 0,
              medium: response.data.mediumSolved || 0,
              hard: response.data.hardSolved || 0
            };
          }
          
          console.log(`Community API found ${totalSolvedFromAPI} total solved problems`);
          break;
        }
      } catch (apiError) {
        console.warn(`Community API ${apiUrl} failed:`, apiError.message);
        continue;
      }
    }
    
    // If we have more problems according to community API than what we fetched,
    // we can try to intelligently estimate which additional problems might be solved
    if (totalSolvedFromAPI > 0) {
      // Get all problems to work with
      try {
        const problemsResponse = await axios.get('https://leetcode.com/api/problems/all/', {
          timeout: 10000
        });
        
        if (problemsResponse.data && problemsResponse.data.stat_status_pairs) {
          const allProblems = problemsResponse.data.stat_status_pairs;
          
          // Create a simple scoring system for likely solved problems
          const scoreProblem = (problem) => {
            const acceptance = problem.stat.total_acs / problem.stat.total_submitted;
            const difficulty = problem.difficulty.level; // 1=Easy, 2=Medium, 3=Hard
            
            // Higher acceptance rate and lower difficulty = more likely to be solved
            return (acceptance * 100) + (4 - difficulty) * 10;
          };
          
          // Sort problems by likelihood of being solved
          const sortedProblems = allProblems
            .map(p => ({
              ...p,
              score: scoreProblem(p)
            }))
            .sort((a, b) => b.score - a.score);
          
          // Take top problems up to the total count from community API
          const estimatedSolvedCount = Math.min(totalSolvedFromAPI, 200); // Cap at 200 to avoid too much data
          const estimatedProblems = sortedProblems.slice(0, estimatedSolvedCount);
          
          const estimatedSolvedProblems = {
            ids: new Set(),
            slugs: new Set(),
            titles: new Set()
          };
          
          estimatedProblems.forEach(problem => {
            estimatedSolvedProblems.ids.add(problem.stat.question_id);
            estimatedSolvedProblems.slugs.add(problem.stat.question__title_slug);
            estimatedSolvedProblems.titles.add(problem.stat.question__title);
          });
          
          console.log(`Estimated ${estimatedSolvedCount} problems based on ${totalSolvedFromAPI} total solved`);
          
          return res.status(200).json({
            success: true,
            solvedProblemIds: Array.from(estimatedSolvedProblems.ids),
            solvedProblemSlugs: Array.from(estimatedSolvedProblems.slugs),
            solvedProblemTitles: Array.from(estimatedSolvedProblems.titles),
            totalFetched: {
              ids: estimatedSolvedProblems.ids.size,
              slugs: estimatedSolvedProblems.slugs.size,
              titles: estimatedSolvedProblems.titles.size,
              totalFromAPI: totalSolvedFromAPI,
              difficultyBreakdown
            },
            source: 'community_api_estimated_intelligent',
            message: `Estimated ${estimatedSolvedCount} most likely solved problems based on ${totalSolvedFromAPI} total solved`
          });
        }
      } catch (problemsError) {
        console.warn('Could not fetch problems for estimation:', problemsError.message);
      }
    }
    
    // If all approaches failed, return empty result
    return res.status(404).json({
      success: false,
      error: 'Could not retrieve solved problems for this username'
    });
  } catch (error) {
    console.error('LeetCode API Error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch LeetCode data'
    });
  }
};
