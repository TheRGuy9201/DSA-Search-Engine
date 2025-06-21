import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LanguageSelectorProps {
  languages: string[];
  activeLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  languages, 
  activeLanguage, 
  onLanguageChange 
}) => {
  return (
    <div className="flex flex-col items-center mb-4">
      <div className="inline-flex justify-center space-x-1 bg-gray-800/80 backdrop-blur-sm p-1.5 rounded-lg shadow-lg border border-gray-700/50">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => onLanguageChange(lang)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeLanguage === lang
                ? 'bg-indigo-500/20 text-indigo-400 shadow-sm border border-indigo-500/20'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 border border-transparent'
            }`}
          >
            {lang === 'c' ? 'C' : 
             lang === 'cpp' ? 'C++' : 
             lang === 'python' ? 'Python' : 
             lang === 'java' ? 'Java' : lang}
          </button>
        ))}
      </div>
    </div>
  );
};

interface CodeImplementationProps {
  implementations: Record<string, string>;
}

const CodeEditor: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group">
      <div className="absolute top-0 right-0 m-4 z-10">
        <motion.button
          onClick={handleCopy}
          className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 px-3 py-1.5 rounded-md text-sm font-medium 
                   flex items-center space-x-2 backdrop-blur-sm border border-gray-600/30 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </motion.button>
      </div>
      <pre className="bg-gray-900/95 backdrop-blur-sm text-gray-100 p-6 rounded-lg shadow-xl border border-gray-700/50
                    font-mono text-sm leading-relaxed overflow-x-auto relative group
                    scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <div className="absolute top-0 left-0 w-full h-8 bg-gray-800/50 border-b border-gray-700/30"></div>
        <code className="block pt-8">{code}</code>
      </pre>
    </div>
  );
};

const CodeImplementation: React.FC<CodeImplementationProps> = ({ implementations }) => {
  const [activeLanguage, setActiveLanguage] = useState(Object.keys(implementations)[0]);
  const languages = Object.keys(implementations);

  return (
    <div className="w-full">
      <LanguageSelector
        languages={languages}
        activeLanguage={activeLanguage}
        onLanguageChange={setActiveLanguage}
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLanguage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="relative"
        >
          <CodeEditor code={implementations[activeLanguage]} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

interface UseCaseCardProps {
  title: string;
  description: string;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ title, description }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700"
    >
      <h3 className="text-md font-semibold mb-2 text-gray-200">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </motion.div>
  );
};

interface UseCasesListProps {
  useCases: Array<{
    title: string;
    description: string;
  }>;
}

export const UseCasesList: React.FC<UseCasesListProps> = ({ useCases }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {useCases.map((useCase, index) => (
        <UseCaseCard 
          key={index}
          title={useCase.title}
          description={useCase.description}
        />
      ))}
    </div>
  );
};

interface RelatedProblemProps {
  id: string;
  platform: string;
  title: string;
  difficulty: string;
  url: string;
}

const RelatedProblem: React.FC<RelatedProblemProps> = ({ 
  id, 
  platform, 
  title, 
  difficulty, 
  url 
}) => {  // Define difficulty colors for dark theme
  const difficultyColors = {
    Easy: "bg-green-900 text-green-200",
    Medium: "bg-yellow-900 text-yellow-200",
    Hard: "bg-red-900 text-red-200",
    "Very Hard": "bg-purple-900 text-purple-200",
  };

  // Get color class based on difficulty
  const colorClass = difficultyColors[difficulty as keyof typeof difficultyColors] || "bg-gray-700 text-gray-300";

  return (
    <motion.a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-700"
    >
      <div className="flex items-center">
        <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
          platform === 'leetcode' ? 'bg-yellow-900 text-yellow-200' : 'bg-blue-900 text-blue-200'
        } mr-3 font-mono text-xs`}>
          {id}
        </div>
        <div>
          <span className="font-medium text-gray-200">{title}</span>
          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-400 mr-2">
              {platform === 'leetcode' ? 'LeetCode' : 'Codeforces'}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${colorClass}`}>
              {difficulty}
            </span>
          </div>
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </motion.a>
  );
};

interface RelatedProblemsListProps {
  problems: Array<{
    id: string;
    platform: string;
    title: string;
    difficulty: string;
    url: string;
  }>;
}

export const RelatedProblemsList: React.FC<RelatedProblemsListProps> = ({ problems }) => {
  return (
    <div className="flex flex-col space-y-3 mt-4">
      {problems.map((problem, index) => (
        <RelatedProblem 
          key={index}
          id={problem.id}
          platform={problem.platform}
          title={problem.title}
          difficulty={problem.difficulty}
          url={problem.url}
        />
      ))}
    </div>
  );
};

export default CodeImplementation;
