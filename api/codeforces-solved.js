// Codeforces serverless proxy function
const axios = require('axios');

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

  const { handle } = req.query;

  if (!handle) {
    return res.status(400).json({
      success: false,
      error: 'Codeforces handle parameter is required'
    });
  }

  try {
    // Get user's submissions from Codeforces API
    const submissionsResponse = await axios.get(
      `https://codeforces.com/api/user.status?handle=${handle}`,
      { timeout: 10000 }
    );
    
    const submissions = submissionsResponse.data;
    
    if (!submissions.result) {
      return res.status(404).json({
        success: false,
        error: 'No submissions found for this Codeforces handle'
      });
    }
    
    // Process submissions to extract unique solved problems
    const solvedProblemIds = new Set();
    const solvedProblemNames = new Set();
    
    submissions.result.forEach(submission => {
      if (submission.verdict === 'OK') {
        // Format problem ID in multiple ways to improve matching
        if (submission.problem.contestId && submission.problem.index) {
          // Format 1: contestId-index (e.g., "1234-A")
          const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
          solvedProblemIds.add(problemId);
          
          // Format 2: contestIdindex (e.g., "1234A")
          const alternateFormat = `${submission.problem.contestId}${submission.problem.index}`;
          solvedProblemIds.add(alternateFormat);
          
          // Format 3: Just the contest ID as a string
          solvedProblemIds.add(String(submission.problem.contestId));
        }
        
        // Store problem name for matching by title
        if (submission.problem.name) {
          solvedProblemNames.add(submission.problem.name);
        }
      }
    });
    
    return res.status(200).json({
      success: true,
      solvedProblemIds: Array.from(solvedProblemIds),
      solvedProblemNames: Array.from(solvedProblemNames),
      totalSolved: solvedProblemIds.size,
      source: 'codeforces_api'
    });
    
  } catch (error) {
    console.error('Codeforces API Error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch Codeforces data'
    });
  }
};
