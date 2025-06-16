import React, { useState, useEffect } from 'react';
import { BackIcon, LeetCodeIcon, CodeforcesIcon, SearchIcon, ExternalLinkIcon } from '../components/icons/Icons';

interface PlatformPageProps {
    platform: string;
    onBackClick: () => void;
}

const PlatformPage: React.FC<PlatformPageProps> = ({ platform, onBackClick }) => {
    // Sample problems data for each platform
    const problemData = {
        leetcode: [
            { id: 1, title: 'Two Sum', difficulty: 'Easy', link: 'https://leetcode.com/problems/two-sum/', tags: ['Array', 'Hash Table'] },
            { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', link: 'https://leetcode.com/problems/add-two-numbers/', tags: ['Linked List', 'Math'] },
            { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', tags: ['String', 'Sliding Window'] },
            { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', tags: ['Array', 'Binary Search', 'Divide and Conquer'] },
            { id: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-palindromic-substring/', tags: ['String', 'Dynamic Programming'] }
        ],
        codeforces: [
            { id: 1, title: 'Watermelon', difficulty: 'Easy', link: 'https://codeforces.com/problemset/problem/4/A', tags: ['Math', 'Brute Force'] },
            { id: 2, title: 'Way Too Long Words', difficulty: 'Easy', link: 'https://codeforces.com/problemset/problem/71/A', tags: ['String', 'Implementation'] },
            { id: 3, title: 'Theatre Square', difficulty: 'Medium', link: 'https://codeforces.com/problemset/problem/1/A', tags: ['Math'] },
            { id: 4, title: 'Team', difficulty: 'Easy', link: 'https://codeforces.com/problemset/problem/231/A', tags: ['Greedy', 'Implementation'] },
            { id: 5, title: 'Next Round', difficulty: 'Easy', link: 'https://codeforces.com/problemset/problem/158/A', tags: ['Implementation'] }
        ]
    };

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Simulate loading for effect
        setTimeout(() => setIsLoaded(true), 300);
    }, []);

    const problems = problemData[platform as keyof typeof problemData] || [];
    const platformName = platform === 'leetcode' ? 'LeetCode' : 'Codeforces';
    const platformIcon = platform === 'leetcode' ? <LeetCodeIcon /> : <CodeforcesIcon />;

    // Function to handle problem click - would open in new tab
    const openProblem = (link: string) => {
        window.open(link, '_blank');
    };

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

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search problems..."
                            className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
                        />
                        <div className="absolute left-3 top-2.5">
                            <SearchIcon />
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <select className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none">
                            <option>All Difficulties</option>
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>

                        <select className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none">
                            <option>All Topics</option>
                            <option>Arrays</option>
                            <option>Strings</option>
                            <option>Linked Lists</option>
                            <option>Dynamic Programming</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4">#</th>
                                <th className="text-left py-3 px-4">Title</th>
                                <th className="text-left py-3 px-4">Difficulty</th>
                                <th className="text-left py-3 px-4">Tags</th>
                                <th className="text-left py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {problems.map((problem, index) => (
                                <tr
                                    key={problem.id}
                                    className={`border-b border-gray-800 hover:bg-gray-800 transition-all duration-300 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-5'
                                        }`}
                                    style={{ transitionDelay: `${index * 0.1 + 0.3}s` }}
                                >
                                    <td className="py-3 px-4">{problem.id}</td>
                                    <td className="py-3 px-4 text-indigo-400 hover:text-indigo-300 transition-colors">{problem.title}</td>
                                    <td className="py-3 px-4">{getDifficultyBadge(problem.difficulty)}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {problem.tags.map(tag => (
                                                <span key={tag} className="px-2 py-1 text-xs bg-gray-800 rounded-full border border-gray-700 hover:border-indigo-500 transition-colors">{tag}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => openProblem(problem.link)}
                                            className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 rounded hover:from-indigo-500 hover:to-blue-500 transition-all duration-300 flex items-center gap-1.5"
                                        >
                                            <span>Open</span>
                                            <ExternalLinkIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PlatformPage;
