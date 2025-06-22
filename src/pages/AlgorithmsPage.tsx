import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../services/api';
import type { Algorithm } from '../services/api';
import { useNavigate } from 'react-router-dom';


const CATEGORIES = ['All', 'Search', 'Sort', 'Graph', 'Dynamic Programming', 'Greedy', 'Data Structure', 'String', 'Pathfinding', 'Union Find'];

const AlgorithmCard: React.FC<{ algorithm: Algorithm }> = ({ algorithm }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      className="bg-gray-800 rounded-xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group shadow-lg hover:shadow-indigo-500/20"
      onClick={() => navigate(`/algorithm/${algorithm.id}`)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Category Badge */}
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-indigo-900/50 text-indigo-300 text-xs uppercase tracking-wider font-medium rounded-full border border-indigo-700/30 flex items-center">
          <span className="w-2 h-2 bg-indigo-400 rounded-full mr-1.5"></span>
          {algorithm.category}
        </span>
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </div>

      {/* Algorithm Name and Description */}
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
        {algorithm.name}
      </h3>
      <p className="text-gray-400 text-sm line-clamp-2 mb-4">
        {algorithm.description}
      </p>

      {/* Complexity Information */}
      <div className="space-y-2 mt-auto">
        <div className="flex items-center text-sm">
          <span className="text-gray-500 font-medium">Time:</span>
          <span className="ml-2 text-emerald-400 font-mono font-medium">{algorithm.timeComplexity}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-gray-500">Space:</span>
          <span className="ml-2 text-blue-400 font-mono">{algorithm.spaceComplexity}</span>
        </div>
      </div>
    </motion.div>
  );
};

const AlgorithmsPage = () => {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAlgorithms = async () => {
      setLoading(true);
      try {
        // If there's a search term, use it regardless of category
        if (searchTerm) {
          const data = await apiService.searchAlgorithms(searchTerm);
          setAlgorithms(data);
        } else {
          // Otherwise filter by category
          const data = selectedCategory === 'All' 
            ? await apiService.searchAlgorithms()
            : await apiService.getAlgorithmsByCategory(selectedCategory);
          setAlgorithms(data);
        }
        setError(null);
      } catch (err) {
        setError('Failed to load algorithms. Please try again later.');
        console.error('Error fetching algorithms:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Add debounce to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchAlgorithms();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl mb-4">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Centered Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Algorithm Explorer</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Discover and learn about different algorithms, their implementations, and use cases.
          Use the search bar or categories below to start exploring.
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="max-w-lg mx-auto mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for algorithms by name, category, or complexity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-500"
          />
          {searchTerm && (
            <button 
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              onClick={() => setSearchTerm('')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category Selection */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setSearchTerm(''); // Clear search term when changing category
            }}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              selectedCategory === category && !searchTerm
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Algorithm Grid - More centralized with space on the sides */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {algorithms.length > 0 ? (
              algorithms.map((algorithm) => (
                <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-400 text-lg">
                  {searchTerm 
                    ? `No algorithms found matching "${searchTerm}".` 
                    : `No algorithms found in the ${selectedCategory} category.`}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsPage;
