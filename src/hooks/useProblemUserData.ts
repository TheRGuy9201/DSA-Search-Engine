import { useState, useEffect, useCallback } from 'react';
import type { Problem } from '../types';
import { useUserProfile } from './useUserProfile';
import { fetchAllProblemStats, fetchAllSolvedProblemsData } from '../services/problemStatsApi';
import type { AllSolvedProblems } from '../services/problemStatsApi';
import { logActivity, getCombinedProblemStatus } from '../services/activityTrackingService';

// Type for storing user data about problems
interface UserProblemData {
    [compositeId: string]: {
        status: 'Solved' | 'Attempted' | 'Not Attempted';
        bookmarked: boolean;
    };
}

// In future implementation, we could use these to map our problems with external API problems
// For now, we'll rely on user-marked problems and activity tracking

// Helper function to generate composite ID (source-id)
const generateCompositeId = (id: number, source: string): string => {
    return `${source}-${id}`;
}

// Custom hook to manage problem user data (bookmarks and status)
export const useProblemUserData = (problems: Problem[]) => {
    const [userData, setUserData] = useState<UserProblemData>({});
    const [externalSolvedProblems, setExternalSolvedProblems] = useState<AllSolvedProblems | null>(null);

    // Get current user profile including platform IDs
    const { leetcodeId, codeforcesId } = useUserProfile();

    // Function to fetch statistics and solved problem lists from external platforms
    const fetchExternalPlatformsData = useCallback(async () => {
        if (!leetcodeId && !codeforcesId) {
            console.log("No external platform IDs found in user profile");
            return;
        }

        try {
            // Fetch aggregated stats
            const stats = await fetchAllProblemStats(leetcodeId || '', codeforcesId || '');
            console.log('Fetched external platform stats:', stats);
            
            // Fetch actual solved problem lists
            const solvedProblems = await fetchAllSolvedProblemsData(
                leetcodeId || '', 
                codeforcesId || ''
            );
            console.log('Fetched solved problems:', 
                {
                    leetcode: { 
                        count: solvedProblems.leetcode.solvedProblemIds?.length || 0,
                        slugs: solvedProblems.leetcode.solvedProblemSlugs?.length || 0 
                    },
                    codeforces: { 
                        count: solvedProblems.codeforces.solvedProblemIds?.length || 0
                    }
                }
            );
            
            // Store the list of solved problems
            setExternalSolvedProblems(solvedProblems);
        } catch (error) {
            console.error('Error fetching external platform data:', error);
        }
    }, [leetcodeId, codeforcesId]);

    // Load user data from localStorage on initial render and when user changes
    useEffect(() => {
        const savedUserData = localStorage.getItem('dsa-search-engine-problem-data');
        if (savedUserData) {
            try {
                setUserData(JSON.parse(savedUserData));
            } catch (e) {
                console.error('Error parsing saved problem data:', e);
            }
        }

        // Fetch stats and solved problems from external platforms if user has accounts linked
        fetchExternalPlatformsData();
    }, [fetchExternalPlatformsData]);

    // Debug whenever external solved problems update
    useEffect(() => {
        if (externalSolvedProblems) {
            console.log("External solved problems updated:", {
                leetcode: {
                    success: externalSolvedProblems.leetcode.success,
                    ids: externalSolvedProblems.leetcode.solvedProblemIds.length,
                    slugs: externalSolvedProblems.leetcode.solvedProblemSlugs.length,
                    titles: externalSolvedProblems.leetcode.solvedProblemTitles.length
                },
                codeforces: {
                    success: externalSolvedProblems.codeforces.success,
                    ids: externalSolvedProblems.codeforces.solvedProblemIds.length,
                    names: externalSolvedProblems.codeforces.solvedProblemNames.length
                }
            });
        }
    }, [externalSolvedProblems]);

    // Save user data to localStorage whenever it changes
    useEffect(() => {
        if (Object.keys(userData).length > 0) {
            localStorage.setItem('dsa-search-engine-problem-data', JSON.stringify(userData));
        }
    }, [userData]);

    // Function to toggle bookmark for a problem
    const toggleBookmark = (problemId: number, source: string = 'unknown') => {
        const compositeId = generateCompositeId(problemId, source);
        setUserData(prev => {
            const current = prev[compositeId] || { status: 'Not Attempted', bookmarked: false };
            return {
                ...prev,
                [compositeId]: {
                    ...current,
                    bookmarked: !current.bookmarked
                }
            };
        });
    };

    // Function to update problem status
    const updateProblemStatus = (problemId: number, status: 'Solved' | 'Attempted' | 'Not Attempted', source: string = 'unknown') => {
        const compositeId = generateCompositeId(problemId, source);
        
        setUserData(prev => {
            const current = prev[compositeId] || { status: 'Not Attempted', bookmarked: false };
            
            // If status is being changed to "Solved" and it wasn't already "Solved", log the activity
            if (status === 'Solved' && current.status !== 'Solved') {
                logActivity(1); // Log one solved problem for today's activity
            }
            
            return {
                ...prev,
                [compositeId]: {
                    ...current,
                    status
                }
            };
        });
    };

    // Function to check if problem is bookmarked
    const isBookmarked = (problemId: number, source: string = 'unknown'): boolean => {
        const compositeId = generateCompositeId(problemId, source);
        return !!userData[compositeId]?.bookmarked;
    };

    // Function to get problem status - checks both local storage and external platforms
    const getProblemStatus = (problemId: number, source: string = 'unknown', problem?: any): 'Solved' | 'Attempted' | 'Not Attempted' => {
        // Use enhanced function that checks both local storage and external platform data
        return getCombinedProblemStatus(problemId, source, externalSolvedProblems, problem);
    };

    // Apply user data to problems
    const problemsWithUserData = problems.map(problem => {
        // Determine the source of the problem
        let source = (problem as any).source || 'unknown';
        
        // If source is not explicitly set, try to determine it from various properties
        if (source === 'unknown') {
            // First check URL
            if (problem.url) {
                const url = problem.url.toLowerCase();
                if (url.includes('leetcode.com')) {
                    source = 'leetcode';
                } else if (url.includes('codeforces.com')) {
                    source = 'codeforces';
                }
            }
            
            // Try to identify from problem properties and format
            if (source === 'unknown') {
                // LeetCode problems often have a slug property or certain format
                if (problem.slug && !problem.slug.includes('-')) {
                    // LeetCode slugs are usually hyphenated (e.g., "two-sum")
                    const hasHyphen = problem.slug.includes('-');
                    if (hasHyphen) {
                        source = 'leetcode';
                    }
                }
                
                // CodeForces problems often include contest IDs or have a specific format
                // Like "123A - Problem Name" or "Contest 123 - Problem A"
                const title = problem.title || '';
                if (
                    title.match(/^\d+[A-Z]\s*-/) || // Format: "123A - Problem"
                    title.match(/Contest\s*\d+/) || // Format: "Contest 123"
                    problem.url?.includes('contest') || // URL includes 'contest'
                    problem.url?.includes('problemset') // URL includes 'problemset'
                ) {
                    source = 'codeforces';
                }
            }
        }
        
        // Debug log to help troubleshoot
        if (externalSolvedProblems && (source === 'leetcode' || source === 'codeforces')) {
            console.debug(`[Problem Source Detection] Problem ${problem.id} detected as: ${source}, title: ${problem.title}`);
        }
        
        return {
            ...problem,
            source, // Ensure source is set on the problem
            // Pass the full problem object to getProblemStatus for better matching
            status: getProblemStatus(problem.id, source, problem),
            bookmarked: isBookmarked(problem.id, source)
        };
    });

    return {
        problemsWithUserData,
        toggleBookmark,
        updateProblemStatus,
        isBookmarked,
        getProblemStatus
    };
};
