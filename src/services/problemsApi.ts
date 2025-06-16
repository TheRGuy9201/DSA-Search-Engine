import type { Problem, ProblemsResponse } from '../types';

// Cache mechanism to avoid multiple fetches
let leetcodeProblemsCache: ProblemsResponse | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 3600000; // 1 hour in milliseconds

/**
 * Fetch all LeetCode problems from the JSON file
 */
export const fetchLeetcodeProblems = async (): Promise<ProblemsResponse> => {
    const currentTime = Date.now();

    // Return cached data if available and not expired
    if (leetcodeProblemsCache && (currentTime - lastFetchTime < CACHE_TTL)) {
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
        lastFetchTime = currentTime;

        return data;
    } catch (error) {
        console.error('Error fetching LeetCode problems:', error);
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
