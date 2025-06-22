import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BarProps {
  value: number;
  height: string;
  isComparing: boolean;
  isSorted: boolean;
  isMerging: boolean;
}

const Bar: React.FC<BarProps> = ({ value, height, isComparing, isSorted, isMerging }) => (
  <motion.div
    layout
    initial={{ opacity: 0, height: 0 }}
    animate={{ 
      opacity: 1, 
      height,
      backgroundColor: isMerging 
        ? '#8B5CF6' // Purple for merging elements
        : isComparing 
          ? '#F59E0B' // Amber for comparing
          : isSorted 
            ? '#10B981' // Emerald for sorted
            : '#4B5563' // Gray for unsorted
    }}    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    className="w-5 rounded-t-md mx-0.5 flex items-end justify-center relative group"
  >
    <span className="text-white text-[9px] mb-1 opacity-0 group-hover:opacity-100 absolute -top-6 bg-gray-800 px-1 py-0.5 rounded">{value}</span>
    <span className="text-white text-[8px] mb-1">{value}</span>
  </motion.div>
);

interface AnimationControlsProps {
  onReset: () => void;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  isPlaying: boolean;
  disabled: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({
  onReset,
  onPlay,
  onPause,
  onStop,
  isPlaying,
  disabled,
  speed,
  onSpeedChange
}) => (
  <div className="flex flex-col items-center space-y-4">
    <div className="flex space-x-4">
      <button
        onClick={onReset}
        disabled={disabled}
        className={`px-4 py-2 bg-gray-700 text-white rounded ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
        }`}
      >
        Reset
      </button>
      {isPlaying ? (
        <button
          onClick={onPause}
          disabled={disabled}
          className={`px-4 py-2 bg-amber-600 text-white rounded ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-500'
          }`}
        >
          Pause
        </button>
      ) : (
        <button
          onClick={onPlay}
          disabled={disabled}
          className={`px-4 py-2 bg-green-600 text-white rounded ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-500'
          }`}
        >
          Play
        </button>
      )}
      <button
        onClick={onStop}
        disabled={disabled}
        className={`px-4 py-2 bg-red-600 text-white rounded ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500'
        }`}
      >
        Stop
      </button>
    </div>
    
    <div className="flex items-center space-x-4 w-full max-w-md px-4">
      <span className="text-gray-400 text-sm">Slow</span>
      <input
        type="range"
        min="0.25"
        max="2"
        step="0.25"
        value={speed}
        onChange={(e) => onSpeedChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #6366F1 0%, #6366F1 ${((speed-0.25)/1.75)*100}%, #374151 ${((speed-0.25)/1.75)*100}%, #374151 100%)`
        }}
      />
      <span className="text-gray-400 text-sm">Fast</span>
    </div>
  </div>
);

