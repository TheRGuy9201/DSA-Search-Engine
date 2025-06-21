import React from 'react';
import { SearchIcon } from '../components/icons/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useProblemset } from '../hooks/useProblemset';
import type { Problem } from '../types';

// Supported platforms
const PLATFORMS = ['All', 'LeetCode', 'Codeforces'];

// All possible difficulties (combined from both platforms)
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard', 'Beginner', 'Lower-Mid', 'Mid-Level', 'Upper-Mid', 'Very Hard'];

// Common tags from LeetCode and Codeforces problems
const COMMON_TAGS = [
  'All',
  'Arrays',
  'Strings',
  'Linked Lists',
  'Dynamic Programming',
  'Trees',
  'Graphs',
  'Binary Search',
  'Stack',
  'Queue',
  'Greedy',
  'Hash Table',
  'Recursion',
  'Math'
];

interface ProblemWithSource extends Problem {
  source?: string;
}

const getDifficultyColor = (difficulty: string): { bg: string, text: string } => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
    case 'beginner':
      return { bg: 'bg-green-900', text: 'text-green-300' };
    case 'medium':
    case 'lower-mid':
    case 'mid-level':
      return { bg: 'bg-yellow-900', text: 'text-yellow-300' };
    case 'hard':
    case 'upper-mid':
    case 'very hard':
      return { bg: 'bg-red-900', text: 'text-red-300' };
    default:
      return { bg: 'bg-gray-900', text: 'text-gray-300' };
  }
};

const getStatusElement = (status: string) => {
  switch (status) {
    case 'Solved':
      return <span className="text-green-500">✓ Solved</span>;
    case 'Attempted':
      return <span className="text-yellow-500">⚬ Attempted</span>;
    default:
      return <span className="text-gray-400">Not Attempted</span>;
  }
};

const ProblemsetPage: React.FC = () => {
  const {
    loading,
    totalProblems,
    totalPages,
    currentPage,
    setCurrentPage,
    setSearchTerm,
    setPlatform,
    setDifficulty,
    setTag,
    setStatus,
    handleSearch,
    problemsWithUserData,
    toggleBookmark,
    isBookmarked,
    updateProblemStatus
  } = useProblemset();

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button 
        key="prev" 
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-indigo-400 hover:bg-gray-800'}`}
      >
        &laquo;
      </button>
    );

    // First page button if not starting from page 1
    if (startPage > 1) {
      pages.push(
        <button 
          key="1" 
          onClick={() => setCurrentPage(1)}
          className="px-3 py-1 rounded text-indigo-400 hover:bg-gray-800"
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="px-3 py-1">...</span>);
      }
    }

    // Page buttons
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button 
          key={i} 
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded ${i === currentPage ? 'bg-indigo-600 text-white' : 'text-indigo-400 hover:bg-gray-800'}`}
        >
          {i}
        </button>
      );
    }

    // Last page button if not ending with the last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="px-3 py-1">...</span>);
      }
      
      pages.push(
        <button 
          key={totalPages} 
          onClick={() => setCurrentPage(totalPages)}
          className="px-3 py-1 rounded text-indigo-400 hover:bg-gray-800"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button 
        key="next" 
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-indigo-400 hover:bg-gray-800'}`}
      >
        &raquo;
      </button>
    );

    return (
      <div className="flex justify-center space-x-1 mt-6">
        {pages}
      </div>
    );
  };

  return (
    <div className="page-transition min-h-screen flex flex-col items-center p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
        Problem Set
      </h1>
      
      <div className="glass-effect p-4 md:p-6 rounded-xl max-w-6xl w-full mb-8">
        {/* Search and Filters */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search problems..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
              />
              <div className="absolute left-3 top-2.5">
                <SearchIcon />
              </div>
            </div>

            <button 
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full md:w-auto"
            >
              Search
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select 
              onChange={(e) => {
                setPlatform(e.target.value);
              }}
              className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
            >
              {PLATFORMS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select 
              onChange={(e) => {
                setDifficulty(e.target.value);
              }}
              className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
            >
              {DIFFICULTIES.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select 
              onChange={(e) => {
                setTag(e.target.value);
              }}
              className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
            >
              {COMMON_TAGS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select 
              onChange={(e) => {
                setStatus(e.target.value);
              }}
              className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Solved">Solved</option>
              <option value="Attempted">Attempted</option>
              <option value="Not Attempted">Not Attempted</option>
            </select>
          </div>
        </form>

        {/* Problems Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : problemsWithUserData.length > 0 ? (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">#</th>
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Difficulty</th>
                    <th className="text-left py-3 px-4">Source</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {problemsWithUserData.map((problem, index) => {
                      const difficultyStyle = getDifficultyColor(problem.difficulty);
                      const typedProblem = problem as ProblemWithSource;
                      
                      return (
                        <motion.tr
                          key={`${typedProblem.source || 'unknown'}-${problem.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ 
                            delay: index * 0.05,
                            duration: 0.3
                          }}
                          className="border-b border-gray-800 hover:bg-gray-800/50"
                        >
                          <td className="py-3 px-4">{problem.id}</td>
                          <td className="py-3 px-4">
                            <a
                              href={problem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 hover:underline"
                            >
                              {problem.title}
                            </a>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${difficultyStyle.bg} ${difficultyStyle.text}`}>
                              {problem.difficulty}
                            </span>
                          </td>
                          <td className="py-3 px-4">{typedProblem.source || 'Unknown'}</td>
                          <td className="py-3 px-4">{getStatusElement(problem.status || 'Not Attempted')}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toggleBookmark(problem.id)}
                                className={`p-1 rounded hover:bg-gray-700 ${isBookmarked(problem.id) ? 'text-yellow-400' : 'text-gray-400'}`}
                                title={isBookmarked(problem.id) ? 'Remove from bookmarks' : 'Add to bookmarks'}
                              >
                                {isBookmarked(problem.id) ? '★' : '☆'}
                              </button>
                              <div className="relative group">
                                <button className="p-1 rounded hover:bg-gray-700 text-gray-400">
                                  •••
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 hidden group-hover:block">
                                  <div className="py-1">
                                    <button
                                      onClick={() => updateProblemStatus(problem.id, 'Solved')}
                                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                                    >
                                      Mark as Solved
                                    </button>
                                    <button
                                      onClick={() => updateProblemStatus(problem.id, 'Attempted')}
                                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                                    >
                                      Mark as Attempted
                                    </button>
                                    <button
                                      onClick={() => updateProblemStatus(problem.id, 'Not Attempted')}
                                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                                    >
                                      Mark as Not Attempted
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
              
              {/* Display pagination */}
              {renderPagination()}
              
              {/* Display count */}
              <div className="text-center text-gray-400 mt-4">
                Showing {problemsWithUserData.length} of {totalProblems} problems
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-gray-400">
              No problems found matching your filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemsetPage;
