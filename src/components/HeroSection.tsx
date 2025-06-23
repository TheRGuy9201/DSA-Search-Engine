import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Typing animation functions
const typingTexts = [
  "Master algorithms.",
  "Ace your interviews.",
  "Build efficient systems.",
  "Solve complex problems.",
  "Level up your skills."
];

const HeroSection: React.FC = () => {
    const navigate = useNavigate();
    const [typingText, setTypingText] = useState("");
    const [typingIndex, setTypingIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        const timer = setTimeout(() => {
            const currentText = typingTexts[typingIndex];
            
            if (!isDeleting) {
                setTypingText(currentText.substring(0, typingText.length + 1));
                
                if (typingText.length === currentText.length) {
                    setIsDeleting(true);
                    setTypingSpeed(100);
                    setTimeout(() => setTypingSpeed(50), 1500); // Pause at the end
                }
            } else {
                setTypingText(currentText.substring(0, typingText.length - 1));
                
                if (typingText.length === 0) {
                    setIsDeleting(false);
                    setTypingSpeed(150);
                    setTypingIndex((prevIndex) => (prevIndex + 1) % typingTexts.length);
                }
            }
        }, typingSpeed);
        
        return () => clearTimeout(timer);
    }, [typingText, typingIndex, isDeleting, typingSpeed]);

    return (
        <div className="w-full min-h-screen overflow-visible flex flex-col items-center justify-center px-4 md:px-8 text-center relative">
            {/* Simplified background that matches with FeaturesSection */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-[#0f172a] overflow-hidden">
                <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 right-auto top-auto h-[500px] w-[500px] translate-x-[10%] translate-y-[10%] rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-3xl"></div>
            </div>

            {/* Main content */}
            <div className="flex-grow flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl z-10"
                >
                    <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                            duration: 0.8,
                            type: "spring",
                            stiffness: 100 
                        }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-3 md:mb-1 leading-tight pb-1 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-500 to-indigo-400 bg-size-200 animate-bg-pos">
                            DSA Engine
                        </h1>
                    </motion.div>
                    
                    <p className="text-xl md:text-2xl text-gray-300 mb-2 max-w-2xl mx-auto leading-relaxed">
                        Your all-in-one platform for mastering Data Structures and Algorithms
                    </p>
                    
                    <div className="h-8 mb-8 overflow-hidden font-medium text-lg md:text-xl">
                        <motion.span
                            key={typingText}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="inline-block text-indigo-300"
                        >
                            {typingText}
                            <span className="inline-block w-1 h-5 ml-1 bg-indigo-500 animate-blink"></span>
                        </motion.span>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/signin')}
                            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 text-white font-semibold relative overflow-hidden group"
                        >
                            <span className="relative z-10">Get Started</span>
                            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-400 to-blue-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
                            <span className="absolute top-0 left-0 w-0 h-full bg-white/20 transform skew-x-[-20deg] group-hover:animate-shine"></span>
                        </motion.button>
                        
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/algorithms')}
                            className="px-8 py-3 border border-indigo-500 rounded-lg hover:bg-indigo-500/20 transition-all duration-300 text-white font-semibold"
                        >
                            Explore Algorithms
                        </motion.button>
                    </div>
                </motion.div>
            </div>
            
            {/* No footer here - moved to HomePage */}
        </div>
    );
};

export default HeroSection;
