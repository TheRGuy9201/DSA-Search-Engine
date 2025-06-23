import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, SettingsIcon, ProblemsetIcon, SearchIcon, PlusIcon } from '../components/icons/Icons';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const navItems = [
        { name: 'Home', icon: <HomeIcon />, path: '/' },
        { name: 'Algorithms', icon: <SearchIcon />, path: '/algorithms' },
        { name: 'Problemset', icon: <ProblemsetIcon />, path: '/problemset' },
        { name: 'Settings', icon: <SettingsIcon />, path: '/settings' },
        { name: 'More', icon: <PlusIcon />, path: '/more' },
    ];

    const { signOut } = useAuth();
    
    // Sign out handler
    const handleSignOut = async () => {
        try {
            await signOut();
            toggleSidebar();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // Get first letter of username or email in uppercase
    const getInitial = () => {
        if (!currentUser) return '?';

        if (currentUser.name && currentUser.name.length > 0) {
            return currentUser.name.charAt(0).toUpperCase();
        } else if (currentUser.email && currentUser.email.length > 0) {
            return currentUser.email.charAt(0).toUpperCase();
        }
        return '?';
    };

    // Force the display to just be the first letter
    const userInitial = getInitial();

    return (
        <div className={`fixed top-0 left-0 h-full w-64 glass-effect z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <div className="flex flex-col h-full">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-indigo-400">DSA Engine</h2>
                </div>

                {/* User info section (if logged in) */}
                {currentUser && (
                    <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-lg font-bold shadow-lg shadow-indigo-700/50">
                                {userInitial}
                            </div>
                            <div className="ml-3">
                                <p className="text-gray-400 text-xs truncate max-w-[180px]">
                                    {currentUser.email}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <button
                                    className="w-full flex items-center px-4 py-3 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200"
                                    onClick={() => {
                                        navigate(item.path);
                                        toggleSidebar();
                                    }}
                                >
                                    <span className="mr-3 text-indigo-300">{item.icon}</span>
                                    <span>{item.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    {currentUser ? (
                        <button
                            className="w-full px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </button>
                    ) : (
                        <button
                            className="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                            onClick={() => {
                                navigate('/signin');
                                toggleSidebar();
                            }}
                        >
                            Sign In
                        </button>
                    )}
                    <p className="text-sm text-gray-400 mt-4">Version 1.0.0</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
