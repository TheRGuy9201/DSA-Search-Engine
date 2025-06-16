import React from 'react';
import { HomeIcon, SettingsIcon, ProblemsetIcon, SearchIcon, PlusIcon } from '../components/icons/Icons';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    setCurrentPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, setCurrentPage }) => {
    const navItems = [
        { name: 'Home', icon: <HomeIcon />, page: 'home' },
        { name: 'Settings', icon: <SettingsIcon />, page: 'settings' },
        { name: 'Problemset', icon: <ProblemsetIcon />, page: 'problemset' },
        { name: 'Search', icon: <SearchIcon />, page: 'search' },
        { name: 'More', icon: <PlusIcon />, page: 'more' },
    ];

    return (
        <div className={`fixed top-0 left-0 h-full w-64 glass-effect z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <div className="flex flex-col h-full">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-indigo-400">DSA Engine</h2>
                </div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <button
                                    className="w-full flex items-center px-4 py-3 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200"
                                    onClick={() => {
                                        setCurrentPage(item.page);
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
                    <p className="text-sm text-gray-400">Version 1.0.0</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
