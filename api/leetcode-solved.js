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
    // Try first approach: using GraphQL API to fetch recent submissions
    const graphqlQuery = `query recentSubmissions($username: String!) {
      recentSubmissionList(username: $username) {
        id
        title
        titleSlug
        statusDisplay
      }
    }`;

    const variables = { username };

    // Try to fetch data from LeetCode GraphQL API
    const leetcodeResponse = await axios.post(
      'https://leetcode.com/graphql',
      {
        query: graphqlQuery,
        variables
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://leetcode.com',
          'Referer': 'https://leetcode.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      }
    );

    // Check if we got valid data
    if (leetcodeResponse.data && leetcodeResponse.data.data && leetcodeResponse.data.data.recentSubmissionList) {
      const submissions = leetcodeResponse.data.data.recentSubmissionList;
      const extractedData = extractProblemData(submissions);
      
      return res.status(200).json({
        success: true,
        ...extractedData,
        source: 'leetcode_graphql_api'
      });
    }
    
    // If GraphQL failed, try the alternative approach
    const userStatsResponse = await axios.get(
      `https://leetcode-stats-api.herokuapp.com/${username}?mode=full`,
      {
        timeout: 10000
      }
    );
    
    if (userStatsResponse.data && userStatsResponse.data.status !== 'error') {
      // We got some data about the user, but not specific solved problems
      // Return a partial result
      return res.status(200).json({
        success: true,
        solvedProblemIds: [],
        solvedProblemSlugs: [],
        solvedProblemTitles: [],
        totalSolved: userStatsResponse.data.totalSolved || 0,
        source: 'leetcode_stats_api',
        message: 'Only aggregate stats available. Individual problems could not be fetched.'
      });
    }
    
    // If all attempts failed, return an error
    return res.status(404).json({
      success: false,
      error: 'No data found for this username'
    });
  } catch (error) {
    console.error('LeetCode API Error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch LeetCode data'
    });
  }
};
