import React from 'react';

const FeaturesSection: React.FC = () => (
    <div className="w-full min-h-screen flex flex-col items-center py-24 px-4">
        <h2 className="text-4xl font-bold mb-16 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
            Prepare for Technical Interviews
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
            <div className="p-6 rounded-xl glass-effect hover:border-indigo-500 hover:-translate-y-2 transition-all duration-300">
                <div className="p-3 rounded-full bg-indigo-600 w-fit mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Curated Problems</h3>
                <p className="text-gray-300">Access thousands of problems from various platforms like LeetCode and Codeforces.</p>
            </div>

            <div className="p-6 rounded-xl glass-effect hover:border-indigo-500 hover:-translate-y-2 transition-all duration-300">
                <div className="p-3 rounded-full bg-blue-600 w-fit mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Problem Tracking</h3>
                <p className="text-gray-300">Keep track of solved problems and analyze your progress with detailed statistics.</p>
            </div>

            <div className="p-6 rounded-xl glass-effect hover:border-indigo-500 hover:-translate-y-2 transition-all duration-300">
                <div className="p-3 rounded-full bg-purple-600 w-fit mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Learning Resources</h3>
                <p className="text-gray-300">Access tutorials, patterns, and explanations to boost your problem-solving skills.</p>
            </div>
        </div>
    </div>
);

export default FeaturesSection;
