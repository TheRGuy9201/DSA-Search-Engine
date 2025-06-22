import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BarProps {
  value: number;
  height: string;
  isComparing: boolean;
  isSorted: boolean;
  isHeapified: boolean;
  isRoot: boolean;
  isSwapping: boolean;
}

const Bar: React.FC<BarProps> = ({ 
  value, 
  height, 
  isComparing, 
  isSorted, 
  isHeapified, 
  isRoot, 
  isSwapping 
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, height: 0 }}
    animate={{ 
      opacity: 1, 
      height,
      backgroundColor: isSwapping 
        ? '#EC4899' // Pink for swapping elements
        : isRoot
          ? '#F97316' // Orange for root node
          : isComparing 
            ? '#F59E0B' // Amber for comparing
            : isSorted 
              ? '#10B981' // Emerald for sorted
              : isHeapified
                ? '#8B5CF6' // Purple for heapified
                : '#4B5563' // Gray for unsorted
    }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    className="w-9 rounded-t-md mx-0.5 flex items-end justify-center relative group"
  >
    <span className="text-white text-[9px] mb-1 opacity-0 group-hover:opacity-100 absolute -top-6 bg-gray-800 px-1 py-0.5 rounded">{value}</span>
    <span className="text-white text-xs mb-1">{value}</span>
  </motion.div>
);