export const MergeSortAnimation: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [animations, setAnimations] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [mergingIndices, setMergingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set());
  const [speed, setSpeed] = useState<number>(1);
    const animationRef = useRef<boolean>(true);
  const playInterval = useRef<NodeJS.Timeout | null>(null);
    const maxValue = 100;
  const arraySize = 16; // Reduced size for better visualization
    // Generate a random array with good distribution for visualization
  const generateRandomArray = useCallback(() => {    // Create an array with values distributed across a more moderate range
    const newArray = Array.from({ length: arraySize }, (_, i) => {
      // Use a mix of random and index-based values to ensure diverse heights
      const baseValue = Math.floor((i / arraySize) * (maxValue * 0.8)); // Base value with reduced maximum (80%)
      const randomOffset = Math.floor(Math.random() * (maxValue / 4)); // Smaller random offset
      // Limit the maximum height to 80% of maxValue to remove the highest bars
      return Math.max(10, Math.min(maxValue * 0.8, baseValue + randomOffset));
    });
    
    // Shuffle the array to make it unsorted but with good distribution
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    
    setArray(newArray);
    return newArray;
  }, [arraySize]);
  
  // Reset animation state
  const resetAnimation = () => {
    clearInterval(playInterval.current as NodeJS.Timeout);
    playInterval.current = null;
    setIsPlaying(false);
    setIsSorting(false);
    setCurrentStep(-1);
    setComparingIndices([]);
    setMergingIndices([]);
    setSortedIndices(new Set());
    generateRandomArray();
    setAnimations([]);
    animationRef.current = true;
  };
  
  // Generate merge sort animations
  const getMergeSortAnimations = (array: number[]) => {
    const animations: any[] = [];
    const auxiliaryArray = array.slice();
    mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
    return animations;
  };
  
  const mergeSortHelper = (
    mainArray: number[],
    startIdx: number,
    endIdx: number,
    auxiliaryArray: number[],
    animations: any[]
  ) => {
    if (startIdx === endIdx) return;
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    
    mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
    mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
    doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
  };
  
  const doMerge = (
    mainArray: number[],
    startIdx: number,
    middleIdx: number,
    endIdx: number,
    auxiliaryArray: number[],
    animations: any[]
  ) => {
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;
    
    // Store merge range for highlighting
    animations.push({
      type: 'merge-range',
      range: [startIdx, endIdx]
    });
    
    while (i <= middleIdx && j <= endIdx) {
      // Compare values
      animations.push({
        type: 'compare',
        indices: [i, j]
      });
      
      // Decide which value to place
      if (auxiliaryArray[i] <= auxiliaryArray[j]) {
        animations.push({
          type: 'overwrite',
          index: k,
          value: auxiliaryArray[i],
          sorted: k === endIdx && i === middleIdx && j === endIdx
        });
        mainArray[k++] = auxiliaryArray[i++];
      } else {
        animations.push({
          type: 'overwrite',
          index: k,
          value: auxiliaryArray[j],
          sorted: k === endIdx && i === middleIdx && j === endIdx
        });
        mainArray[k++] = auxiliaryArray[j++];
      }
    }
    
    // Copy remaining elements from first half
    while (i <= middleIdx) {
      animations.push({
        type: 'compare',
        indices: [i, i]
      });
      animations.push({
        type: 'overwrite',
        index: k,
        value: auxiliaryArray[i],
        sorted: k === endIdx
      });
      mainArray[k++] = auxiliaryArray[i++];
    }
    
    // Copy remaining elements from second half
    while (j <= endIdx) {
      animations.push({
        type: 'compare',
        indices: [j, j]
      });
      animations.push({
        type: 'overwrite',
        index: k,
        value: auxiliaryArray[j],
        sorted: k === endIdx
      });
      mainArray[k++] = auxiliaryArray[j++];
    }
    
    // Mark merged section as sorted if this is the final merge
    if (startIdx === 0 && endIdx === mainArray.length - 1) {
      animations.push({
        type: 'mark-sorted',
        range: [startIdx, endIdx]
      });
    }
    
    // End merge
    animations.push({
      type: 'end-merge',
    });
  };
  
  // Start animation
  const startAnimation = useCallback(() => {
    if (!animations.length || currentStep >= animations.length) {
      resetAnimation();
      const newArray = generateRandomArray();
      const newAnimations = getMergeSortAnimations(newArray.slice());
      setAnimations(newAnimations);
      return;
    }
    
    setIsPlaying(true);
    setIsSorting(true);
    
    playInterval.current = setInterval(() => {
      if (!animationRef.current) {
        clearInterval(playInterval.current as NodeJS.Timeout);
        playInterval.current = null;
        setIsPlaying(false);
        return;
      }
      
      setCurrentStep((prevStep) => {
        const nextStep = prevStep + 1;
        
        if (nextStep >= animations.length) {
          clearInterval(playInterval.current as NodeJS.Timeout);
          playInterval.current = null;
          setIsPlaying(false);
          setIsSorting(false);
          setSortedIndices(new Set(Array.from({ length: array.length }, (_, i) => i)));
          return prevStep;
        }
        
        const animation = animations[nextStep];
        
        switch (animation.type) {
          case 'compare':
            setComparingIndices(animation.indices);
            break;
            
          case 'overwrite':
            setArray((prevArray) => {
              const newArray = [...prevArray];
              newArray[animation.index] = animation.value;
              return newArray;
            });
            
            if (animation.sorted) {
              setSortedIndices((prevIndices) => {
                const newIndices = new Set(prevIndices);
                newIndices.add(animation.index);
                return newIndices;
              });
            }
            break;
            
          case 'merge-range':
            setMergingIndices(Array.from({ length: animation.range[1] - animation.range[0] + 1 }, 
              (_, i) => i + animation.range[0]));
            break;
            
          case 'end-merge':
            setMergingIndices([]);
            break;
            
          case 'mark-sorted':
            setSortedIndices(new Set(
              Array.from({ length: animation.range[1] - animation.range[0] + 1 }, 
                (_, i) => i + animation.range[0])
            ));
            break;
        }
        
        return nextStep;
      });
    }, 800 / (speed * 3)); // Adjust speed of animation to be a bit faster since there are more elements
    
  }, [animations, currentStep, array.length, generateRandomArray, speed]);
  
  // Pause animation
  const pauseAnimation = () => {
    setIsPlaying(false);
    clearInterval(playInterval.current as NodeJS.Timeout);
    playInterval.current = null;
  };
  
  // Stop animation
  const stopAnimation = () => {
    clearInterval(playInterval.current as NodeJS.Timeout);
    playInterval.current = null;
    setIsPlaying(false);
    setIsSorting(false);
    setCurrentStep(-1);
    setComparingIndices([]);
    setMergingIndices([]);
    setSortedIndices(new Set());
  };
  
  // Initialize on mount
  useEffect(() => {
    resetAnimation();
    return () => {
      clearInterval(playInterval.current as NodeJS.Timeout);
      animationRef.current = false;
    };
  }, []);
  
  // Calculate bar heights
  const getBarHeight = (value: number) => {
    return `${(value / maxValue) * 200}px`;
  };
    return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl p-6 mb-6 min-h-[400px] border border-gray-700/50 shadow-xl">
        <div className="flex justify-center items-end h-64 mb-8 overflow-x-auto py-2">
          <div className="flex justify-center items-end min-w-full">
            <AnimatePresence>
              {array.map((value, index) => (
                <Bar
                key={`${index}-${value}`}
                value={value}
                height={getBarHeight(value)}
                isComparing={comparingIndices.includes(index)}
                isSorted={sortedIndices.has(index)}
                isMerging={mergingIndices.includes(index)}
              />            ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-10">
          <AnimationControls
            onReset={resetAnimation}
            onPlay={startAnimation}
            onPause={pauseAnimation}
            onStop={stopAnimation}
            isPlaying={isPlaying}
            disabled={isSorting && !isPlaying}
            speed={speed}
            onSpeedChange={(newSpeed) => {
              const clampedSpeed = Math.max(0.25, Math.min(2, newSpeed));
              setSpeed(clampedSpeed);
              
              if (isPlaying) {
                pauseAnimation();
                setTimeout(() => startAnimation(), 0);
              }
            }}
          />
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-400">
        <span className="flex items-center">
          <div className="w-4 h-4 bg-gray-600 rounded-full mr-2"></div>
          Unsorted
        </span>
        <span className="flex items-center">
          <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div>
          Comparing
        </span>
        <span className="flex items-center">
          <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
          Merging
        </span>
        <span className="flex items-center">
          <div className="w-4 h-4 bg-emerald-500 rounded-full mr-2"></div>
          Sorted
        </span>
      </div>
    </div>
  );
};
