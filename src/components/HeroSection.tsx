import React from 'react';

const HeroSection: React.FC = () => {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 text-center">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[#0f172a]">
                <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 right-auto top-auto h-[500px] w-[500px] translate-x-[10%] translate-y-[10%] rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-3xl"></div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
                DSA Engine
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
                Your all-in-one platform for mastering Data Structures and Algorithms
            </p>
            <div className="flex flex-col md:flex-row gap-4">
                <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg shadow-lg hover:opacity-90 transition-all duration-300 text-white font-semibold">
                    Get Started
                </button>
                <button className="px-8 py-3 border border-indigo-500 rounded-lg hover:bg-indigo-500 hover:bg-opacity-20 transition-all duration-300 text-white font-semibold">
                    Learn More
                </button>
            </div>
        </div>
    );
};

export default HeroSection;