interface AnimationControlsProps {
  onReset: () => void;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  isPlaying: boolean;
  disabled: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({
  onReset,
  onPlay,
  onPause,
  onStep,
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
        onClick={onStep}
        disabled={disabled || isPlaying}
        className={`px-4 py-2 bg-blue-600 text-white rounded ${
          disabled || isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500'
        }`}
      >
        Step
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

interface Animation {
  type: 'heapify' | 'compare' | 'swap' | 'extract' | 'mark-sorted' | 'set-root';
  indices: number[];
}

export const HeapSortAnimation: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [animations, setAnimations] = useState<Animation[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [heapifiedIndices, setHeapifiedIndices] = useState<Set<number>>(new Set());
  const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set());
  const [rootIndex, setRootIndex] = useState<number | null>(null);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [speed, setSpeed] = useState<number>(1);
  const [description, setDescription] = useState<string>('');

  const animationRef = useRef<boolean>(true);
  const playInterval = useRef<NodeJS.Timeout | null>(null);

  const maxValue = 100;
  const arraySize = 12; // Good size for heap visualization
  
  // Generate a random array
  const generateRandomArray = useCallback(() => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * (maxValue - 10)) + 10
    );
    setArray(newArray);
    return newArray;
  }, []);

  // Reset animation state
  const resetAnimation = () => {
    clearInterval(playInterval.current as NodeJS.Timeout);
    playInterval.current = null;
    setIsPlaying(false);
    setIsSorting(false);
    setCurrentStep(-1);
    setComparingIndices([]);
    setHeapifiedIndices(new Set());
    setSortedIndices(new Set());
    setRootIndex(null);
    setSwappingIndices([]);
    generateRandomArray();
    setAnimations([]);
    setDescription('Click Play to start heap sort animation');
    animationRef.current = true;
  };

  // Heap Sort algorithm with animation creation
  const getHeapSortAnimations = (arr: number[]): Animation[] => {
    const animations: Animation[] = [];
    const n = arr.length;
    const array = [...arr];
    
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(array, n, i, animations);
    }
    
    // Extract elements one by one
    for (let i = n - 1; i > 0; i--) {
      // Move current root to end
      animations.push({ type: 'swap', indices: [0, i] });
      [array[0], array[i]] = [array[i], array[0]];
      
      // Mark the extracted element as sorted
      animations.push({ type: 'mark-sorted', indices: [i] });
      
      // Call heapify on the reduced heap
      heapify(array, i, 0, animations);
    }
    
    // Mark the last element as sorted
    animations.push({ type: 'mark-sorted', indices: [0] });
    
    return animations;
  };

  // Heapify a subtree rooted with node i
  const heapify = (array: number[], n: number, i: number, animations: Animation[]): void => {
    animations.push({ type: 'set-root', indices: [i] });
    
    let largest = i; // Initialize largest as root
    const left = 2 * i + 1; // Left child
    const right = 2 * i + 2; // Right child
    
    // Compare with left child
    if (left < n) {
      animations.push({ type: 'compare', indices: [largest, left] });
      if (array[left] > array[largest]) {
        largest = left;
      }
    }
    
    // Compare with right child
    if (right < n) {
      animations.push({ type: 'compare', indices: [largest, right] });
      if (array[right] > array[largest]) {
        largest = right;
      }
    }
    
    // If largest is not root
    if (largest !== i) {
      animations.push({ type: 'swap', indices: [i, largest] });
      [array[i], array[largest]] = [array[largest], array[i]];
      
      // Recursively heapify the affected sub-tree
      heapify(array, n, largest, animations);
    }
    
    animations.push({ type: 'heapify', indices: [i] });
  };

  // Start animation
  const startAnimation = useCallback(() => {
    if (!animations.length || currentStep >= animations.length - 1) {
      resetAnimation();
      const newArray = generateRandomArray();
      const newAnimations = getHeapSortAnimations([...newArray]);
      setAnimations(newAnimations);
      setDescription('Building max heap: heapify each subtree starting from the bottom');
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
      
      executeNextStep();
    }, 1000 / (speed * 2));
    
  }, [animations, currentStep, generateRandomArray, speed]);

  // Execute a single animation step
  const executeNextStep = useCallback(() => {
    setCurrentStep((prevStep) => {
      const nextStep = prevStep + 1;
      
      if (nextStep >= animations.length) {
        clearInterval(playInterval.current as NodeJS.Timeout);
        playInterval.current = null;
        setIsPlaying(false);
        setIsSorting(false);
        setDescription('Sort complete! All elements are in ascending order.');
        return prevStep;
      }
      
      const animation = animations[nextStep];
      
      // Clear previous states for visual clarity
      setComparingIndices([]);
      setSwappingIndices([]);
      setRootIndex(null);
      
      switch (animation.type) {
        case 'compare':
          setComparingIndices(animation.indices);
          setDescription(`Comparing elements at indices ${animation.indices[0]} and ${animation.indices[1]}`);
          break;
          
        case 'swap':
          setSwappingIndices(animation.indices);
          setArray(prevArray => {
            const newArray = [...prevArray];
            const [i, j] = animation.indices;
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            return newArray;
          });
          setDescription(`Swapping elements at indices ${animation.indices[0]} and ${animation.indices[1]}`);
          break;
          
        case 'heapify':
          setHeapifiedIndices(prev => {
            const newSet = new Set(prev);
            animation.indices.forEach(idx => newSet.add(idx));
            return newSet;
          });
          setDescription(`Subtree rooted at index ${animation.indices[0]} is now heapified`);
          break;
          
        case 'mark-sorted':
          setSortedIndices(prev => {
            const newSet = new Set(prev);
            animation.indices.forEach(idx => newSet.add(idx));
            return newSet;
          });
          setDescription(`Element at index ${animation.indices[0]} is now in its final sorted position`);
          break;
          
        case 'set-root':
          setRootIndex(animation.indices[0]);
          setDescription(`Setting index ${animation.indices[0]} as the current root node to heapify`);
          break;
          
        case 'extract':
          setDescription('Extracting the root of the heap (largest element) and placing it at the end');
          break;
      }
      
      return nextStep;
    });
  }, [animations]);

  // Step through animation manually
  const stepAnimation = () => {
    if (currentStep < animations.length - 1) {
      executeNextStep();
    }
  };

  // Pause animation
  const pauseAnimation = () => {
    setIsPlaying(false);
    clearInterval(playInterval.current as NodeJS.Timeout);
    playInterval.current = null;
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
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl p-6 mb-6 min-h-[500px] border border-gray-700/50 shadow-xl">
        {/* Description */}
        <div className="mb-6 text-center">
          <p className="text-gray-300">{description}</p>
        </div>
        
        {/* Array Visualization */}
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
                  isHeapified={heapifiedIndices.has(index)}
                  isRoot={index === rootIndex}
                  isSwapping={swappingIndices.includes(index)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="mt-10">
          <AnimationControls
            onReset={resetAnimation}
            onPlay={startAnimation}
            onPause={pauseAnimation}
            onStep={stepAnimation}
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
          Heapified
        </span>
        <span className="flex items-center">
          <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
          Current Root
        </span>
        <span className="flex items-center">
          <div className="w-4 h-4 bg-pink-500 rounded-full mr-2"></div>
          Swapping
        </span>
        <span className="flex items-center">
          <div className="w-4 h-4 bg-emerald-500 rounded-full mr-2"></div>
          Sorted
        </span>
      </div>
      
      {/* Heap Sort Explanation */}
      <div className="mt-8 bg-gray-800/70 rounded-lg p-5 text-sm text-gray-300">
        <h3 className="text-lg font-medium text-white mb-3">How Heap Sort Works</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong className="text-indigo-400">Build Max-Heap:</strong> Rearrange the array to form a max-heap where the largest element is at the root.</li>
          <li><strong className="text-indigo-400">Extract Elements:</strong> Repeatedly extract the maximum element (root) and place it at the end of the array.</li>
          <li><strong className="text-indigo-400">Heapify:</strong> After each extraction, heapify the remaining heap to maintain the max-heap property.</li>
        </ol>
        <p className="mt-3">Time Complexity: O(n log n) for all cases (best, average, worst)</p>
      </div>
    </div>
  );
};

export default HeapSortAnimation;
