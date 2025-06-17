import type { Problem, ProblemsResponse } from '../types';

// Cache mechanism to avoid multiple fetches
let leetcodeProblemsCache: ProblemsResponse | null = null;
let codeforcesProblemsCache: ProblemsResponse | null = null;
let lastLeetCodeFetchTime: number = 0;
let lastCodeforcesFetchTime: number = 0;
const CACHE_TTL = 3600000; // 1 hour in milliseconds

/**
 * Fetch all LeetCode problems from the JSON file
 */
export const fetchLeetcodeProblems = async (): Promise<ProblemsResponse> => {
    const currentTime = Date.now();

    // Return cached data if available and not expired
    if (leetcodeProblemsCache && (currentTime - lastLeetCodeFetchTime < CACHE_TTL)) {
        return leetcodeProblemsCache;
    }

    try {
        const response = await fetch('/data/leetcode_problems.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch LeetCode problems: ${response.statusText}`);
        }

        const data: ProblemsResponse = await response.json();

        // Update cache
        leetcodeProblemsCache = data;
        lastLeetCodeFetchTime = currentTime;

        return data;
    } catch (error) {
        console.error('Error fetching LeetCode problems:', error);
        // Return empty response if fetch fails
        return { metadata: { total_problems: 0, last_updated: new Date().toISOString() }, problems: [] };
    }
};

/**
 * Fetch all Codeforces problems from the JSON file
 */
export const fetchCodeforcesProblems = async (): Promise<ProblemsResponse> => {
    const currentTime = Date.now();

    // Return cached data if available and not expired
    if (codeforcesProblemsCache && (currentTime - lastCodeforcesFetchTime < CACHE_TTL)) {
        return codeforcesProblemsCache;
    }

    try {
        const response = await fetch('/data/codeforces_problems.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch Codeforces problems: ${response.statusText}`);
        }

        const data: ProblemsResponse = await response.json();

        // Filter out problems with null tags
        data.problems = data.problems.filter(problem => problem.tags && problem.tags.length > 0);

        // Update metadata to reflect filtered problems count
        if (data.metadata) {
            data.metadata.total_problems = data.problems.length;
        }

        // Update cache
        codeforcesProblemsCache = data;
        lastCodeforcesFetchTime = currentTime;

        return data;
    } catch (error) {
        console.error('Error fetching Codeforces problems:', error);
        // Return empty response if fetch fails
        return { metadata: { total_problems: 0, last_updated: new Date().toISOString() }, problems: [] };
    }
};

/**
 * Get paginated LeetCode problems with optional filtering
 */
export const getPaginatedLeetcodeProblems = async (
    page: number = 1,
    itemsPerPage: number = 30,
    filters: {
        difficulty?: string;
        searchTerm?: string;
        tags?: string[];
        status?: string;
        bookmarkedOnly?: boolean;
    } = {}
): Promise<{ problems: Problem[]; totalProblems: number; totalPages: number }> => {
    const { problems } = await fetchLeetcodeProblems();

    // Apply filters
    let filteredProblems = [...problems];

    if (filters.difficulty && filters.difficulty !== 'All') {
        filteredProblems = filteredProblems.filter(p => p.difficulty === filters.difficulty);
    }

    if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredProblems = filteredProblems.filter(p =>
            p.title.toLowerCase().includes(searchLower) ||
            p.slug?.toLowerCase().includes(searchLower)
        );
    }

    if (filters.tags && filters.tags.length > 0) {
        filteredProblems = filteredProblems.filter(p => {
            if (!p.tags || p.tags.length === 0) return false;

            // Check if the problem contains ALL selected tags
            return filters.tags!.every(filterTag =>
                p.tags!.some(problemTag =>
                    problemTag.toLowerCase().includes(filterTag.toLowerCase())
                )
            );
        });
    }

    // Calculate pagination
    const totalProblems = filteredProblems.length;
    const totalPages = Math.ceil(totalProblems / itemsPerPage);
    const safePageNumber = Math.max(1, Math.min(page, totalPages || 1));

    // Get current page of problems
    const startIndex = (safePageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProblems = filteredProblems.slice(startIndex, endIndex);

    return {
        problems: paginatedProblems,
        totalProblems,
        totalPages
    };
};

/**
 * Get paginated Codeforces problems with optional filtering
 */
export const getPaginatedCodeforcesProblems = async (
    page: number = 1,
    itemsPerPage: number = 30,
    filters: {
        difficulty?: string;
        searchTerm?: string;
        tags?: string[];
        status?: string;
        bookmarkedOnly?: boolean;
    } = {}
): Promise<{ problems: Problem[]; totalProblems: number; totalPages: number }> => {
    const { problems } = await fetchCodeforcesProblems();

    // Apply filters
    let filteredProblems = [...problems]; if (filters.difficulty && filters.difficulty !== 'All') {
        // For Codeforces, filter based on point ranges
        filteredProblems = filteredProblems.filter(p => {
            if (p.points === null || p.points === undefined) {
                return p.difficulty === filters.difficulty; // Fallback to the existing difficulty
            }

            // Map point ranges to difficulties
            switch (filters.difficulty) {
                case 'Beginner':
                    return p.points <= 1000;
                case 'Easy':
                    return p.points > 1000 && p.points <= 1300;
                case 'Lower-Mid':
                    return p.points > 1300 && p.points <= 1600;
                case 'Mid-Level':
                    return p.points > 1600 && p.points <= 1900;
                case 'Upper-Mid':
                    return p.points > 1900 && p.points <= 2200;
                case 'Hard':
                    return p.points > 2200 && p.points <= 2500;
                case 'Very Hard':
                    return p.points > 2500;
                default:
                    return p.difficulty === filters.difficulty;
            }
        });
    }

    if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredProblems = filteredProblems.filter(p =>
            p.title.toLowerCase().includes(searchLower) ||
            p.slug?.toLowerCase().includes(searchLower)
        );
    }

    if (filters.tags && filters.tags.length > 0) {
        filteredProblems = filteredProblems.filter(p => {
            if (!p.tags || p.tags.length === 0) return false;

            // Check if the problem contains ANY of the selected tags
            return filters.tags!.some(filterTag =>
                p.tags!.some(problemTag =>
                    problemTag.toLowerCase().includes(filterTag.toLowerCase())
                )
            );
        });
    }

    // Calculate pagination
    const totalProblems = filteredProblems.length;
    const totalPages = Math.ceil(totalProblems / itemsPerPage);
    const safePageNumber = Math.max(1, Math.min(page, totalPages || 1));

    // Get current page of problems
    const startIndex = (safePageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProblems = filteredProblems.slice(startIndex, endIndex);

    return {
        problems: paginatedProblems,
        totalProblems,
        totalPages
    };
};
