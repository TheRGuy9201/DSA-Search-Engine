import React, { useState, useEffect } from 'react';
import { SearchIcon } from '../components/icons/Icons';
import useAlgorithmSearch from '../hooks/useAlgorithmSearch';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Popular search categories
const POPULAR_CATEGORIES = [
  { name: 'Arrays', icon: '⬠' },
  { name: 'Dynamic Programming', icon: '⟐' },
  { name: 'Trees', icon: '🌲' },
  { name: 'Graphs', icon: '⛓️' },
  { name: 'LeetCode', icon: '🧩' },
  { name: 'Codeforces', icon: '🏆' }
];

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { results, loading, error, search } = useAlgorithmSearch();
  
  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);
  
  // Save recent searches to localStorage
  const saveSearch = (query: string) => {
    if (query.trim() === '') return;
    
    const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };
  
  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(searchQuery);
    saveSearch(searchQuery);
  };
  
  // Handle category click
  const handleCategoryClick = (category: string) => {
    setSearchQuery(category);
    search(category);
    saveSearch(category);
  };

  return (
    <div className="page-transition min-h-screen flex flex-col items-center p-4 md:p-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500"
      >
        Algorithm Search
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-effect p-6 md:p-8 rounded-xl max-w-4xl w-full shadow-xl shadow-indigo-500/10"
      >
        <div className="flex flex-col items-center space-y-6">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search algorithms, data structures, or problems..."
              className="w-full h-14 bg-gray-800/70 backdrop-blur-sm rounded-lg pl-14 pr-4 text-white border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none text-lg transition-all duration-300"
              autoFocus
            />
            <div className="absolute left-4 top-4 text-gray-400">
              <SearchIcon />
            </div>
            <button 
              type="submit" 
              className="absolute right-4 top-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-white font-medium transition-colors duration-300"
            >
              Search
            </button>
          </form>

          <div className="flex gap-3 flex-wrap justify-center">
            {POPULAR_CATEGORIES.map((category) => (
              <motion.button
                key={category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(category.name)}
                className="px-4 py-2 bg-gray-800/80 rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center gap-2 border border-gray-700/50 hover:border-indigo-500/50"
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
          
          {recentSearches.length > 0 && (
            <div className="w-full">
              <h3 className="text-sm text-gray-400 mb-2">Recent searches:</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(term);
                      search(term);
                    }}
                    className="px-3 py-1 bg-gray-800/50 rounded-md text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-300 flex items-center gap-1"
                  >
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Search results */}
          <AnimatePresence>
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex justify-center p-4"
              >
                <div className="loader"></div>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-center text-red-300"
              >
                {error}
              </motion.div>
            ) : results.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full space-y-3"
              >
                <h2 className="text-xl font-semibold text-white">Results</h2>
                {results.map((algorithm) => (
                  <Link
                    to={`/algorithms/${algorithm.id}`}
                    key={algorithm.id}
                    className="block p-4 rounded-lg bg-gray-800/70 hover:bg-gray-700/70 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
                  >
                    <h3 className="text-lg font-medium text-white">{algorithm.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-1 bg-indigo-900/50 rounded text-xs text-indigo-300">{algorithm.category}</span>
                      <span className="text-sm text-gray-400">Time: {algorithm.timeComplexity}</span>
                    </div>
                    <p className="mt-2 text-gray-300 line-clamp-2">{algorithm.description}</p>
                  </Link>
                ))}
              </motion.div>
            ) : searchQuery && !loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full p-4 text-center text-gray-400"
              >
                No results found for "{searchQuery}"
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-400 text-center mt-6"
              >
                Search for algorithms, data structures, or problem-solving techniques.
                <br />
                Try searching by name, category, or complexity.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchPage;
