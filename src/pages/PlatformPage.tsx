import React, { useState, useEffect } from 'react';
import { BackIcon, LeetCodeIcon, CodeforcesIcon, SearchIcon, ExternalLinkIcon, CheckCircleIcon, CircleIcon } from '../components/icons/Icons';
import { getPaginatedLeetcodeProblems } from '../services/problemsApi';
import { useProblemUserData } from '../hooks/useProblemUserData';
import type { Problem } from '../types';

interface PlatformPageProps {
    platform: string;
    onBackClick: () => void;
}

const PlatformPage: React.FC<PlatformPageProps> = ({ platform, onBackClick }) => {
    // States for problem data
    const [problems, setProblems] = useState<Problem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    // Get user data (bookmarks and status) with the custom hook
    const {
        problemsWithUserData,
        toggleBookmark,
        updateProblemStatus,
    } = useProblemUserData(problems);

    // Placeholder data for Codeforces (until we implement the scraper)
    const codeforcesProblems = [
        { id: 1, title: 'Watermelon', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/4/A', tags: ['Math', 'Brute Force'] },
        { id: 2, title: 'Way Too Long Words', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/71/A', tags: ['String', 'Implementation'] },
        { id: 3, title: 'Theatre Square', difficulty: 'Medium', url: 'https://codeforces.com/problemset/problem/1/A', tags: ['Math'] },
        { id: 4, title: 'Team', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/231/A', tags: ['Greedy', 'Implementation'] },
        { id: 5, title: 'Next Round', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/158/A', tags: ['Implementation'] }
    ];

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
                    // For now, use the placeholder data
                    setProblems(codeforcesProblems);
                    setTotalProblems(codeforcesProblems.length);
                    setTotalPages(1);
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

    const platformName = platform === 'leetcode' ? 'LeetCode' : 'Codeforces';
    const platformIcon = platform === 'leetcode' ? <LeetCodeIcon /> : <CodeforcesIcon />;

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

    // Difficulty badge helper function

    // Difficulty badge color based on difficulty level
    const getDifficultyBadge = (difficulty: string) => {
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
    };

    // No unused helper functions

    return (
        <div className="page-transition min-h-screen flex flex-col items-center p-8">
            <div className="w-full max-w-6xl relative">
                {/* Back button - always returns to home */}
                <button
                    onClick={onBackClick}
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
                    <p className="text-gray-400">Explore and solve problems from {platformName}</p>
                </div>
            </div>

            <div className={`glass-effect p-6 rounded-xl max-w-6xl w-full mb-8 relative overflow-hidden transition-all duration-700 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-20'
                }`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

                <div className="flex flex-col gap-4 mb-6">
                    {/* Filter dropdowns row */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex gap-2 items-center">
                            <select
                                className="bg-gray-800 rounded-lg px-3 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none w-28"
                                value={selectedDifficulty}
                                onChange={handleDifficultyChange}
                            >
                                <option value="All">Difficulty</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>

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
                                {problemsWithUserData.filter(problem => {
                                    // Apply additional client-side filters
                                    if (showBookmarkedOnly && !problem.bookmarked) {
                                        return false;
                                    }
                                    if (selectedStatus !== 'All' && problem.status !== selectedStatus) {
                                        return false;
                                    }
                                    // Note: Topic filtering is now handled in the useEffect
                                    // that fetches the problems, so we don't need to check for topics here
                                    return true;
                                }).map((problem, index) => (
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
                                                {problem.status === 'Solved' ? (
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
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-center">{getDifficultyBadge(problem.difficulty)}</td>
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

                        {problemsWithUserData.filter(problem => {
                            if (showBookmarkedOnly && !problem.bookmarked) {
                                return false;
                            }
                            if (selectedStatus !== 'All' && problem.status !== selectedStatus) {
                                return false;
                            }
                            // Topic filtering is now handled in the useEffect
                            return true;
                        }).length === 0 && (
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
                {totalPages > 1 && (
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
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Calculate page numbers to show around current page
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
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
                            className={`px-3 py-1 rounded-md ${currentPage === totalPages
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-800 text-white hover:bg-indigo-600'}`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>

                        <button
                            className={`px-3 py-1 rounded-md ${currentPage === totalPages
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-800 text-white hover:bg-indigo-600'}`}
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            Last
                        </button>

                        <span className="text-sm text-gray-400 ml-2">
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>
                )}

                {/* Updated information */}
                <div className="text-center text-sm text-gray-500 mt-4">
                    Showing {problemsWithUserData.filter(problem => {
                        if (showBookmarkedOnly && !problem.bookmarked) return false;
                        if (selectedStatus !== 'All' && problem.status !== selectedStatus) return false;
                        // Topic filtering is now handled in the useEffect
                        return true;
                    }).length} of {totalProblems} problems
                </div>
            </div>
        </div>
    );
};

export default PlatformPage;
