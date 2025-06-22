import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface KMPAnimationState {
  text: string;
  pattern: string;
  patternIndex: number;
  textIndex: number;
  lpsArray: number[];
  matchFound: boolean;
  comparisons: number;
  matchPositions: number[];
  currentStep: number;
  message: string;
  isComputing: boolean;
}

interface KMPAnimationStep {
  action: () => void;
  message: string;
}

export const KMPAnimation: React.FC = () => {
  const [text, setText] = useState<string>('ABABDABACDABABCABAB');
  const [pattern, setPattern] = useState<string>('ABABCABAB');
  const [speed, setSpeed] = useState<number>(1000);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showLPSComputation, setShowLPSComputation] = useState<boolean>(false);
  const [animationQueue, setAnimationQueue] = useState<KMPAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isComputingLPS, setIsComputingLPS] = useState<boolean>(false);
  const [state, setState] = useState<KMPAnimationState>({
    text,
    pattern,
    patternIndex: 0,
    textIndex: 0,
    lpsArray: [],
    matchFound: false,
    comparisons: 0,
    matchPositions: [],
    currentStep: -1,
    message: 'Enter a text and pattern to begin.',
    isComputing: false
  });

//   const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset the KMP animation state
  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(-1);
    setAnimationQueue([]);
    setState({
      ...state,
      patternIndex: 0,
      textIndex: 0,
      lpsArray: [],
      matchFound: false,
      comparisons: 0,
      matchPositions: [],
      currentStep: -1,
      message: 'Ready to start matching.',
      isComputing: false
    });
  };

  useEffect(() => {
    resetAnimation();
  }, [text, pattern]);

  // Compute the LPS (Longest Prefix which is also Suffix) array for KMP algorithm
  const computeLPSArray = (pattern: string): KMPAnimationStep[] => {
    const steps: KMPAnimationStep[] = [];
    const lps: number[] = new Array(pattern.length).fill(0);
    
    steps.push({
      action: () => {
        setState(prevState => ({
          ...prevState,
          lpsArray: [...lps],
          message: 'Starting LPS array computation. LPS[0] is always 0.',
          isComputing: true
        }));
      },
      message: 'Starting LPS array computation. LPS[0] is always 0.'
    });
    
    let length = 0;
    let i = 1;
    
    while (i < pattern.length) {
      const currentI = i;
      const currentLength = length;
      
      // If characters match
      if (pattern[i] === pattern[length]) {
        length++;
        const newLps = [...lps];
        newLps[i] = length;
        
        steps.push({
          action: () => {
            setState(prevState => ({
              ...prevState,
              lpsArray: [...newLps],
              message: `Characters match at positions ${currentI} and ${currentLength}. Setting LPS[${currentI}] = ${length}.`
            }));
          },
          message: `Characters match at positions ${currentI} and ${currentLength}. Setting LPS[${currentI}] = ${length}.`
        });
        
        i++;
      } else {
        // If characters don't match
        if (length !== 0) {
          length = lps[length - 1];
          
          steps.push({
            action: () => {
              setState(prevState => ({
                ...prevState,
                message: `Characters don't match. Looking at previous LPS value. Setting length = LPS[${length - 1}] = ${lps[length - 1]}.`
              }));
            },
            message: `Characters don't match. Looking at previous LPS value. Setting length = LPS[${length - 1}] = ${lps[length - 1]}.`
          });
          
          // Don't increment i here
        } else {
          // If length is 0
          const newLps = [...lps];
          newLps[i] = 0;
          
          steps.push({
            action: () => {
              setState(prevState => ({
                ...prevState,
                lpsArray: [...newLps],
                message: `Length is 0 and characters don't match. Setting LPS[${currentI}] = 0 and moving forward.`
              }));
            },
            message: `Length is 0 and characters don't match. Setting LPS[${currentI}] = 0 and moving forward.`
          });
          
          i++;
        }
      }
    }
    
    steps.push({
      action: () => {
        setState(prevState => ({
          ...prevState,
          message: `LPS array computation complete: [${lps.join(', ')}]`,
          isComputing: false
        }));
      },
      message: `LPS array computation complete: [${lps.join(', ')}]`
    });
    
    return steps;
  };

  // KMP search animation
  const kmpSearch = (text: string, pattern: string, lpsArray: number[]): KMPAnimationStep[] => {
    const steps: KMPAnimationStep[] = [];
    
    steps.push({
      action: () => {
        setState(prevState => ({
          ...prevState,
          textIndex: 0,
          patternIndex: 0,
          matchPositions: [],
          comparisons: 0,
          message: 'Starting KMP search.',
          isComputing: false
        }));
      },
      message: 'Starting KMP search.'
    });
    
    let i = 0; // Index for text
    let j = 0; // Index for pattern
    let comparisons = 0;
    const matchPositions: number[] = [];
    
    while (i < text.length) {
      const currentI = i;
      const currentJ = j;
      comparisons++;
      
      // If characters match
      if (pattern[j] === text[i]) {
        steps.push({
          action: () => {
            setState(prevState => ({
              ...prevState,
              textIndex: currentI,
              patternIndex: currentJ,
              comparisons: comparisons,
              message: `Characters match: ${pattern[currentJ]} = ${text[currentI]} (at positions pattern[${currentJ}] and text[${currentI}]). Moving both indices forward.`
            }));
          },
          message: `Characters match: ${pattern[currentJ]} = ${text[currentI]} (at positions pattern[${currentJ}] and text[${currentI}]). Moving both indices forward.`
        });
        
        i++;
        j++;
      } else {
        // If characters don't match
        if (j !== 0) {
          steps.push({
            action: () => {
              setState(prevState => ({
                ...prevState,
                textIndex: currentI,
                patternIndex: lpsArray[j - 1],
                comparisons: comparisons,
                message: `Mismatch: ${pattern[currentJ]} ≠ ${text[currentI]}. Using LPS array, setting j = LPS[${j - 1}] = ${lpsArray[j - 1]}.`
              }));
            },
            message: `Mismatch: ${pattern[currentJ]} ≠ ${text[currentI]}. Using LPS array, setting j = LPS[${j - 1}] = ${lpsArray[j - 1]}.`
          });
          
          j = lpsArray[j - 1];
        } else {
          // If j is 0, just move i forward
          steps.push({
            action: () => {
              setState(prevState => ({
                ...prevState,
                textIndex: currentI + 1,
                patternIndex: 0,
                comparisons: comparisons,
                message: `Mismatch and j = 0: ${pattern[currentJ]} ≠ ${text[currentI]}. Moving text index forward.`
              }));
            },
            message: `Mismatch and j = 0: ${pattern[currentJ]} ≠ ${text[currentI]}. Moving text index forward.`
          });
          
          i++;
        }
      }
      
      // If pattern is found (j reached the end of pattern)
      if (j === pattern.length) {
        const matchPos = i - j;
        matchPositions.push(matchPos);
        
        steps.push({
          action: () => {
            setState(prevState => ({
              ...prevState,
              matchPositions: [...prevState.matchPositions, matchPos],
              matchFound: true,
              message: `Pattern found at index ${matchPos}!`
            }));
          },
          message: `Pattern found at index ${matchPos}!`
        });
        
        // Reset j to continue searching for more occurrences
        j = lpsArray[j - 1];
        
        steps.push({
          action: () => {
            setState(prevState => ({
              ...prevState,
              patternIndex: j,
              message: `Continuing search. Using LPS array, setting j = LPS[${pattern.length - 1}] = ${lpsArray[j - 1]}.`
            }));
          },
          message: `Continuing search. Using LPS array, setting j = LPS[${pattern.length - 1}] = ${lpsArray[j - 1]}.`
        });
      }
    }
    
    if (matchPositions.length === 0) {
      steps.push({
        action: () => {
          setState(prevState => ({
            ...prevState,
            matchFound: false,
            message: `Pattern not found in the text after ${comparisons} comparisons.`
          }));
        },
        message: `Pattern not found in the text after ${comparisons} comparisons.`
      });
    } else {
      steps.push({
        action: () => {
          setState(prevState => ({
            ...prevState,
            message: `Search complete. Found ${matchPositions.length} occurrence(s) at indices: ${matchPositions.join(', ')}. Made ${comparisons} comparisons.`
          }));
        },
        message: `Search complete. Found ${matchPositions.length} occurrence(s) at indices: ${matchPositions.join(', ')}. Made ${comparisons} comparisons.`
      });
    }
    
    return steps;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAnimating) {
      return;
    }
    
    if (!pattern || !text) {
      setState(prev => ({
        ...prev,
        message: 'Please enter both text and pattern.'
      }));
      return;
    }
    
    if (pattern.length > text.length) {
      setState(prev => ({
        ...prev,
        message: 'Pattern cannot be longer than the text.'
      }));
      return;
    }
    
    // First compute the LPS array
    resetAnimation();
    const lpsSteps = computeLPSArray(pattern);
    
    // If LPS computation should be shown
    if (showLPSComputation) {
      setIsComputingLPS(true);
      setAnimationQueue(lpsSteps);
      
      // Add a step to transition to KMP search
      const lpsArray = new Array(pattern.length).fill(0);
      let length = 0;
      let i = 1;
      
      while (i < pattern.length) {
        if (pattern[i] === pattern[length]) {
          length++;
          lpsArray[i] = length;
          i++;
        } else {
          if (length !== 0) {
            length = lpsArray[length - 1];
          } else {
            lpsArray[i] = 0;
            i++;
          }
        }
      }
      
      const transitionStep: KMPAnimationStep = {
        action: () => {
          setState(prev => ({
            ...prev,
            lpsArray,
            message: 'LPS computation finished. Starting KMP search...'
          }));
          setIsComputingLPS(false);
        },
        message: 'LPS computation finished. Starting KMP search...'
      };
      
      // Get the KMP search steps
      const kmpSteps = kmpSearch(text, pattern, lpsArray);
      
      // Combine all steps
      setAnimationQueue([...lpsSteps, transitionStep, ...kmpSteps]);
    } else {
      // If LPS computation should not be shown, calculate it internally
      const lpsArray = new Array(pattern.length).fill(0);
      let length = 0;
      let i = 1;
      
      while (i < pattern.length) {
        if (pattern[i] === pattern[length]) {
          length++;
          lpsArray[i] = length;
          i++;
        } else {
          if (length !== 0) {
            length = lpsArray[length - 1];
          } else {
            lpsArray[i] = 0;
            i++;
          }
        }
      }
      
      setState(prev => ({
        ...prev,
        lpsArray,
        message: 'LPS computation done. Starting KMP search...'
      }));
      
      // Set only the KMP search animation steps
      setAnimationQueue(kmpSearch(text, pattern, lpsArray));
    }
    
    // Start the animation
    setCurrentStep(0);
    setIsAnimating(true);
  };

  // Execute animation steps
  useEffect(() => {
    if (!isAnimating || currentStep < 0 || currentStep >= animationQueue.length) {
      return;
    }
    
    const step = animationQueue[currentStep];
    step.action();
    
    const timer = setTimeout(() => {
      if (currentStep < animationQueue.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsAnimating(false);
      }
    }, speed);
    
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, animationQueue, speed]);
  // Render a character in the text or pattern with appropriate highlighting
  const renderChar = (
    char: string,
    index: number,
    isPattern: boolean,
    isCurrentPosition: boolean,
    isMatch: boolean
  ) => {
    let bgColor = 'bg-gray-700';
    let textColor = 'text-white';
    
    if (isCurrentPosition) {
      bgColor = 'bg-amber-500';
      textColor = 'text-white';
    } else if (isMatch) {
      bgColor = 'bg-green-500';
      textColor = 'text-white';
    }
    
    return (
      <motion.div
        key={`${isPattern ? 'p' : 't'}-${index}`}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${bgColor} ${textColor} w-8 h-8 flex items-center justify-center text-lg font-bold rounded-md shadow-md relative`}
      >
        {char}
        <div className="absolute -bottom-6 text-xs text-gray-400 whitespace-nowrap">{index}</div>
      </motion.div>
    );
  };
  // Render the LPS array
  const renderLPSArray = () => {
    if (!state.lpsArray || state.lpsArray.length === 0) {
      return null;
    }

    return (
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-200 mb-2">LPS Array</h3>
        <div className="flex flex-wrap justify-center gap-1">
          {state.pattern.split('').map((char, i) => (
            <div key={`lps-container-${i}`} className="flex flex-col items-center">
              <div className="bg-gray-700 text-white w-8 h-8 flex items-center justify-center rounded-md mb-1">
                {char}
              </div>
              <div className="text-xs text-gray-400 mb-1">{i}</div>
              <div className={`bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-md ${
                isComputingLPS && i === state.patternIndex ? 'ring-2 ring-yellow-400' : ''
              }`}>
                {state.lpsArray[i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full p-4">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-gray-200 mb-2">KMP Pattern Matching Visualization</h2>
        <p className="text-gray-300">
          The Knuth-Morris-Pratt algorithm efficiently finds occurrences of a pattern in a text by using a pre-computed LPS array to avoid redundant comparisons.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text..."
                className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isAnimating}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">Pattern</label>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter pattern..."
                className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isAnimating}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-lps"
                checked={showLPSComputation}
                onChange={(e) => setShowLPSComputation(e.target.checked)}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                disabled={isAnimating}
              />
              <label htmlFor="show-lps" className="text-gray-300">Show LPS array computation</label>
            </div>
            
            <div className="flex gap-4">
              <div className="flex items-center">
                <span className="text-gray-300 mr-2">Speed:</span>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="100"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-32"
                  disabled={isAnimating}
                />
                <span className="text-gray-300 ml-2">{speed}ms</span>
              </div>
              
              <button
                type="submit"
                disabled={isAnimating}
                className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50"
              >
                {isAnimating ? 'Animating...' : 'Start'}
              </button>
              
              <button
                type="button"
                onClick={resetAnimation}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 mb-6 min-h-[3rem]">
        <div className="text-center text-white">{state.message}</div>
      </div>
        <div className="bg-gray-800 rounded-lg p-4 mb-6 overflow-x-auto" ref={containerRef}>
        <div className="flex flex-col items-center min-w-full">          {/* Text visualization */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Text</h3>
            <div className="flex flex-wrap justify-center max-w-full gap-1">
              {state.text.split('').map((char, i) => {
                const isCurrentPosition = i === state.textIndex && !isComputingLPS;
                const isMatch = state.matchPositions.some(pos => i >= pos && i < pos + pattern.length);
                return renderChar(char, i, false, isCurrentPosition, isMatch);
              })}
            </div>
          </div>
            {/* Pattern visualization */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Pattern</h3>
            <div className="flex flex-wrap justify-center max-w-full gap-1">
              {state.pattern.split('').map((char, i) => {
                const isCurrentPosition = i === state.patternIndex && !isComputingLPS;
                const isMatch = false; // Pattern itself is not highlighted as match
                return renderChar(char, i, true, isCurrentPosition, isMatch);
              })}
            </div>
          </div>
          
          {/* LPS array visualization */}
          {renderLPSArray()}
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 mt-6">
        <h3 className="text-lg font-semibold text-white mb-2">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-md bg-gray-700 mr-2"></div>
            <span className="text-gray-300">Regular Character</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-md bg-amber-500 mr-2"></div>
            <span className="text-gray-300">Current Position</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-md bg-green-500 mr-2"></div>
            <span className="text-gray-300">Matched Character</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-md bg-indigo-600 mr-2"></div>
            <span className="text-gray-300">LPS Value</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 mt-6">
        <h3 className="text-lg font-semibold text-white mb-2">How KMP Works</h3>
        <div className="text-gray-300 space-y-2">
          <p>The Knuth-Morris-Pratt (KMP) algorithm uses a preprocessed array called the LPS (Longest Prefix which is also Suffix) to efficiently find patterns in text.</p>
          <p>1. <strong>LPS Array Computation:</strong> For each position in the pattern, calculate the length of the longest proper prefix that is also a suffix ending at that position.</p>
          <p>2. <strong>Pattern Matching:</strong> Use the LPS array to skip unnecessary comparisons when a mismatch occurs, allowing the algorithm to achieve O(n+m) time complexity.</p>
          <p>3. <strong>Efficiency:</strong> Unlike naive pattern matching (O(n*m)), KMP avoids backtracking in the text, making it significantly more efficient for repeated patterns.</p>
        </div>
      </div>
    </div>
  );
};
