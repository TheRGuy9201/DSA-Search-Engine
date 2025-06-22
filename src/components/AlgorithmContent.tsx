import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Algorithm } from '../services/api';
import CodeImplementation, { RelatedProblemsList, UseCasesList } from './CodeImplementation';
import { algorithmImplementationsMap, getAlgorithmAnimation } from '../utils/algorithmUtils';

interface AlgorithmContentProps {
  algorithm: Algorithm;
}

const TabContent: React.FC<{ variants: any; children: React.ReactNode }> = ({ variants, children }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    exit="hidden"
    variants={variants}
    className="w-full"
  >
    {children}
  </motion.div>
);

export const AlgorithmContent: React.FC<AlgorithmContentProps> = ({ algorithm }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [animationVisible, setAnimationVisible] = useState(false);
//   const navigate = useNavigate();

  const safeId = String(algorithm.id);
  const algorithmData = safeId && algorithmImplementationsMap[safeId] ? algorithmImplementationsMap[safeId] : null;
  const animationData = safeId ? getAlgorithmAnimation(safeId) : null;
//   const complexityDetails = safeId ? getTimeComplexityDetails(safeId) : null;

  const contentVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const tabVariants = {
    inactive: {
      opacity: 0.65,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    active: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  // Animation for entry
  useEffect(() => {
    const timer = setTimeout(() => setAnimationVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back button */}
        <Link 
          to="/algorithms" 
          className="inline-flex items-center text-indigo-400 font-medium mb-8 hover:text-indigo-300 transition-colors group"
        >
          <motion.svg 
            className="w-5 h-5 mr-2"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
            initial={{ x: 0 }}
            whileHover={{ x: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </motion.svg>
          <span className="relative">
            Back to Algorithms
            <motion.span
              className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.2 }}
            />
          </span>
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              {algorithm.name}
            </h1>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="px-4 py-2 bg-gray-800/50 text-gray-200 text-sm rounded-full border border-gray-700/30 backdrop-blur-sm shadow-lg"
              >
                {algorithm.category}
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="px-4 py-2 bg-green-900/30 text-green-200 text-sm rounded-full border border-green-700/30 backdrop-blur-sm shadow-lg"
              >
                Time: {algorithm.timeComplexity}
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="px-4 py-2 bg-blue-900/30 text-blue-200 text-sm rounded-full border border-blue-700/30 backdrop-blur-sm shadow-lg"
              >
                Space: {algorithm.spaceComplexity}
              </motion.span>
            </div>
          </div>

          <nav className="border-b border-gray-700/50">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 px-2">
              {['description', 'implementation', 'use-cases', 'related-problems'].map((tab) => (
                <motion.button
                  key={tab}
                  variants={tabVariants}
                  animate={activeTab === tab ? 'active' : 'inactive'}
                  whileHover={{ scale: 1.05 }}
                  className={`pb-2 px-4 capitalize transition-colors ${
                    activeTab === tab 
                      ? 'border-b-2 border-indigo-400 text-indigo-400 font-medium' 
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.replace('-', ' ')}
                </motion.button>
              ))}
            </div>
          </nav>

          <AnimatePresence mode="wait">
            <TabContent variants={contentVariants}>
              {activeTab === 'description' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-xl font-semibold mb-4 text-white">Description</h2>
                  <p className="text-gray-300">{algorithm.description}</p>                {animationVisible && animationData && (                  <div
  className={`p-8 rounded-xl border border-gray-700/50 backdrop-blur-sm transform hover:scale-[1.02] transition-transform
    ${safeId === 'breadth-first-search' || safeId === 'depth-first-search' || safeId === 'linked-list' ? 'mt-8 bg-grey-800/40 min-h-[700px]' : 'mt-8 bg-gray-800/50'}`}
>

                    <motion.h3 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xl font-medium mb-6 text-gray-200 text-center"
                    >
                      {animationData.title}
                    </motion.h3>
                    
                    <div className="relative h-800 bg-gray-900/80 shadow-xl rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/10 to-gray-900/40" />                      <div className="relative z-10 w-full h-full">
                        {animationData.component && React.createElement(animationData.component)}
                      </div>
                    </div>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-sm text-gray-300 mt-6 text-center max-w-2xl mx-auto"
                    >
                      {animationData.description}
                    </motion.p>
                  </div>
                )}
                </div>
              )}
              {activeTab === 'implementation' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-white">Implementation</h2>                  {algorithmData?.implementations ? (
                    <CodeImplementation implementations={algorithmData.implementations} />
                  ) : algorithm.implementation ? (
                    <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-gray-300">
                      <code>{algorithm.implementation}</code>
                    </pre>
                  ) : (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center text-gray-400">
                      <p>No implementation available for this algorithm.</p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'use-cases' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-white">Use Cases</h2>                  {algorithmData?.useCases ? (                    <UseCasesList useCases={
                      (Array.isArray(algorithmData.useCases) && typeof algorithmData.useCases[0] === 'string')
                        ? (algorithmData.useCases as string[]).map(uc => ({
                            title: 'Use Case',
                            description: uc
                          }))
                        : (algorithmData.useCases as any[])
                    } />
                  ) : (
                    <ul className="list-disc pl-6 text-gray-300">
                      {algorithm.useCases?.map((useCase, index) => (
                        <li key={index} className="mb-2">{useCase}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {activeTab === 'related-problems' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-white">Related Problems</h2>                  {algorithmData?.relatedProblems ? (                    <RelatedProblemsList problems={algorithmData.relatedProblems.map((problem: any) => {
                      // Convert to expected format if necessary
                      if ('link' in problem && !('url' in problem)) {
                        return {
                          id: problem.id || 'N/A',
                          platform: problem.platform || 'other',
                          title: problem.title,
                          difficulty: problem.difficulty,
                          url: problem.link
                        };
                      }
                      return problem;
                    })} />
                  ) : (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center text-gray-300">
                      <p>No related problems available for this algorithm.</p>
                    </div>
                  )}
                </div>
              )}
            </TabContent>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AlgorithmContent;
