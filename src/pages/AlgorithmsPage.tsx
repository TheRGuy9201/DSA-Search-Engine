import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../services/api';
import type { Algorithm } from '../services/api';
import { useNavigate } from 'react-router-dom';


const CATEGORIES = ['All', 'Search', 'Sort', 'Graph', 'Dynamic Programming', 'Greedy'];

const AlgorithmCard: React.FC<{ algorithm: Algorithm }> = ({ algorithm }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      className="bg-gray-800 rounded-xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
      onClick={() => navigate(`/algorithm/${algorithm.id}`)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Category Badge */}
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-indigo-900/50 text-indigo-300 text-sm rounded-full border border-indigo-700/30">
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
      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <span className="text-gray-500">Time:</span>
          <span className="ml-2 text-emerald-400 font-mono">{algorithm.timeComplexity}</span>
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
  const navigate = useNavigate();
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        setLoading(true);
        const data = await apiService.searchAlgorithms();
        setAlgorithms(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching algorithms:', err);
        setError('Failed to load algorithms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlgorithms();
  }, []);
  
  // Filter algorithms based on category and search term
  // Ensure all algorithms have string IDs to prevent "Cannot convert object to primitive value" errors
  const safeAlgorithms = algorithms.map(algo => ({
    ...algo,
    id: typeof algo.id === 'object' ? `unknown-${Math.random().toString(36).substring(7)}` : String(algo.id)
  }));

  const filteredAlgorithms = safeAlgorithms.filter((algo) => {
    const matchesCategory = selectedCategory === 'All' || algo.category === selectedCategory;
    const matchesSearch = 
      !searchTerm || 
      algo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      algo.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-8 min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <div className="text-red-400 mb-4 bg-red-900/20 p-4 rounded-lg border border-red-700/30 inline-block">
          {error}
        </div>
        <button 
          onClick={() => navigate(0)} 
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white py-16 px-4 border-b border-indigo-700/50">
        <div className="container mx-auto">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Algorithm Explorer
          </motion.h1>
          <motion.p 
            className="text-xl opacity-90 max-w-2xl text-indigo-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Discover, learn, and implement essential algorithms for solving complex problems.
          </motion.p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto py-8 px-4">
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 mb-8 border border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 w-full bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search algorithms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Algorithm Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAlgorithms.map((algorithm) => (
              <motion.div
                key={algorithm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AlgorithmCard algorithm={algorithm} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredAlgorithms.length === 0 && (
          <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700/50 shadow-lg">
            <svg className="mx-auto h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-white">No algorithms found</h3>
            <p className="mt-1 text-indigo-300">Try changing your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmsPage;
