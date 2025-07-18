import React, { useRef, useState, useEffect } from 'react';
import { LeetCodeIcon, CodeforcesIcon, CodeChefIcon, RightArrowIcon } from '../components/icons/Icons';

interface PlatformsSectionProps {
    onPlatformSelect: (platform: string) => void;
}

const PlatformsSection: React.FC<PlatformsSectionProps> = ({ onPlatformSelect }) => {
    const [inView, setInView] = useState(false);
    const platformsRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                }
            },
            { threshold: 0.3 }
        );

        if (platformsRef.current) {
            observer.observe(platformsRef.current);
        }

        return () => {
            if (platformsRef.current) {
                observer.unobserve(platformsRef.current);
            }
        };
    }, []);

    return (
        <div ref={platformsRef} className="w-full min-h-screen flex flex-col items-center py-24 px-4 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

            <h2 className="text-4xl font-bold mb-16 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
                Integrated Platforms
            </h2>

            {/* First row: LeetCode and Codeforces */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mb-12">
                {/* LeetCode Platform */}
                <div
                    className={`platform-block p-8 rounded-xl glass-effect flex flex-col items-center hover:border-indigo-500 transition-all duration-500 transform ${inView ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                        }`}
                    style={{ transitionDelay: '0.1s' }}
                >
                    <div className="w-16 h-16 mb-2 flex items-center justify-center">
                        <LeetCodeIcon />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl pointer-events-none"></div>
                    <div className="p-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
                        <div className="p-1 bg-gray-900 rounded-full">
                            <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold my-4">LeetCode</h3>
                    <p className="text-center text-gray-300 mb-6">Access over 2000+ problems with detailed solutions and explanations.</p>
                    <button
                        onClick={() => onPlatformSelect('leetcode')}
                        className="relative group px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg shadow-lg hover:from-indigo-500 hover:to-blue-500 transition-all duration-300 text-white font-semibold overflow-hidden"
                    >
                        <span className="relative z-10">Browse Problems</span>
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-400 to-blue-400 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></span>
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-hover:translate-x-1">
                            <RightArrowIcon />
                        </span>
                    </button>
                    <div className="absolute right-0 bottom-0 w-32 h-32 bg-gradient-to-tl from-blue-500/20 to-transparent rounded-br-xl pointer-events-none"></div>
                </div>

                {/* Codeforces Platform */}
                <div
                    className={`platform-block p-8 rounded-xl glass-effect flex flex-col items-center hover:border-indigo-500 transition-all duration-500 transform ${inView ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                        }`}
                    style={{ transitionDelay: '0.3s' }}
                >
                    <div className="w-16 h-16 mb-2 flex items-center justify-center">
                        <CodeforcesIcon />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl pointer-events-none"></div>
                    <div className="p-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
                        <div className="p-1 bg-gray-900 rounded-full">
                            <div className="w-1 h-1 rounded-full bg-purple-400"></div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold my-4">Codeforces</h3>
                    <p className="text-center text-gray-300 mb-6">Practice with competitive programming problems from Codeforces contests.</p>
                    <button
                        onClick={() => onPlatformSelect('codeforces')}
                        className="relative group px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 text-white font-semibold overflow-hidden"
                    >
                        <span className="relative z-10">Browse Problems</span>
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></span>
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-hover:translate-x-1">
                            <RightArrowIcon />
                        </span>
                    </button>
                    <div className="absolute right-0 bottom-0 w-32 h-32 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-br-xl pointer-events-none"></div>
                </div>
            </div>

            {/* Second row: CodeChef (centered) */}
            <div className="flex justify-center max-w-6xl w-full">
                {/* CodeChef Platform */}
                <div
                    className={`platform-block p-8 rounded-xl glass-effect flex flex-col items-center hover:border-indigo-500 transition-all duration-500 transform w-full ${inView ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                        }`}
                    style={{ transitionDelay: '0.5s' }}
                >
                    <div className="w-16 h-16 mb-2 flex items-center justify-center">
                        <CodeChefIcon />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/10 to-transparent rounded-xl pointer-events-none"></div>
                    <div className="p-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                        <div className="p-1 bg-gray-900 rounded-full">
                            <div className="w-1 h-1 rounded-full bg-orange-400"></div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold my-4">CodeChef</h3>
                    <p className="text-center text-gray-300 mb-6">Solve algorithmic challenges from CodeChef's extensive problem library.</p>
                    <button
                        onClick={() => onPlatformSelect('codechef')}
                        className="relative group px-6 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg shadow-lg hover:from-orange-500 hover:to-red-500 transition-all duration-300 text-white font-semibold overflow-hidden"
                    >
                        <span className="relative z-10">Browse Problems</span>
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></span>
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-hover:translate-x-1">
                            <RightArrowIcon />
                        </span>
                    </button>
                    <div className="absolute right-0 bottom-0 w-32 h-32 bg-gradient-to-tl from-orange-500/20 to-transparent rounded-br-xl pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
};

export default PlatformsSection;
