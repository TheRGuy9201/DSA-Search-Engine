import { useState, useEffect } from 'react';
import type { Problem } from '../types';

// Type for storing user data about problems
interface UserProblemData {
    [compositeId: string]: {
        status: 'Solved' | 'Attempted' | 'Not Attempted';
        bookmarked: boolean;
    };
}

// Helper function to generate composite ID (source-id)
const generateCompositeId = (id: number, source: string): string => {
    return `${source}-${id}`;
}

// Custom hook to manage problem user data (bookmarks and status)
export const useProblemUserData = (problems: Problem[]) => {
    const [userData, setUserData] = useState<UserProblemData>({});

    // Load user data from localStorage on initial render
    useEffect(() => {
        const savedUserData = localStorage.getItem('dsa-search-engine-problem-data');
        if (savedUserData) {
            try {
                setUserData(JSON.parse(savedUserData));
            } catch (e) {
                console.error('Error parsing saved problem data:', e);
            }
        }
    }, []);

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

    // Function to get problem status
    const getProblemStatus = (problemId: number, source: string = 'unknown'): 'Solved' | 'Attempted' | 'Not Attempted' => {
        const compositeId = generateCompositeId(problemId, source);
        return userData[compositeId]?.status || 'Not Attempted';
    };

    // Apply user data to problems
    const problemsWithUserData = problems.map(problem => {
        const source = (problem as any).source || 'unknown';
        return {
            ...problem,
            status: getProblemStatus(problem.id, source),
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
