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
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchAlgorithms = async () => {
      setLoading(true);
      try {
        const data = selectedCategory === 'All' 
          ? await apiService.searchAlgorithms()
          : await apiService.getAlgorithmsByCategory(selectedCategory);
        setAlgorithms(data);
        setError(null);
      } catch (err) {
        setError('Failed to load algorithms. Please try again later.');
        console.error('Error fetching algorithms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlgorithms();
  }, [selectedCategory]);

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
          Choose a category below to start exploring.
        </p>
      </div>

      {/* Category Selection */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Algorithm Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {algorithms.map((algorithm) => (
            <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlgorithmsPage;
