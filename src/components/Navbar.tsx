import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon } from './icons/Icons';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Check if the current path matches the link
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/80 backdrop-blur-md shadow-lg shadow-black/20' 
          : 'bg-transparent'
      } text-white`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500 transition-all duration-300 ${
                isScrolled ? 'scale-95' : ''
              }`}>
                DSA Engine
              </span>
              <motion.div 
                animate={{ rotate: isScrolled ? 45 : 0 }}
                transition={{ duration: 0.5 }}
                className="ml-1 w-2 h-2 bg-indigo-500 rounded-full group-hover:bg-indigo-400"
              />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500/10 transition-colors duration-300 ${
                isActive('/') ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-200'
              }`}
            >
              Home
            </Link>
            <Link
              to="/algorithms"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500/10 transition-colors duration-300 ${
                isActive('/algorithms') ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-200'
              }`}
            >
              Algorithms
            </Link>
            <Link
              to="/search"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500/10 transition-colors duration-300 flex items-center gap-1 ${
                isActive('/search') ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-200'
              }`}
            >
              <SearchIcon className="w-4 h-4" />
              <span>Search</span>
            </Link>
            <Link
              to="/problemset"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500/10 transition-colors duration-300 ${
                isActive('/problemset') ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-200'
              }`}
            >
              Problems
            </Link>

            {/* Auth buttons */}
            {currentUser ? (
              <UserAvatar />
            ) : (
              <Link
                to="/signin"
                className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 transition-all duration-300 shadow-md shadow-indigo-800/20"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {!isMenuOpen && currentUser && <UserAvatar />}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-2 p-2 rounded-md hover:bg-gray-700/50 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500/10 transition-colors duration-300 ${
                  isActive('/') ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-200'
                }`}
              >
                Home
              </Link>
              <Link
                to="/algorithms"
                className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500/10 transition-colors duration-300 ${
                  isActive('/algorithms') ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-200'
                }`}
              >
                Algorithms
              </Link>
              <Link
                to="/search"
                className={`px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500/10 transition-colors duration-300 flex items-center gap-2 ${
                  isActive('/search') ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-200'
                }`}
              >
                <SearchIcon className="w-4 h-4" />
                <span>Search</span>
              </Link>
              <Link
                to="/problemset"
                className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500/10 transition-colors duration-300 ${
                  isActive('/problemset') ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-200'
                }`}
              >
                Problems
              </Link>

              {/* Auth button for mobile */}
              {!currentUser && (
                <Link
                  to="/signin"
                  className="block px-3 py-2 mt-2 rounded-md text-base font-medium bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
