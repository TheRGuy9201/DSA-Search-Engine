import React from 'react';
import { SearchIcon } from '../components/icons/Icons';

const ProblemsetPage: React.FC = () => (
    <div className="page-transition min-h-screen flex flex-col items-center p-8">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
            Problem Set
        </h1>
        <div className="glass-effect p-6 rounded-xl max-w-6xl w-full mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                <div className="relative w-full md:w-64">          <input
                    type="text"
                    placeholder="Search problems..."
                    className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
                />
                    <div className="absolute left-3 top-2.5">
                        <SearchIcon />
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <select className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none">
                        <option>All Difficulties</option>
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>

                    <select className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none">
                        <option>All Topics</option>
                        <option>Arrays</option>
                        <option>Strings</option>
                        <option>Linked Lists</option>
                        <option>Dynamic Programming</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4">#</th>
                            <th className="text-left py-3 px-4">Title</th>
                            <th className="text-left py-3 px-4">Difficulty</th>
                            <th className="text-left py-3 px-4">Source</th>
                            <th className="text-left py-3 px-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-800 hover:bg-gray-800">
                            <td className="py-3 px-4">1</td>
                            <td className="py-3 px-4 text-indigo-400 hover:text-indigo-300">Two Sum</td>
                            <td className="py-3 px-4"><span className="px-2 py-1 rounded-full text-xs bg-green-900 text-green-300">Easy</span></td>
                            <td className="py-3 px-4">LeetCode</td>
                            <td className="py-3 px-4"><span className="text-green-500">✓ Solved</span></td>
                        </tr>
                        <tr className="border-b border-gray-800 hover:bg-gray-800">
                            <td className="py-3 px-4">2</td>
                            <td className="py-3 px-4 text-indigo-400 hover:text-indigo-300">Add Two Numbers</td>
                            <td className="py-3 px-4"><span className="px-2 py-1 rounded-full text-xs bg-yellow-900 text-yellow-300">Medium</span></td>
                            <td className="py-3 px-4">LeetCode</td>
                            <td className="py-3 px-4"><span className="text-gray-400">Not Attempted</span></td>
                        </tr>
                        <tr className="border-b border-gray-800 hover:bg-gray-800">
                            <td className="py-3 px-4">3</td>
                            <td className="py-3 px-4 text-indigo-400 hover:text-indigo-300">Watermelon</td>
                            <td className="py-3 px-4"><span className="px-2 py-1 rounded-full text-xs bg-green-900 text-green-300">Easy</span></td>
                            <td className="py-3 px-4">Codeforces</td>
                            <td className="py-3 px-4"><span className="text-green-500">✓ Solved</span></td>
                        </tr>
                        <tr className="hover:bg-gray-800">
                            <td className="py-3 px-4">4</td>
                            <td className="py-3 px-4 text-indigo-400 hover:text-indigo-300">Median of Two Sorted Arrays</td>
                            <td className="py-3 px-4"><span className="px-2 py-1 rounded-full text-xs bg-red-900 text-red-300">Hard</span></td>
                            <td className="py-3 px-4">LeetCode</td>
                            <td className="py-3 px-4"><span className="text-gray-400">Not Attempted</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default ProblemsetPage;
