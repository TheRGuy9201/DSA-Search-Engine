import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsIcon } from './icons/Icons';
import { useProblemStats } from '../hooks/useProblemStats';

const UserAvatar: React.FC = () => {
    const { currentUser, signOut } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLButtonElement>(null);
    
    // Get profile data from localStorage
    const [profileData, setProfileData] = useState<{
        leetcodeId?: string;
        codeforcesId?: string;
    }>({});
    
    // Get problem stats using our custom hook
    const { 
        problemStats, 
        isLoading: isLoadingStats, 
        totalSolved 
    } = useProblemStats(profileData.leetcodeId, profileData.codeforcesId);

    // Get platform IDs from localStorage
    useEffect(() => {
        const savedProfile = localStorage.getItem('user_profile');
        if (savedProfile) {
            try {
                const parsedProfile = JSON.parse(savedProfile);
                setProfileData({
                    leetcodeId: parsedProfile.leetcodeId,
                    codeforcesId: parsedProfile.codeforcesId
                });
            } catch (e) {
                console.error('Error parsing profile data:', e);
            }
        }
    }, []);

    // Handle clicks outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current && 
                avatarRef.current && 
                !dropdownRef.current.contains(event.target as Node) &&
                !avatarRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            setShowDropdown(false);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // If no user is logged in, return null (will be handled in navbar)
    if (!currentUser) {
        return null;
    }

    // Get profile image if available
    const hasProfileImage = currentUser.picture && currentUser.picture.length > 0;
    
    // Get first letter of username or email in uppercase
    const getInitial = () => {
        // For usernames like "ricky_9201", extract just "R"
        if (currentUser.name && currentUser.name.length > 0) {
            return currentUser.name.charAt(0).toUpperCase();
        } else if (currentUser.email && currentUser.email.length > 0) {
            return currentUser.email.charAt(0).toUpperCase();
        }
        return '?';
    };

    // Force the display to just be the first letter
    const initial = getInitial();

    return (
        <div className="relative z-50">
            <motion.button
                ref={avatarRef}
                onClick={toggleDropdown}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    hasProfileImage ? '' : 'bg-gradient-to-br from-indigo-500 to-indigo-700'
                } text-white text-lg font-bold focus:outline-none shadow-lg shadow-indigo-700/30 ring-2 ring-indigo-500/30 hover:ring-indigo-500/50 transition-all duration-300`}
                aria-label="User menu"
            >
                {hasProfileImage ? (
                    <img 
                        src={currentUser.picture} 
                        alt="User Avatar" 
                        className="w-full h-full rounded-full object-cover"
                    />
                ) : (
                    initial
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-gray-900 rounded-full"></span>
            </motion.button>

            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl py-2 z-10 border border-gray-700/50 glass-effect overflow-hidden"
                    >
                        <div className="px-4 py-3 border-b border-gray-700/50">
                            <div className="flex items-center space-x-3">
                                <div className={`w-12 h-12 rounded-full ${
                                    hasProfileImage ? '' : 'bg-gradient-to-br from-indigo-500 to-indigo-700'
                                } flex items-center justify-center text-2xl font-bold shadow-inner`}>
                                    {hasProfileImage ? (
                                        <img 
                                            src={currentUser.picture} 
                                            alt="User Avatar" 
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        initial
                                    )}
                                </div>
                                <div>
                                    <p className="text-white font-medium">
                                        {currentUser.name || 'User'}
                                    </p>
                                    <p className="text-gray-400 text-xs truncate">
                                        {currentUser.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="py-1">
                            <Link
                                to="/settings"
                                className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700/50 transition-colors duration-150"
                                onClick={() => setShowDropdown(false)}
                            >
                                <SettingsIcon />
                                <span className="ml-2">Settings</span>
                            </Link>
                            <button
                                className="w-full text-left flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700/50 transition-colors duration-150"
                                onClick={handleSignOut}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                                <span className="ml-2">Sign out</span>
                            </button>
                        </div>
                        
                        {/* Platform accounts and stats */}
                        {(profileData.leetcodeId || profileData.codeforcesId) ? (
                            <div className="px-4 pt-2 pb-3 mt-1 border-t border-gray-700/50">
                                <p className="text-xs text-gray-400 font-medium mb-2">Connected Accounts</p>
                                <div className="space-y-2">
                                    {profileData.leetcodeId && (
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                                                <span className="text-gray-300">LeetCode: {profileData.leetcodeId}</span>
                                            </div>
                                            {isLoadingStats ? (
                                                <span className="text-xs text-gray-500">Loading...</span>
                                            ) : (
                                                <span className="text-xs text-green-400 font-medium">
                                                    {problemStats.leetcode.total} solved
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {profileData.codeforcesId && (
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                                <span className="text-gray-300">Codeforces: {profileData.codeforcesId}</span>
                                            </div>
                                            {isLoadingStats ? (
                                                <span className="text-xs text-gray-500">Loading...</span>
                                            ) : (
                                                <span className="text-xs text-green-400 font-medium">
                                                    {problemStats.codeforces.total} solved
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Total problems solved */}
                                    {totalSolved > 0 && (
                                        <div className="mt-2 pt-2 border-t border-gray-700/30">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-400">Total solved</span>
                                                <span className="text-sm font-bold text-indigo-400">{totalSolved}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : null}

                        {/* Display problem stats if available */}
                        {totalSolved !== undefined && (
                            <div className="px-4 py-3 border-t border-gray-700/50">
                                <p className="text-xs text-gray-400 font-medium mb-2">Problem Solving Stats</p>
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-300">Total Solved:</span>
                                        <span className="text-white font-semibold">{totalSolved}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserAvatar;
