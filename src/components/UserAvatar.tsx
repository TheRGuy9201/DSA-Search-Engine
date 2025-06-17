import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../services/firebase';

const UserAvatar: React.FC = () => {
    const { currentUser } = useAuth();
    const [showDropdown, setShowDropdown] = React.useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleSignOut = async () => {
        try {
            await logOut();
            setShowDropdown(false);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // If no user is logged in, return null (will be handled in navbar)
    if (!currentUser) {
        return null;
    }

    // Get first letter of username or email in uppercase - ALWAYS show just the first character
    const getInitial = () => {
        // For usernames like "ricky_9201", extract just "R"
        if (currentUser.displayName && currentUser.displayName.length > 0) {
            return currentUser.displayName.charAt(0).toUpperCase();
        } else if (currentUser.email && currentUser.email.length > 0) {
            return currentUser.email.charAt(0).toUpperCase();
        }
        return '?';
    };

    // Force the display to just be the first letter
    const initial = getInitial();

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-lg font-bold hover:from-indigo-600 hover:to-indigo-800 focus:outline-none shadow-lg shadow-indigo-700/50"
                aria-label="User menu"
            >
                {initial}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700 glass-effect" onBlur={() => setShowDropdown(false)}>
                    <div className="px-4 py-2 text-sm text-white border-b border-gray-700">
                        <p className="text-gray-400 text-xs truncate">
                            {currentUser.email}
                        </p>
                    </div>
                    <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                        onClick={() => setShowDropdown(false)}
                    >
                        Settings
                    </Link>
                    <button
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                        onClick={handleSignOut}
                    >
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserAvatar;
