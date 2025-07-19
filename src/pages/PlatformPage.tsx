import React, { useState, useEffect } from 'react';
import { BackIcon, LeetCodeIcon, CodeforcesIcon, CodeChefIcon, SearchIcon, ExternalLinkIcon, CheckCircleIcon, CircleIcon } from '../components/icons/Icons';
import { getPaginatedLeetcodeProblems, getPaginatedCodeforcesProblems, getPaginatedCodechefProblems } from '../services/problemsApi';
import { useProblemUserData } from '../hooks/useProblemUserData';
import type { Problem } from '../types';
import { useParams, useNavigate } from 'react-router-dom';

interface PlatformPageProps {
    platform?: string;
    onBackClick?: () => void;
}

const PlatformPage: React.FC<PlatformPageProps> = ({ platform: propsPlatform, onBackClick }) => {
    const { platformName: urlPlatformName } = useParams<{ platformName: string }>();
    const navigate = useNavigate();

    // Use the platform from props or from URL params
    const platform = urlPlatformName || propsPlatform || '';

    // States for problem data
    const [problems, setProblems] = useState<Problem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filteredInfo, setFilteredInfo] = useState<string | null>(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProblems, setTotalProblems] = useState(0);
    const itemsPerPage = 30;

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
    const [showTopicTags, setShowTopicTags] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Calculate difficulty based on points for Codeforces problems
    const getCodeforcesDifficulty = (problem: Problem) => {
        const points = problem.points as number | null;

        if (points === null || points === undefined) return problem.difficulty;

        if (points <= 1000) return "Beginner";
        if (points <= 1300) return "Easy";
        if (points <= 1600) return "Lower-Mid";
        if (points <= 1900) return "Mid-Level";
        if (points <= 2200) return "Upper-Mid";
        if (points <= 2500) return "Hard";
        return "Very Hard";
    };

    // Get user data (bookmarks and status) with the custom hook
    const {
        problemsWithUserData,
        toggleBookmark,
        updateProblemStatus,
    } = useProblemUserData(problems);

    // Compute filtered problems for consistent filtering and pagination
    const filteredProblemsWithUserData = React.useMemo(() => {
        return problemsWithUserData.filter(problem => {
            // Apply status filter
            if (selectedStatus !== 'All' && problem.status !== selectedStatus) {
                return false;
            }
            // Apply bookmark filter
            if (showBookmarkedOnly && !problem.bookmarked) {
                return false;
            }
            // Topic filtering is handled in the useEffect that fetches problems
            return true;
        });
    }, [problemsWithUserData, selectedStatus, showBookmarkedOnly]);

    // Compute pagination for filtered results
    const filteredPaginationInfo = React.useMemo(() => {
        const hasClientSideFilters = selectedStatus !== 'All' || showBookmarkedOnly;
        
        if (!hasClientSideFilters) {
            // Use server-side pagination
            return {
                currentPageProblems: filteredProblemsWithUserData,
                totalFilteredProblems: totalProblems,
                totalFilteredPages: totalPages,
                shouldUsePagination: true
            };
        }
        
        // Use client-side pagination for filtered results
        const totalFilteredProblems = filteredProblemsWithUserData.length;
        const totalFilteredPages = Math.ceil(totalFilteredProblems / itemsPerPage);
        const adjustedCurrentPage = Math.min(currentPage, totalFilteredPages || 1);
        
        const startIndex = (adjustedCurrentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentPageProblems = filteredProblemsWithUserData.slice(startIndex, endIndex);
        
        return {
            currentPageProblems,
            totalFilteredProblems,
            totalFilteredPages,
            adjustedCurrentPage,
            shouldUsePagination: true
        };
    }, [filteredProblemsWithUserData, currentPage, itemsPerPage, selectedStatus, showBookmarkedOnly, totalProblems, totalPages]);

    // Adjust current page when filtered results change
    useEffect(() => {
        if (filteredPaginationInfo.adjustedCurrentPage && filteredPaginationInfo.adjustedCurrentPage !== currentPage) {
            setCurrentPage(filteredPaginationInfo.adjustedCurrentPage);
        }
    }, [filteredPaginationInfo.adjustedCurrentPage, currentPage]);

    // Function to cycle through problem status (only for LeetCode)
    const toggleProblemStatus = (problemId: number, currentStatus: string) => {
        if (platform !== 'leetcode') return; // Only allow status changes for LeetCode
        
        let newStatus: 'Solved' | 'Attempted' | 'Not Attempted';
        
        switch (currentStatus) {
            case 'Not Attempted':
                newStatus = 'Attempted';
                break;
            case 'Attempted':
                newStatus = 'Solved';
                break;
            case 'Solved':
                newStatus = 'Not Attempted';
                break;
            default:
                newStatus = 'Attempted';
        }
        
        updateProblemStatus(problemId, newStatus, 'leetcode');
    };

    // Topic options for different platforms
    const getTopicOptions = () => {
        if (platform === 'leetcode') {
            return (
                <>
                    <option value="Array">Array</option>
                    <option value="String">String</option>
                    <option value="Hash Table">Hash Table</option>
                    <option value="Dynamic Programming">DP</option>
                    <option value="Math">Math</option>
                    <option value="Sorting">Sorting</option>
                    <option value="Greedy">Greedy</option>
                    <option value="Depth-First Search">DFS</option>
                    <option value="Binary Search">Binary Search</option>
                    <option value="Tree">Tree</option>
                </>
            );
        } else if (platform === 'codechef') {
            return (
                <>
                    <option value="implementation">Implementation</option>
                    <option value="basic programming">Basic Programming</option>
                    <option value="conditional statements">Conditional</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="dynamic programming">DP</option>
                    <option value="greedy">Greedy</option>
                    <option value="strings">Strings</option>
                    <option value="number theory">Number Theory</option>
                    <option value="memoization">Memoization</option>
                    <option value="algorithms">Algorithms</option>
                </>
            );
        } else {
            return (
                <>
                    <option value="implementation">Implementation</option>
                    <option value="math">Math</option>
                    <option value="greedy">Greedy</option>
                    <option value="dp">DP</option>
                    <option value="data structures">Data Structures</option>
                    <option value="brute force">Brute Force</option>
                    <option value="constructive algorithms">Constructive</option>
                    <option value="graphs">Graphs</option>
                    <option value="sortings">Sorting</option>
                    <option value="binary search">Binary Search</option>
                </>
            );
        }
    };

    // Debounce search term
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Fetch problems based on platform, page and filters
    useEffect(() => {
        const fetchProblems = async () => {
            setIsLoading(true);

            try {
                if (platform === 'leetcode') {
                    // For selected topics, fetch ALL problems (not just the current page)
                    // and then filter them client-side
                    const fetchAllProblems = selectedTopics.length > 0;

                    // Different approach based on whether we need all problems or just the current page
                    let allProblems: Problem[] = [];

                    if (fetchAllProblems) {
                        // Fetch all problems without pagination
                        const { problems: allFetchedProblems } = await getPaginatedLeetcodeProblems(1, 5000, {
                            difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
                            searchTerm: debouncedSearchTerm || undefined
                        });

                        allProblems = allFetchedProblems;
                        console.log(`Fetched ${allProblems.length} total problems for topic filtering`);
                    } else {
                        // Normal paginated fetch when no topics selected
                        const { problems: fetchedProblems, totalProblems, totalPages } =
                            await getPaginatedLeetcodeProblems(currentPage, itemsPerPage, {
                                difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
                                searchTerm: debouncedSearchTerm || undefined
                            });

                        allProblems = fetchedProblems;
                        setTotalProblems(totalProblems);
                        setTotalPages(totalPages);
                    }

                    // Add sample tags if they're missing - this is just for demonstration
                    const sampleTags = [
                        ['Array', 'Hash Table', 'Two Pointers'],
                        ['Linked List', 'Math', 'Recursion'],
                        ['Hash Table', 'String', 'Sliding Window'],
                        ['Binary Search', 'Depth-First Search'],
                        ['Dynamic Programming', 'Greedy'],
                        ['String', 'Array', 'Dynamic Programming'],
                        ['Math', 'Greedy', 'Sorting'],
                        ['Tree', 'Binary Search', 'Depth-First Search'],
                        ['Graph', 'Breadth-First Search', 'Union Find'],
                        ['Stack', 'Queue', 'Heap']
                    ];

                    const problemsWithTags = allProblems.map((problem, index) => {
                        if (!problem.tags || problem.tags.length === 0) {
                            return {
                                ...problem,
                                tags: sampleTags[index % sampleTags.length]
                            };
                        }
                        return problem;
                    });

                    let filteredProblems = problemsWithTags;

                    // Apply topic filtering if topics are selected
                    if (selectedTopics.length > 0) {
                        // Find problems that match ANY of the selected topics
                        filteredProblems = problemsWithTags.filter(problem => {
                            if (!problem.tags || problem.tags.length === 0) return false;

                            // Check if problem has any of the selected topics
                            return selectedTopics.some(topic =>
                                problem.tags?.some(tag =>
                                    tag.toLowerCase().includes(topic.toLowerCase())
                                )
                            );
                        });

                        // Still sort so that problems with all topics appear first
                        // but without any visual indicator
                        const problemsWithAllTopics = filteredProblems.filter(problem => {
                            if (!problem.tags || problem.tags.length === 0) return false;

                            return selectedTopics.every(topic =>
                                problem.tags?.some(tag =>
                                    tag.toLowerCase().includes(topic.toLowerCase())
                                )
                            );
                        });

                        const allTopicsIds = new Set(problemsWithAllTopics.map(p => p.id));

                        filteredProblems.sort((a, b) => {
                            if (allTopicsIds.has(a.id) && !allTopicsIds.has(b.id)) return -1;
                            if (!allTopicsIds.has(a.id) && allTopicsIds.has(b.id)) return 1;
                            return 0;
                        });

                        console.log(`Found ${filteredProblems.length} problems with ANY selected topic`);
                        console.log(`Found ${problemsWithAllTopics.length} problems with ALL selected topics`);
                    }

                    // For topic filtering, handle pagination client-side
                    if (selectedTopics.length > 0) {
                        const totalFilteredProblems = filteredProblems.length;
                        const totalFilteredPages = Math.ceil(totalFilteredProblems / itemsPerPage);

                        // Adjust current page if it's out of bounds
                        const adjustedCurrentPage = Math.min(currentPage, totalFilteredPages || 1);

                        // Get the slice for the current page
                        const startIndex = (adjustedCurrentPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedProblems = filteredProblems.slice(startIndex, endIndex);

                        setProblems(paginatedProblems);
                        setTotalProblems(totalFilteredProblems);
                        setTotalPages(totalFilteredPages);

                        if (adjustedCurrentPage !== currentPage) {
                            setCurrentPage(adjustedCurrentPage);
                        }
                    } else {
                        setProblems(filteredProblems);
                    }
                } else if (platform === 'codeforces') {
                    // For Codeforces, we'll follow a similar approach as LeetCode
                    const fetchAllProblems = selectedTopics.length > 0;

                    // Different approach based on whether we need all problems or just the current page
                    let allProblems: Problem[] = [];

                    // Fetch problems with pagination
                    if (fetchAllProblems) {
                        // Fetch all problems without pagination for topic filtering
                        const { problems: allFetchedProblems } = await getPaginatedCodeforcesProblems(1, 5000, {
                            difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
                            searchTerm: debouncedSearchTerm || undefined
                        });

                        allProblems = allFetchedProblems;
                        console.log(`Fetched ${allProblems.length} total Codeforces problems for topic filtering`);

                        // Set filtered info message
                        setFilteredInfo("Note: Problems with no tags are automatically filtered out.");
                    } else {
                        // Normal paginated fetch
                        const { problems: fetchedProblems, totalProblems, totalPages } =
                            await getPaginatedCodeforcesProblems(currentPage, itemsPerPage, {
                                difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
                                searchTerm: debouncedSearchTerm || undefined
                            });

                        allProblems = fetchedProblems;
                        setTotalProblems(totalProblems);
                        setTotalPages(totalPages);

                        // Set filtered info message
                        setFilteredInfo("Note: Problems with no tags are automatically filtered out.");
                    }

                    // Apply filtering based on topics if needed
                    let filteredProblems = allProblems;

                    if (selectedTopics.length > 0) {
                        // Find problems that match ANY of the selected topics
                        filteredProblems = allProblems.filter(problem => {
                            if (!problem.tags || problem.tags.length === 0) return false;

                            // Check if problem has any of the selected topics
                            return selectedTopics.some(topic =>
                                problem.tags?.some(tag =>
                                    tag.toLowerCase().includes(topic.toLowerCase())
                                )
                            );
                        });

                        // Still sort so that problems with all topics appear first
                        const problemsWithAllTopics = filteredProblems.filter(problem => {
                            if (!problem.tags || problem.tags.length === 0) return false;

                            return selectedTopics.every(topic =>
                                problem.tags?.some(tag =>
                                    tag.toLowerCase().includes(topic.toLowerCase())
                                )
                            );
                        });

                        const allTopicsIds = new Set(problemsWithAllTopics.map(p => p.id));

                        filteredProblems.sort((a, b) => {
                            if (allTopicsIds.has(a.id) && !allTopicsIds.has(b.id)) return -1;
                            if (!allTopicsIds.has(a.id) && allTopicsIds.has(b.id)) return 1;
                            return 0;
                        });

                        console.log(`Found ${filteredProblems.length} Codeforces problems with ANY selected topic`);
                        console.log(`Found ${problemsWithAllTopics.length} Codeforces problems with ALL selected topics`);
                    }

                    // For topic filtering, handle pagination client-side
                    if (selectedTopics.length > 0) {
                        const totalFilteredProblems = filteredProblems.length;
                        const totalFilteredPages = Math.ceil(totalFilteredProblems / itemsPerPage);

                        // Adjust current page if it's out of bounds
                        const adjustedCurrentPage = Math.min(currentPage, totalFilteredPages || 1);

                        // Get the slice for the current page
                        const startIndex = (adjustedCurrentPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedProblems = filteredProblems.slice(startIndex, endIndex);

                        setProblems(paginatedProblems);
                        setTotalProblems(totalFilteredProblems);
                        setTotalPages(totalFilteredPages);

                        if (adjustedCurrentPage !== currentPage) {
                            setCurrentPage(adjustedCurrentPage);
                        }
                    } else {
                        setProblems(filteredProblems);
                    }
                } else if (platform === 'codechef') {
                    // For CodeChef, follow a similar approach as LeetCode and Codeforces
                    const fetchAllProblems = selectedTopics.length > 0;

                    // Different approach based on whether we need all problems or just the current page
                    let allProblems: Problem[] = [];

                    // Fetch problems with pagination
                    if (fetchAllProblems) {
                        // Fetch all problems without pagination for topic filtering
                        const { problems: allFetchedProblems } = await getPaginatedCodechefProblems(1, 5000, {
                            difficulty: selectedDifficulty !== 'All' ? [selectedDifficulty] : undefined,
                            searchTerm: debouncedSearchTerm || undefined
                        });

                        allProblems = allFetchedProblems;
                        console.log(`Fetched ${allProblems.length} total CodeChef problems for topic filtering`);

                        // Set filtered info message
                        setFilteredInfo("Note: Problems with no tags are automatically filtered out.");
                    } else {
                        // Normal paginated fetch
                        const { problems: fetchedProblems, totalProblems, totalPages } =
                            await getPaginatedCodechefProblems(currentPage, itemsPerPage, {
                                difficulty: selectedDifficulty !== 'All' ? [selectedDifficulty] : undefined,
                                searchTerm: debouncedSearchTerm || undefined
                            });

                        allProblems = fetchedProblems;
                        setTotalProblems(totalProblems);
                        setTotalPages(totalPages);

                        // Set filtered info message
                        setFilteredInfo("Note: Problems with no tags are automatically filtered out.");
                    }

                    // Apply filtering based on topics if needed
                    let filteredProblems = allProblems;

                    if (selectedTopics.length > 0) {
                        // Find problems that match ANY of the selected topics
                        filteredProblems = allProblems.filter(problem => {
                            if (!problem.tags || problem.tags.length === 0) return false;

                            // Check if problem has any of the selected topics
                            return selectedTopics.some(topic =>
                                problem.tags?.some(tag =>
                                    tag.toLowerCase().includes(topic.toLowerCase())
                                )
                            );
                        });

                        // Still sort so that problems with all topics appear first
                        const problemsWithAllTopics = filteredProblems.filter(problem => {
                            if (!problem.tags || problem.tags.length === 0) return false;

                            return selectedTopics.every(topic =>
                                problem.tags?.some(tag =>
                                    tag.toLowerCase().includes(topic.toLowerCase())
                                )
                            );
                        });

                        const allTopicsIds = new Set(problemsWithAllTopics.map(p => p.id));

                        filteredProblems.sort((a, b) => {
                            if (allTopicsIds.has(a.id) && !allTopicsIds.has(b.id)) return -1;
                            if (!allTopicsIds.has(a.id) && allTopicsIds.has(b.id)) return 1;
                            return 0;
                        });

                        console.log(`Found ${filteredProblems.length} CodeChef problems with ANY selected topic`);
                        console.log(`Found ${problemsWithAllTopics.length} CodeChef problems with ALL selected topics`);
                    }

                    // For topic filtering, handle pagination client-side
                    if (selectedTopics.length > 0) {
                        const totalFilteredProblems = filteredProblems.length;
                        const totalFilteredPages = Math.ceil(totalFilteredProblems / itemsPerPage);

                        // Adjust current page if it's out of bounds
                        const adjustedCurrentPage = Math.min(currentPage, totalFilteredPages || 1);

                        // Get the slice for the current page
                        const startIndex = (adjustedCurrentPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedProblems = filteredProblems.slice(startIndex, endIndex);

                        setProblems(paginatedProblems);
                        setTotalProblems(totalFilteredProblems);
                        setTotalPages(totalFilteredPages);

                        if (adjustedCurrentPage !== currentPage) {
                            setCurrentPage(adjustedCurrentPage);
                        }
                    } else {
                        setProblems(filteredProblems);
                    }
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching problems:', err);
                setError('Failed to load problems. Please try again later.');
                setProblems([]);
            } finally {
                setIsLoading(false);
                // For smooth transition animation
                setTimeout(() => setIsLoaded(true), 300);
            }
        };

        fetchProblems();
    }, [platform, currentPage, selectedDifficulty, debouncedSearchTerm, selectedTopics, itemsPerPage]);

    // Debug code to log problem tags when they arrive
    useEffect(() => {
        if (!isLoading && problems.length > 0) {
            console.log("Problems with tags:", problems.map(p => ({ id: p.id, title: p.title, tags: p.tags })));
        }
    }, [problems, isLoading]);

    // Debug logging for topic filtering
    useEffect(() => {
        if (!isLoading && problems.length > 0) {
            // Count how many problems have each topic
            const topicCounts: Record<string, number> = {};

            problems.forEach(problem => {
                if (problem.tags && problem.tags.length > 0) {
                    problem.tags.forEach(tag => {
                        if (!topicCounts[tag]) {
                            topicCounts[tag] = 1;
                        } else {
                            topicCounts[tag]++;
                        }
                    });
                }
            });

            // Sort topics by frequency
            const sortedTopics = Object.entries(topicCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 15); // Show top 15 topics

            console.log("Most common topics in current problem set:",
                sortedTopics.map(([topic, count]) => `${topic} (${count})`).join(', '));

            // Log selected topics
            if (selectedTopics.length > 0) {
                console.log("Currently filtering by topics:", selectedTopics.join(', '));

                // For each selected topic, count how many problems have it
                selectedTopics.forEach(topic => {
                    const count = problems.filter(p =>
                        p.tags?.some(t => t.toLowerCase().includes(topic.toLowerCase()))
                    ).length;

                    console.log(`Problems with topic "${topic}": ${count}`);
                });
            }
        }
    }, [problems, selectedTopics, isLoading]);

    const platformName = platform === 'leetcode' ? 'LeetCode' : platform === 'codeforces' ? 'Codeforces' : 'CodeChef';
    const platformIcon = platform === 'leetcode' ? <LeetCodeIcon /> : platform === 'codeforces' ? <CodeforcesIcon /> : <CodeChefIcon />;

    // Function to handle problem click - would open in new tab
    const openProblem = (url: string) => {
        window.open(url, '_blank');
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    // Handle difficulty filter change
    const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDifficulty(e.target.value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Handle topic filter change
    const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const topic = e.target.value;
        if (topic === '') {
            return; // Do nothing if no topic selected
        }

        if (!selectedTopics.includes(topic)) {
            setSelectedTopics(prevTopics => [...prevTopics, topic]);
        }

        // Reset dropdown value
        e.target.value = '';
        setCurrentPage(1);
    };

    // Remove a topic from filter
    const removeTopic = (topicToRemove: string) => {
        setSelectedTopics(prevTopics =>
            prevTopics.filter(topic => topic !== topicToRemove)
        );
        setCurrentPage(1);
    };

    // Toggle show topic tags
    const toggleShowTopicTags = () => {
        console.log("Toggling topic tags, current state:", showTopicTags);
        setShowTopicTags(prevState => !prevState);
    };

    // For displaying info about Codeforces difficulty levels
    const renderCodeforcesTooltip = () => {
        if (platform === 'codeforces') {
            return (
                <div className="relative ml-2 group">
                    <div className="cursor-help text-gray-400 hover:text-indigo-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                        </svg>
                    </div>
                    <div className="hidden group-hover:block absolute left-0 bottom-full mb-2 bg-gray-900 text-white text-sm p-3 rounded-lg shadow-lg w-60 z-10">
                        <h4 className="font-bold mb-1 border-b border-gray-700 pb-1">Codeforces Difficulty Levels:</h4>
                        <ul className="text-xs space-y-1">
                            <li><span className="inline-block w-20 font-medium">Beginner:</span> 800 – 1000</li>
                            <li><span className="inline-block w-20 font-medium">Easy:</span> 1100 – 1300</li>
                            <li><span className="inline-block w-20 font-medium">Lower-Mid:</span> 1400 – 1600</li>
                            <li><span className="inline-block w-20 font-medium">Mid-Level:</span> 1700 – 1900</li>
                            <li><span className="inline-block w-20 font-medium">Upper-Mid:</span> 2000 – 2200</li>
                            <li><span className="inline-block w-20 font-medium">Hard:</span> 2300 – 2500</li>
                            <li><span className="inline-block w-20 font-medium">Very Hard:</span> 2600 – 3000+</li>
                        </ul>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Difficulty badge color based on difficulty level
    const getDifficultyBadge = (difficulty: string, problem?: Problem) => {
        // For Codeforces-specific difficulties
        if (platform === 'codeforces' && problem) {
            // Calculate difficulty based on points
            const calculatedDifficulty = getCodeforcesDifficulty(problem);
            const difficultyLower = calculatedDifficulty.toLowerCase();

            // Render the badge with points info if available
            const pointsDisplay = problem.points ? ` (${problem.points})` : '';

            switch (difficultyLower) {
                case 'beginner':
                    return <span className="platform-difficulty-badge difficulty-beginner">Beginner{pointsDisplay}</span>;
                case 'easy':
                    return <span className="platform-difficulty-badge difficulty-easy">Easy{pointsDisplay}</span>;
                case 'lower-mid':
                    return <span className="platform-difficulty-badge difficulty-lower-mid">Lower-Mid{pointsDisplay}</span>;
                case 'mid-level':
                    return <span className="platform-difficulty-badge difficulty-mid-level">Mid-Level{pointsDisplay}</span>;
                case 'upper-mid':
                    return <span className="platform-difficulty-badge difficulty-upper-mid">Upper-Mid{pointsDisplay}</span>;
                case 'hard':
                    return <span className="platform-difficulty-badge difficulty-hard">Hard{pointsDisplay}</span>;
                case 'very hard':
                    return <span className="platform-difficulty-badge difficulty-very-hard">Very Hard{pointsDisplay}</span>;
                default:
                    return <span className="platform-difficulty-badge">{calculatedDifficulty}{pointsDisplay}</span>;
            }
        }
        // For CodeChef difficulties
        else if (platform === 'codechef') {
            switch (difficulty.toLowerCase()) {
                case 'beginner':
                    return <span className="px-2 py-1 rounded-full text-xs bg-blue-900 text-blue-300">Beginner</span>;
                case 'easy':
                    return <span className="px-2 py-1 rounded-full text-xs bg-green-900 text-green-300">Easy</span>;
                case 'medium':
                    return <span className="px-2 py-1 rounded-full text-xs bg-yellow-900 text-yellow-300">Medium</span>;
                case 'hard':
                    return <span className="px-2 py-1 rounded-full text-xs bg-red-900 text-red-300">Hard</span>;
                default:
                    return <span className="px-2 py-1 rounded-full text-xs bg-gray-900 text-gray-300">{difficulty}</span>;
            }
        }
        // For LeetCode and default difficulties
        else {
            switch (difficulty.toLowerCase()) {
                case 'easy':
                    return <span className="px-2 py-1 rounded-full text-xs bg-green-900 text-green-300">Easy</span>;
                case 'medium':
                    return <span className="px-2 py-1 rounded-full text-xs bg-yellow-900 text-yellow-300">Medium</span>;
                case 'hard':
                    return <span className="px-2 py-1 rounded-full text-xs bg-red-900 text-red-300">Hard</span>;
                default:
                    return <span className="px-2 py-1 rounded-full text-xs bg-gray-900 text-gray-300">{difficulty}</span>;
            }
        }
    };

    return (
        <div className="page-transition min-h-screen flex flex-col items-center p-8">
            <div className="w-full max-w-6xl relative">                {/* Back button - returns to home */}
                <button
                    onClick={() => {
                        if (onBackClick) {
                            onBackClick();
                        } else {
                            navigate('/');
                        }
                    }}
                    className="absolute left-0 top-0 flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300"
                >
                    <BackIcon />
                    <span>Back to Home</span>
                </button>

                {/* Platform header - simplified */}
                <div className="flex flex-col items-center mb-12">
                    <div className="w-16 h-16 mb-4 flex items-center justify-center">
                        {platformIcon}
                    </div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500 mb-2">
                        {platformName} Problems
                    </h1>
                    <div className="flex items-center gap-4 mb-4">
                        <p className="text-gray-400">Explore and solve problems from {platformName}</p>
                        {platform === 'codeforces' && renderCodeforcesTooltip()}
                    </div>
                    
                    {platform === 'leetcode' && (
                        <div className="mb-4 text-sm text-blue-400 bg-blue-900/20 p-3 rounded-lg">
                            <p>💡 <strong>Tip:</strong> Click on the status column to toggle between "Not Attempted" → "Attempted" → "Solved". Changes will be reflected in the main problem set.</p>
                        </div>
                    )}                    {platform === 'codeforces' && (
                        <div className="mt-4 text-sm text-gray-400 bg-gray-800/50 p-3 rounded-lg max-w-2xl">
                            <p className="mb-2"><strong>Note:</strong> Problems are categorized by difficulty based on their rating points:</p>                            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs">
                                <div><span className="platform-difficulty-badge difficulty-beginner text-xs">Beginner</span>: 800 – 1000</div>
                                <div><span className="platform-difficulty-badge difficulty-easy text-xs">Easy</span>: 1100 – 1300</div>
                                <div><span className="platform-difficulty-badge difficulty-lower-mid text-xs">Lower-Mid</span>: 1400 – 1600</div>
                                <div><span className="platform-difficulty-badge difficulty-mid-level text-xs">Mid-Level</span>: 1700 – 1900</div>
                                <div><span className="platform-difficulty-badge difficulty-upper-mid text-xs">Upper-Mid</span>: 2000 – 2200</div>
                                <div><span className="platform-difficulty-badge difficulty-hard text-xs">Hard</span>: 2300 – 2500</div>
                                <div><span className="platform-difficulty-badge difficulty-very-hard text-xs">Very Hard</span>: 2600+</div>
                            </div>
                            <p className="mt-1 text-xs italic">Recent problems will appear after they are rated.</p>
                            {filteredInfo && (
                                <p className="mt-1 text-xs italic">{filteredInfo}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className={`glass-effect p-6 rounded-xl max-w-6xl w-full mb-8 relative overflow-hidden transition-all duration-700 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-20'
                }`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

                <div className="flex flex-col gap-4 mb-6">
                    {/* Filter dropdowns row */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex gap-2 items-center">
                            <div className="flex items-center">
                                <select
                                    className="bg-gray-800 rounded-lg px-3 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none w-28"
                                    value={selectedDifficulty}
                                    onChange={handleDifficultyChange}
                                >
                                    <option value="All">Difficulty</option>
                                    {platform === 'leetcode' ? (
                                        <>
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </>
                                    ) : platform === 'codechef' ? (
                                        <>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Easy">Easy</option>
                                            <option value="Lower-Mid">Lower-Mid</option>
                                            <option value="Mid-Level">Mid-Level</option>
                                            <option value="Upper-Mid">Upper-Mid</option>
                                            <option value="Hard">Hard</option>
                                            <option value="Very Hard">Very Hard</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <select
                                className="bg-gray-800 rounded-lg px-3 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none w-24"
                                value={selectedStatus}
                                onChange={(e) => {
                                    setSelectedStatus(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="All">Status</option>
                                <option value="Solved">Solved</option>
                                <option value="Attempted">Attempted</option>
                                <option value="Not Attempted">Not Attempted</option>
                            </select>

                            <select
                                className="bg-gray-800 rounded-lg px-3 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none w-24"
                                onChange={(e) => handleTopicChange(e)}
                                value=""
                            >
                                <option value="">Topics</option>
                                {getTopicOptions()}
                            </select>
                        </div>

                        <div className="flex-grow"></div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer select-none text-gray-300 hover:text-indigo-400 transition-colors">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 accent-indigo-500"
                                    checked={showBookmarkedOnly}
                                    onChange={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
                                />
                                <span>Bookmarked only</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer select-none text-gray-300 hover:text-indigo-400 transition-colors">
                                <input
                                    type="checkbox"
                                    id="showTopicTags"
                                    className="w-4 h-4 accent-indigo-500"
                                    checked={showTopicTags}
                                    onChange={toggleShowTopicTags}
                                />
                                <span>Show Topic Tags</span>
                            </label>
                        </div>
                    </div>

                    {/* Selected topics display */}
                    {selectedTopics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 mb-2 p-3 border-t border-b border-gray-800">
                            <span className="text-sm text-gray-400 mr-2">Selected Topics:</span>
                            {selectedTopics.map((topic, idx) => (
                                <span
                                    key={idx}
                                    className="topic-tag flex items-center gap-1"
                                >
                                    {topic}
                                    <button
                                        onClick={() => removeTopic(topic)}
                                        className="ml-1 text-gray-400 hover:text-white"
                                        aria-label={`Remove ${topic} topic`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Search bar row */}
                    <div className="flex w-full gap-2">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search problems..."
                                className="w-full bg-gray-800 rounded-lg pl-10 pr-10 py-2.5 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter' && searchTerm.trim() !== '') {
                                        setDebouncedSearchTerm(searchTerm);
                                    }
                                }}
                            />
                            <div className="absolute left-3 top-3">
                                <SearchIcon />
                            </div>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        <button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium flex items-center gap-2"
                            onClick={() => {
                                // Trigger search with current term
                                if (searchTerm.trim() !== '') {
                                    setDebouncedSearchTerm(searchTerm);
                                }
                            }}
                        >
                            <SearchIcon /> Search
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="loader"></div>
                        <p className="ml-3 text-indigo-400">Loading problems...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center py-20 text-red-400">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700 text-gray-400 text-sm uppercase">
                                    <th className="text-left py-3 px-4">#</th>
                                    <th className="text-left py-3 px-4">Title</th>
                                    <th className="text-center py-3 px-4">Status</th>
                                    <th className="text-center py-3 px-4">Difficulty</th>
                                    <th className="text-center py-3 px-4">Bookmark</th>
                                    <th className="text-center py-3 px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPaginationInfo.currentPageProblems.map((problem, index) => (
                                    <React.Fragment key={problem.id}>
                                        <tr
                                            className={`border-b border-gray-800 hover:bg-gray-800 transition-all duration-300 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-5'
                                                }`}
                                            style={{ transitionDelay: `${index * 0.05 + 0.2}s` }}
                                        >
                                            <td className="py-4 px-4 text-gray-400">{problem.id}</td>
                                            <td className="py-4 px-4">
                                                <a
                                                    href={problem.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                                                >
                                                    {problem.title}
                                                </a>
                                                {showTopicTags && (
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {problem.tags && problem.tags.length > 0 ? (
                                                            <>
                                                                {problem.tags.slice(0, 2).map((tag, idx) => {
                                                                    const isSelectedTopic = selectedTopics.some(topic =>
                                                                        tag.toLowerCase().includes(topic.toLowerCase())
                                                                    );
                                                                    return (
                                                                        <span
                                                                            key={idx}
                                                                            className={`topic-tag ${isSelectedTopic ? 'selected-topic' : ''}`}
                                                                            data-index={idx}
                                                                        >
                                                                            {tag}
                                                                        </span>
                                                                    );
                                                                })}
                                                                {problem.tags.length > 2 && (
                                                                    <div className="tooltip-container">
                                                                        <span className="more-tags-bubble">
                                                                            +{problem.tags.length - 2}
                                                                        </span>
                                                                        <div className="tooltip-content">
                                                                            {problem.tags.slice(2).join(', ')}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-500 text-xs">No tags available</span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {platform === 'leetcode' ? (
                                                    // Clickable status for LeetCode
                                                    <button
                                                        onClick={() => toggleProblemStatus(problem.id, problem.status || 'Not Attempted')}
                                                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 hover:bg-gray-700 cursor-pointer"
                                                        title="Click to toggle status"
                                                    >
                                                        {problem.status === 'Solved' ? (
                                                            <>
                                                                <CheckCircleIcon />
                                                                <span className="text-green-500 text-sm font-medium">Solved</span>
                                                            </>
                                                        ) : problem.status === 'Attempted' ? (
                                                            <>
                                                                <div className="w-4 h-4 rounded-full border-2 border-yellow-500 flex items-center justify-center">
                                                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                                                </div>
                                                                <span className="text-yellow-500 text-sm font-medium">Attempted</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CircleIcon />
                                                                <span className="text-gray-400 text-sm">Not Attempted</span>
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    // Non-clickable status for CodeForces
                                                    problem.status === 'Solved' ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <CheckCircleIcon />
                                                            <span className="text-green-500 text-sm font-medium">Solved</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <CircleIcon />
                                                            <span className="text-gray-400 text-sm">
                                                                {problem.status || 'Not Attempted'}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {platform === 'codeforces'
                                                    ? getDifficultyBadge(problem.difficulty, problem)
                                                    : getDifficultyBadge(problem.difficulty)}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <button
                                                    onClick={() => toggleBookmark(problem.id)}
                                                    className="p-1.5 rounded-full hover:bg-gray-700 transition-all duration-200 focus:outline-none"
                                                    title={problem.bookmarked ? "Remove bookmark" : "Add bookmark"}
                                                >
                                                    <svg
                                                        className={`w-5 h-5 transition-colors duration-300 ${problem.bookmarked ? 'text-indigo-400 fill-current' : 'text-gray-500'}`}
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        {problem.bookmarked ? (
                                                            <path d="M5 3h14a2 2 0 0 1 2 2v16l-7-3.5L7 21V5a2 2 0 0 1 2-2z" />
                                                        ) : (
                                                            <path
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M5 3h14a2 2 0 0 1 2 2v16l-7-3.5L7 21V5a2 2 0 0 1 2-2z"
                                                            />
                                                        )}
                                                    </svg>
                                                </button>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <button
                                                    onClick={() => openProblem(problem.url)}
                                                    className="px-4 py-1.5 border border-indigo-600 text-indigo-400 rounded hover:bg-indigo-600/20 transition-all duration-300 flex items-center justify-center gap-1.5"
                                                    title="Open problem"
                                                >
                                                    <span>Open</span>
                                                    <ExternalLinkIcon />
                                                </button>
                                            </td>
                                        </tr>

                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>

                        {filteredProblemsWithUserData.length === 0 && (
                                <div className="py-12 text-center text-gray-400">
                                    <p>No problems matching your filters.</p>
                                </div>
                            )}
                    </div>
                )}

                {/* Problem status menu */}
                <div className="flex flex-wrap justify-between items-center mt-6 mb-2 px-2">
                    <div className="flex gap-4 text-sm">
                        <button
                            className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-400 transition-colors"
                            onClick={() => {
                                // Mark selected problems as solved
                                problemsWithUserData.forEach(p => {
                                    if (p.status !== 'Solved') {
                                        updateProblemStatus(p.id, 'Solved');
                                    }
                                });
                            }}
                        >
                            <CheckCircleIcon />
                            <span>Mark as Solved</span>
                        </button>
                        <button
                            className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-400 transition-colors"
                            onClick={() => {
                                // Mark selected problems as attempted
                                problemsWithUserData.forEach(p => {
                                    if (p.status !== 'Attempted') {
                                        updateProblemStatus(p.id, 'Attempted');
                                    }
                                });
                            }}
                        >
                            <CircleIcon />
                            <span>Mark as Attempted</span>
                        </button>
                    </div>
                </div>

                {/* Pagination Controls */}
                {filteredPaginationInfo.totalFilteredPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            className={`px-3 py-1 rounded-md ${currentPage === 1
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-800 text-white hover:bg-indigo-600'}`}
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        >
                            First
                        </button>

                        <button
                            className={`px-3 py-1 rounded-md ${currentPage === 1
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-800 text-white hover:bg-indigo-600'}`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, filteredPaginationInfo.totalFilteredPages) }, (_, i) => {
                            // Calculate page numbers to show around current page
                            let pageNum;
                            if (filteredPaginationInfo.totalFilteredPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= filteredPaginationInfo.totalFilteredPages - 2) {
                                pageNum = filteredPaginationInfo.totalFilteredPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    className={`px-3 py-1 rounded-md ${pageNum === currentPage
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-800 text-white hover:bg-indigo-600'}`}
                                    onClick={() => handlePageChange(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            className={`px-3 py-1 rounded-md ${currentPage === filteredPaginationInfo.totalFilteredPages
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-800 text-white hover:bg-indigo-600'}`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === filteredPaginationInfo.totalFilteredPages}
                        >
                            Next
                        </button>

                        <button
                            className={`px-3 py-1 rounded-md ${currentPage === filteredPaginationInfo.totalFilteredPages
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-800 text-white hover:bg-indigo-600'}`}
                            onClick={() => handlePageChange(filteredPaginationInfo.totalFilteredPages)}
                            disabled={currentPage === filteredPaginationInfo.totalFilteredPages}
                        >
                            Last
                        </button>

                        <span className="text-sm text-gray-400 ml-2">
                            Page {currentPage} of {filteredPaginationInfo.totalFilteredPages}
                        </span>
                    </div>
                )}

                {/* Updated information */}
                <div className="text-center text-sm text-gray-500 mt-4">
                    Showing {filteredPaginationInfo.currentPageProblems.length} of {filteredPaginationInfo.totalFilteredProblems} problems
                </div>
            </div>
        </div>
    );
};

export default PlatformPage;
