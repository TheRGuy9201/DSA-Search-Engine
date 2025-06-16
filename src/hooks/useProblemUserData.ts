import { useState, useEffect } from 'react';
import type { Problem } from '../types';

// Type for storing user data about problems
interface UserProblemData {
    [id: number]: {
        status: 'Solved' | 'Attempted' | 'Not Attempted';
        bookmarked: boolean;
    };
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
    const toggleBookmark = (problemId: number) => {
        setUserData(prev => {
            const current = prev[problemId] || { status: 'Not Attempted', bookmarked: false };
            return {
                ...prev,
                [problemId]: {
                    ...current,
                    bookmarked: !current.bookmarked
                }
            };
        });
    };

    // Function to update problem status
    const updateProblemStatus = (problemId: number, status: 'Solved' | 'Attempted' | 'Not Attempted') => {
        setUserData(prev => {
            const current = prev[problemId] || { status: 'Not Attempted', bookmarked: false };
            return {
                ...prev,
                [problemId]: {
                    ...current,
                    status
                }
            };
        });
    };

    // Function to check if problem is bookmarked
    const isBookmarked = (problemId: number): boolean => {
        return !!userData[problemId]?.bookmarked;
    };

    // Function to get problem status
    const getProblemStatus = (problemId: number): 'Solved' | 'Attempted' | 'Not Attempted' => {
        return userData[problemId]?.status || 'Not Attempted';
    };

    // Apply user data to problems
    const problemsWithUserData = problems.map(problem => ({
        ...problem,
        status: getProblemStatus(problem.id),
        bookmarked: isBookmarked(problem.id)
    }));

    return {
        problemsWithUserData,
        toggleBookmark,
        updateProblemStatus,
        isBookmarked,
        getProblemStatus
    };
};
