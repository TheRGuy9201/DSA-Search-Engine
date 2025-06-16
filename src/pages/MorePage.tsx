import React from 'react';

const MorePage: React.FC = () => (
    <div className="page-transition min-h-screen flex flex-col items-center p-8">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
            More Features
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
            <div className="glass-effect p-6 rounded-xl hover:border-indigo-500 transition-all duration-300">
                <h3 className="text-xl font-bold mb-4">Analytics & Progress</h3>
                <p className="text-gray-300 mb-4">Track your progress with detailed analytics and visualizations. See your improvement over time and identify areas to focus on.</p>
                <button className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-white font-medium">
                    View Analytics
                </button>
            </div>

            <div className="glass-effect p-6 rounded-xl hover:border-indigo-500 transition-all duration-300">
                <h3 className="text-xl font-bold mb-4">Study Plans</h3>
                <p className="text-gray-300 mb-4">Follow structured study plans to systematically improve your DSA skills. From beginner to advanced levels.</p>
                <button className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-white font-medium">
                    Browse Plans
                </button>
            </div>

            <div className="glass-effect p-6 rounded-xl hover:border-indigo-500 transition-all duration-300">
                <h3 className="text-xl font-bold mb-4">Community</h3>
                <p className="text-gray-300 mb-4">Connect with other programmers, discuss problems, and share solutions. Learn from the best in the community.</p>
                <button className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-white font-medium">
                    Join Community
                </button>
            </div>

            <div className="glass-effect p-6 rounded-xl hover:border-indigo-500 transition-all duration-300">
                <h3 className="text-xl font-bold mb-4">Mock Interviews</h3>
                <p className="text-gray-300 mb-4">Practice with simulated technical interviews. Get feedback on your approach and problem-solving skills.</p>
                <button className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-white font-medium">
                    Start Practice
                </button>
            </div>
        </div>
    </div>
);

export default MorePage;
