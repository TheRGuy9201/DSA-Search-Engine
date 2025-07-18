import type { Problem, ProblemsResponse } from '../types';

// Cache mechanism to avoid multiple fetches
let leetcodeProblemsCache: ProblemsResponse | null = null;
let codeforcesProblemsCache: ProblemsResponse | null = null;
let codechefProblemsCache: ProblemsResponse | null = null;
let lastLeetCodeFetchTime: number = 0;
let lastCodeforcesFetchTime: number = 0;
let lastCodechefFetchTime: number = 0;
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

        // Add source property to each problem for proper matching with external APIs
        data.problems = data.problems.map(problem => ({
            ...problem,
            source: 'leetcode'
        }));

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

        // Filter out problems with null tags and add source property
        data.problems = data.problems
            .filter(problem => problem.tags && problem.tags.length > 0)
            .map(problem => ({
                ...problem,
                source: 'codeforces'
            }));

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
 * Fetch all CodeChef problems from the JSON file
 */
export const fetchCodechefProblems = async (): Promise<ProblemsResponse> => {
    const currentTime = Date.now();

    // Return cached data if available and not expired
    if (codechefProblemsCache && (currentTime - lastCodechefFetchTime < CACHE_TTL)) {
        return codechefProblemsCache;
    }

    try {
        const response = await fetch('/data/codechef_problems.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch CodeChef problems: ${response.statusText}`);
        }

        const data: ProblemsResponse = await response.json();

        // Add source property to each problem for proper matching with external APIs
        data.problems = data.problems.map(problem => ({
            ...problem,
            source: 'codechef'
        }));

        // Update cache
        codechefProblemsCache = data;
        lastCodechefFetchTime = currentTime;

        return data;
    } catch (error) {
        console.error('Error fetching CodeChef problems:', error);
        // Return empty response if fetch fails
        return { metadata: { total_problems: 0, last_updated: new Date().toISOString() }, problems: [] };
    }
};

// Helper function to get bookmarked problems
const getBookmarkedProblems = (source: string): number[] => {
    try {
        const savedUserData = localStorage.getItem('dsa-search-engine-problem-data');
        if (!savedUserData) return [];
        
        const userData = JSON.parse(savedUserData);
        const bookmarkedIds: number[] = [];
        
        Object.entries(userData).forEach(([key, value]: [string, any]) => {
            if (key.startsWith(`${source}-`) && value.bookmarked) {
                const id = parseInt(key.split('-')[1]);
                if (!isNaN(id)) bookmarkedIds.push(id);
            }
        });
        
        return bookmarkedIds;
    } catch (error) {
        console.error('Error getting bookmarked problems:', error);
        return [];
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
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    } = {}
): Promise<{ problems: Problem[]; totalProblems: number; totalPages: number }> => {
    const { problems } = await fetchLeetcodeProblems();

    // Apply filters
    let filteredProblems = [...problems];

    // Filter by difficulty
    if (filters.difficulty && filters.difficulty !== 'All') {
        filteredProblems = filteredProblems.filter(p => p.difficulty === filters.difficulty);
    }

    // Filter by search term
    if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredProblems = filteredProblems.filter(p =>
            p.title.toLowerCase().includes(searchLower) ||
            p.slug?.toLowerCase().includes(searchLower)
        );
    }

    // Filter by tags
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

    // Filter by bookmarked status
    if (filters.bookmarkedOnly) {
        const bookmarkedIds = getBookmarkedProblems('LeetCode');
        filteredProblems = filteredProblems.filter(p => bookmarkedIds.includes(p.id));
    }

    // Sort problems if sortBy is provided
    if (filters.sortBy) {
        filteredProblems.sort((a, b) => {
            const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
            
            switch (filters.sortBy) {
                case 'id':
                    return (a.id - b.id) * sortOrder;
                case 'title':
                    return a.title.localeCompare(b.title) * sortOrder;
                case 'difficulty':
                    // Custom sort for difficulty levels
                    const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                    const diffA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0;
                    const diffB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0;
                    return (diffA - diffB) * sortOrder;
                default:
                    return 0;
            }
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
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    } = {}
): Promise<{ problems: Problem[]; totalProblems: number; totalPages: number }> => {
    const { problems } = await fetchCodeforcesProblems();

    // Apply filters
    let filteredProblems = [...problems]; 
    
    // Filter by difficulty
    if (filters.difficulty && filters.difficulty !== 'All') {
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

    // Filter by search term
    if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredProblems = filteredProblems.filter(p =>
            p.title.toLowerCase().includes(searchLower) ||
            p.slug?.toLowerCase().includes(searchLower)
        );
    }

    // Filter by tags
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

    // Filter by bookmarked status
    if (filters.bookmarkedOnly) {
        const bookmarkedIds = getBookmarkedProblems('Codeforces');
        filteredProblems = filteredProblems.filter(p => bookmarkedIds.includes(p.id));
    }

    // Sort problems if sortBy is provided
    if (filters.sortBy) {
        filteredProblems.sort((a, b) => {
            const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
            
            switch (filters.sortBy) {
                case 'id':
                    return (a.id - b.id) * sortOrder;
                case 'title':
                    return a.title.localeCompare(b.title) * sortOrder;
                case 'difficulty':
                    // Sort by points for Codeforces
                    const pointsA = a.points || 0;
                    const pointsB = b.points || 0;
                    return (pointsA - pointsB) * sortOrder;
                default:
                    return 0;
            }
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
 * Get paginated CodeChef problems with filtering and sorting
 */
export const getPaginatedCodechefProblems = async (
    page: number = 1,
    itemsPerPage: number = 50,
    filters: {
        difficulty?: string[];
        tags?: string[];
        searchTerm?: string;
        bookmarkedOnly?: boolean;
        sortBy?: 'id' | 'title' | 'difficulty';
        sortOrder?: 'asc' | 'desc';
    } = {}
) => {
    const data = await fetchCodechefProblems();
    let filteredProblems = [...data.problems];

    // Filter by difficulty
    if (filters.difficulty && filters.difficulty.length > 0) {
        filteredProblems = filteredProblems.filter(p => 
            filters.difficulty!.includes(p.difficulty || 'Unknown')
        );
    }

    // Filter by search term
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredProblems = filteredProblems.filter(p =>
            p.title.toLowerCase().includes(searchLower) ||
            p.code?.toLowerCase().includes(searchLower)
        );
    }

    // Filter by tags
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

    // Filter by bookmarked status
    if (filters.bookmarkedOnly) {
        const bookmarkedIds = getBookmarkedProblems('CodeChef');
        filteredProblems = filteredProblems.filter(p => bookmarkedIds.includes(p.id));
    }

    // Sort problems if sortBy is provided
    if (filters.sortBy) {
        filteredProblems.sort((a, b) => {
            const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
            
            switch (filters.sortBy) {
                case 'id':
                    return (a.id - b.id) * sortOrder;
                case 'title':
                    return a.title.localeCompare(b.title) * sortOrder;
                case 'difficulty':
                    // Define difficulty order for CodeChef
                    const difficultyOrder = { 'Beginner': 1, 'Easy': 2, 'Medium': 3, 'Hard': 4, 'Challenge': 5 };
                    const diffA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0;
                    const diffB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0;
                    return (diffA - diffB) * sortOrder;
                default:
                    return 0;
            }
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
