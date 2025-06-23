import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import PlatformsSection from '../components/PlatformsSection';

interface HomePageProps {
  onPlatformSelect: (platform: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPlatformSelect }) => {
  return (
    <div className="page-transition flex flex-col min-h-screen">
      <div className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <PlatformsSection onPlatformSelect={onPlatformSelect} />
      </div>
      
      {/* Footer at the very end of the home page */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="py-6 text-sm font-medium tracking-wide text-center w-full bg-[#0f172a]/90 border-t border-gray-800/50"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">
          Made with <span className="text-red-500 animate-pulse">♥</span> by <span className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300 cursor-pointer">Reeck</span>
        </span>
      </motion.div>
    </div>
  );
};

export default HomePage;
