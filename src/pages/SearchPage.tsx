import React from 'react';
import { SearchIcon } from '../components/icons/Icons';

const SearchPage: React.FC = () => (
  <div className="page-transition min-h-screen flex flex-col items-center p-8">
    <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
      Search
    </h1>
    <div className="glass-effect p-8 rounded-xl max-w-4xl w-full">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search problems, topics, or platforms..."
            className="w-full h-14 bg-gray-800 rounded-lg pl-14 pr-4 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none text-lg"
          />
          <div className="absolute left-4 top-4">
            <SearchIcon />
          </div>
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">Arrays</button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">Dynamic Programming</button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">Trees</button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">Graphs</button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">LeetCode</button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">Codeforces</button>
        </div>

        <p className="text-gray-400 text-center mt-6">
          Enter keywords to search for problems across all platforms.
          <br />
          You can search by problem name, topic, difficulty, or platform.
        </p>
      </div>
    </div>
  </div>
);

export default SearchPage;
