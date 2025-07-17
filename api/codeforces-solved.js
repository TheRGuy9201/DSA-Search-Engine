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
    const solvedProblemsDetails = new Map(); // Store detailed problem info
    
    submissions.result.forEach(submission => {
      if (submission.verdict === 'OK') {
        const contestId = submission.problem.contestId;
        const index = submission.problem.index;
        const problemName = submission.problem.name;
        
        if (contestId && index) {
          // Format problem ID in multiple ways to improve matching
          const problemId1 = `${contestId}-${index}`;     // Format: "1234-A"
          const problemId2 = `${contestId}${index}`;      // Format: "1234A"
          const problemId3 = String(contestId);           // Just contest ID
          
          solvedProblemIds.add(problemId1);
          solvedProblemIds.add(problemId2);
          solvedProblemIds.add(problemId3);
          
          // Store detailed info for this problem
          solvedProblemsDetails.set(problemId1, {
            contestId,
            index,
            name: problemName,
            url: `https://codeforces.com/problemset/problem/${contestId}/${index}`
          });
        }
        
        // Store problem name for matching by title
        if (problemName) {
          solvedProblemNames.add(problemName);
        }
      }
    });
    
    // Convert details map to array for easier processing
    const problemDetails = Array.from(solvedProblemsDetails.values());
    
    return res.status(200).json({
      success: true,
      solvedProblemIds: Array.from(solvedProblemIds),
      solvedProblemNames: Array.from(solvedProblemNames),
      solvedProblemsDetails: problemDetails,
      totalSolved: solvedProblemsDetails.size,
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
