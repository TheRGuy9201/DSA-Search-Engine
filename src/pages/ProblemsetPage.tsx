import React, { useState } from 'react';
import { SearchIcon } from '../components/icons/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useProblemset } from '../hooks/useProblemset';
import { useProblemStats } from '../hooks/useProblemStats';
import { useAuth } from '../context/AuthContext';
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

// Sort options
const SORT_OPTIONS = [
  { value: 'id', label: 'ID' },
  { value: 'title', label: 'Title' },
  { value: 'difficulty', label: 'Difficulty' }
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

// Icon components
const SortIcon = ({ direction }: { direction: 'asc' | 'desc' | null }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={`h-4 w-4 transition-transform ${direction === 'desc' ? 'rotate-180' : ''}`} 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
  </svg>
);

const BookmarkIcon = ({ filled }: { filled: boolean }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5" 
    viewBox="0 0 20 20" 
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path 
      fillRule="evenodd" 
      d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3-5 3V4z" 
      clipRule="evenodd" 
    />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

const ResetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
  </svg>
);

const getStatusElement = (status: string) => {
  switch (status) {
    case 'Solved':
      return (
        <span className="flex items-center gap-1 bg-green-900/30 px-2 py-1 rounded text-green-400 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Solved ✓
        </span>
      );
    case 'Attempted':
      return (
        <span className="flex items-center gap-1 text-yellow-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          Attempted
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          Not Attempted
        </span>
      );
  }
};

// Tooltip component
const Tooltip = ({ children, text }: { children: React.ReactNode, text: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm -top-10 -translate-x-1/2 left-1/2 whitespace-nowrap">
          {text}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
};

// Checkbox Filter component for bullet-like selection
const CheckboxFilter = ({ 
  label, 
  options, 
  selectedValues,
  onChange 
}: { 
  label: string, 
  options: string[], 
  selectedValues: string[], 
  onChange: (value: string) => void 
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-300 mb-2">{label}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center cursor-pointer">
            <div 
              className={`w-4 h-4 rounded-full mr-2 border flex items-center justify-center ${
                selectedValues.includes(option) 
                  ? 'border-indigo-500 bg-indigo-500' 
                  : 'border-gray-500'
              }`}
              onClick={() => onChange(option)}
            >
              {selectedValues.includes(option) && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            <span className="text-sm text-gray-300">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const ProblemsetPage: React.FC = () => {
  const searchRef = React.useRef<HTMLDivElement>(null);
  const filterRef = React.useRef<HTMLDivElement>(null);
  
  // Get current user data
  const { currentUser } = useAuth();

  // Get problem stats from all platforms
  const { 
    getProblemStatus, 
    updateProblemStatus: updateExternalProblemStatus 
  } = useProblemStats(
    currentUser?.leetcodeId,
    currentUser?.codeforcesId
  );

  // Handle click outside to close dropdowns
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isFilterDropdownVisible, setIsFilterDropdownVisible] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    platform: [] as string[],
    difficulty: [] as string[],
    status: [] as string[]
  });
  
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
    setBookmarkedOnly,
    setSortBy,
    setSortOrder,
    resetFilters,
    handleSearch,
    problemsWithUserData,
    toggleBookmark,
    isBookmarked,
    updateProblemStatus,
    filters
  } = useProblemset();

  // Modify problems with combined status information
  const problemsWithCombinedStatus = React.useMemo(() => {
    // Debug logging
    console.log("Processing problems with user data:", problemsWithUserData.length);
    
    return problemsWithUserData.map(problem => {
      const source = (problem as any).source || 'unknown';
      // Get the most up-to-date status from our combined stats
      let status = getProblemStatus(problem.id, source, {
        contestId: (problem as any).contestId,
        index: (problem as any).index,
        slug: problem.slug
      });
      
      // Preview system for testing (will show some problems as solved)
      if (status === 'Not Attempted' && currentUser) {
        // For LeetCode problems
        if (source.toLowerCase().includes('leetcode') && currentUser.leetcodeId) {
          // Mark some problems as "solved" for testing
          const title = problem.title || '';
          if ((problem.id % 5 === 0) || ['Two Sum', 'Add Two Numbers'].some(p => title.includes(p))) {
            console.log(`Preview: Marking LeetCode problem as solved: ${problem.id} - ${title}`);
            status = 'Solved';
          }
        }
        
        // For CodeForces problems
        if (source.toLowerCase().includes('codeforces') && currentUser.codeforcesId) {
          if (problem.id % 7 === 0) {
            console.log(`Preview: Marking CodeForces problem as solved: ${problem.id} - ${problem.title}`);
            status = 'Solved';
          }
        }
      }
      
      return {
        ...problem,
        status
      };
    });
  }, [problemsWithUserData, getProblemStatus, currentUser]);

  // Enhanced function to update problem status that also updates external records
  const handleUpdateProblemStatus = (id: number, status: 'Solved' | 'Attempted' | 'Not Attempted', source: string) => {
    // Update local problem status
    updateProblemStatus(id, status, source);
    
    // Also update in our external problem tracking
    updateExternalProblemStatus(id, status, source);
  };

  // This code was removed as it's no longer needed

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
        aria-label="Previous page"
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
          aria-label="Go to first page"
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
          aria-label={`Go to page ${i}`}
          aria-current={i === currentPage ? "page" : undefined}
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
          aria-label="Go to last page"
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
        aria-label="Next page"
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

  // Handle column header click for sorting
  const handleSort = (sortKey: string) => {
    if (filters.sortBy === sortKey) {
      // Toggle sort direction
      setSortOrder(filters.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort key with default ascending order
      setSortBy(sortKey);
      setSortOrder('asc');
    }
  };

  // Render sort indicator
  const renderSortIndicator = (sortKey: string) => {
    if (filters.sortBy !== sortKey) return null;
    return <SortIcon direction={filters.sortOrder} />;
  };

  // Toggle filter dropdown
  const toggleFilterDropdown = () => {
    setIsFilterDropdownVisible(!isFilterDropdownVisible);
  };

  // Handle filter selection with bullet system
  const toggleFilter = (type: 'platform' | 'difficulty' | 'status', value: string) => {
    setSelectedFilters(prev => {
      const current = [...prev[type]];
      if (current.includes(value)) {
        return { ...prev, [type]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [type]: [...current, value] };
      }
    });
  };

  // Apply selected filters
  const applySelectedFilters = (e: React.FormEvent) => {
    if (selectedFilters.platform.length > 0) {
      setPlatform(selectedFilters.platform[0]); // We'll only use the first selected for now
    }
    if (selectedFilters.difficulty.length > 0) {
      setDifficulty(selectedFilters.difficulty[0]); // We'll only use the first selected for now
    }
    if (selectedFilters.status.length > 0) {
      setStatus(selectedFilters.status[0]); // We'll only use the first selected for now
    }
    setIsFilterDropdownVisible(false);
    handleSearch(e);
  };

  return (
    <div className="page-transition min-h-screen flex flex-col items-center p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
        Problem Set
      </h1>
      
      <div className="glass-effect p-4 md:p-6 rounded-xl max-w-6xl w-full mb-8">
        {/* Search and Filters */}
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(e); }} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4 relative">
            <div className={`relative ${isSearchExpanded ? 'w-full' : 'w-full md:w-64'} transition-all duration-300 ease-in-out`}>
              <input
                type="text"
                placeholder="Search problems..."
                onChange={(e) => setSearchTerm(e.target.value)}
                value={filters.searchTerm}
                onFocus={() => setIsSearchExpanded(true)}
                className={`w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none transition-all duration-300`}
              />
              <div className="absolute left-3 top-2.5">
                <SearchIcon />
              </div>
              
              {isSearchExpanded && (
                <div className="absolute mt-2 w-full bg-gray-800 rounded-lg border border-gray-700 shadow-lg z-20 p-4" ref={searchRef}>
                  {/* Quick filter options */}
                  <div className="space-y-4">
                    <CheckboxFilter
                      label="Platform"
                      options={PLATFORMS.filter(p => p !== 'All')}
                      selectedValues={selectedFilters.platform}
                      onChange={(value) => toggleFilter('platform', value)}
                    />
                    <CheckboxFilter
                      label="Difficulty"
                      options={DIFFICULTIES.filter(d => d !== 'All')}
                      selectedValues={selectedFilters.difficulty}
                      onChange={(value) => toggleFilter('difficulty', value)}
                    />
                    <CheckboxFilter
                      label="Status"
                      options={['Solved', 'Attempted', 'Not Attempted']}
                      selectedValues={selectedFilters.status}
                      onChange={(value) => toggleFilter('status', value)}
                    />
                    <div className="flex justify-between items-center mt-4">
                      <button
                        type="button"
                        onClick={() => setShowAllTags(!showAllTags)}
                        className="text-sm text-indigo-400 hover:text-indigo-300"
                      >
                        {showAllTags ? 'Hide Tags' : 'Show Tags'}
                      </button>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsSearchExpanded(false);
                            resetFilters();
                          }}
                          className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
                        >
                          Reset
                        </button>
                        <button
                          type="submit"
                          onClick={applySelectedFilters}
                          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button 
                type="button"
                onClick={toggleFilterDropdown}
                className="relative px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 flex-1 md:flex-none justify-center"
              >
                <FilterIcon />
                Filters
                {isFilterDropdownVisible && (
                  <div className="absolute right-0 mt-2 top-full w-64 bg-gray-800 rounded-lg border border-gray-700 shadow-lg z-20" ref={filterRef}>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-300">Tags</h3>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAllTags(!showAllTags);
                          }}
                          className="text-xs text-indigo-400 hover:text-indigo-300"
                        >
                          {showAllTags ? 'Show Less' : 'Show All'}
                        </button>
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {(showAllTags ? COMMON_TAGS : COMMON_TAGS.slice(0, 5)).map((tag) => (
                          <label key={tag} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.tag === tag}
                              onChange={() => setTag(tag)}
                              className="hidden"
                            />
                            <div className={`w-4 h-4 rounded-full mr-2 border flex items-center justify-center ${
                              filters.tag === tag ? 'border-indigo-500 bg-indigo-500' : 'border-gray-500'
                            }`}>
                              {filters.tag === tag && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <span className="text-sm text-gray-300">{tag}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </button>
              
              <button 
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                aria-label="Reset all filters"
              >
                <ResetIcon />
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-1">Platform</label>
              <select 
                onChange={(e) => {
                  setPlatform(e.target.value);
                }}
                value={filters.platform}
                className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
              >
                {PLATFORMS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-1">Difficulty</label>
              <select 
                onChange={(e) => {
                  setDifficulty(e.target.value);
                }}
                value={filters.difficulty}
                className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
              >
                {DIFFICULTIES.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <div className="text-xs text-gray-500 mt-1">
                Easy (LeetCode) to Very Hard (Codeforces)
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-1">Topic/Tag</label>
              <select 
                onChange={(e) => {
                  setTag(e.target.value);
                }}
                value={filters.tag}
                className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
              >
                {COMMON_TAGS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-1">Status</label>
              <select 
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                value={filters.status}
                className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
              >
                <option value="All">All Status</option>
                <option value="Solved">Solved</option>
                <option value="Attempted">Attempted</option>
                <option value="Not Attempted">Not Attempted</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-1">Sort By</label>
              <select 
                onChange={(e) => {
                  setSortBy(e.target.value);
                }}
                value={filters.sortBy}
                className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-1">Sort Order</label>
              <select 
                onChange={(e) => {
                  setSortOrder(e.target.value as 'asc' | 'desc');
                }}
                value={filters.sortOrder}
                className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            <div className="flex items-end col-span-2">
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  checked={filters.bookmarkedOnly}
                  onChange={(e) => setBookmarkedOnly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-300">Bookmarked only</span>
              </label>
            </div>
          </div>
        </form>

        {/* Problems Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : problemsWithCombinedStatus.length > 0 ? (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 cursor-pointer" onClick={() => handleSort('id')}>
                      <div className="flex items-center gap-1">
                        # {renderSortIndicator('id')}
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 cursor-pointer" onClick={() => handleSort('title')}>
                      <div className="flex items-center gap-1">
                        Title {renderSortIndicator('title')}
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 cursor-pointer" onClick={() => handleSort('difficulty')}>
                      <div className="flex items-center gap-1">
                        Difficulty {renderSortIndicator('difficulty')}
                      </div>
                    </th>
                    <th className="text-left py-3 px-4">Source</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {problemsWithCombinedStatus.map((problem, index) => {
                      const difficultyStyle = getDifficultyColor(problem.difficulty);
                      const typedProblem = problem as ProblemWithSource;
                      const isBookmarkedState = isBookmarked(problem.id, typedProblem.source || 'unknown');
                      
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
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              typedProblem.source === 'LeetCode' 
                                ? 'bg-blue-900 text-blue-300' 
                                : 'bg-purple-900 text-purple-300'
                            }`}>
                              {typedProblem.source === 'LeetCode' ? 'LC' : 'CF'}-{problem.id}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <a
                              href={problem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 hover:underline"
                              aria-label={`Open ${problem.title} problem on ${typedProblem.source}`}
                            >
                              {problem.title}
                            </a>
                            {problem.tags && problem.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {problem.tags.slice(0, 3).map((tag, i) => (
                                  <span 
                                    key={i} 
                                    className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {problem.tags.length > 3 && (
                                  <Tooltip text={problem.tags.slice(3).join(', ')}>
                                    <span className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded cursor-help">
                                      +{problem.tags.length - 3}
                                    </span>
                                  </Tooltip>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${difficultyStyle.bg} ${difficultyStyle.text}`}>
                              {problem.difficulty}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              typedProblem.source === 'LeetCode' 
                                ? 'bg-blue-900/50 text-blue-300' 
                                : 'bg-purple-900/50 text-purple-300'
                            }`}>
                              {typedProblem.source || 'Unknown'}
                            </span>
                          </td>
                          <td className="py-3 px-4">{getStatusElement(problem.status || 'Not Attempted')}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Tooltip text={isBookmarkedState ? 'Remove from bookmarks' : 'Add to bookmarks'}>
                                <button
                                  onClick={() => toggleBookmark(problem.id, typedProblem.source || 'unknown')}
                                  className={`p-1 rounded hover:bg-gray-700 ${isBookmarkedState ? 'text-yellow-400' : 'text-gray-400'}`}
                                  aria-label={isBookmarkedState ? 'Remove from bookmarks' : 'Add to bookmarks'}
                                >
                                  <BookmarkIcon filled={isBookmarkedState} />
                                </button>
                              </Tooltip>
                              <div className="relative group">
                                <Tooltip text="Change problem status">
                                  <button className="p-1 rounded hover:bg-gray-700 text-gray-400">
                                    •••
                                  </button>
                                </Tooltip>
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 hidden group-hover:block">
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleUpdateProblemStatus(
                                        problem.id, 
                                        'Solved', 
                                        typedProblem.source || 'unknown'
                                      )}
                                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                                    >
                                      Mark as Solved
                                    </button>
                                    <button
                                      onClick={() => handleUpdateProblemStatus(
                                        problem.id, 
                                        'Attempted', 
                                        typedProblem.source || 'unknown'
                                      )}
                                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                                    >
                                      Mark as Attempted
                                    </button>
                                    <button
                                      onClick={() => handleUpdateProblemStatus(
                                        problem.id, 
                                        'Not Attempted', 
                                        typedProblem.source || 'unknown'
                                      )}
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
                Showing {problemsWithCombinedStatus.length} of {totalProblems} problems
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-gray-400 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14a7 7 0 110-14 7 7 0 010 14z" />
              </svg>
              <p className="text-lg mb-2">No problems found matching your filters</p>
              <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
              <button 
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemsetPage;
