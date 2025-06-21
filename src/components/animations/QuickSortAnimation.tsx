import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BarProps {
  value: number;
  height: number;
  isPivot: boolean;
  isComparing: boolean;
  isSorted: boolean;
}

const Bar: React.FC<BarProps> = ({ value, height, isPivot, isComparing, isSorted }) => (
  <motion.div
    layout
    initial={{ opacity: 0, height: 0 }}
    animate={{ 
      opacity: 1, 
      height,
      backgroundColor: isPivot 
        ? '#6366F1' // Indigo for pivot
        : isComparing 
          ? '#F59E0B' // Amber for comparing
          : isSorted 
            ? '#10B981' // Emerald for sorted
            : '#4B5563' // Gray for unsorted
    }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    className="w-8 rounded-t-md mx-1 flex items-end justify-center"
  >
    <span className="text-white text-xs mb-1">{value}</span>
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
  <div className="flex flex-col items-center space-y-4 mt-4">
    <div className="flex justify-center space-x-4">
      <button
        onClick={onReset}
        disabled={isPlaying}
        className={`px-4 py-2 bg-gray-700 text-white rounded transition-colors ${
          isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
        }`}
      >
        Reset
      </button>
      <button
        onClick={isPlaying ? onPause : onPlay}
        disabled={disabled}
        className={`px-4 py-2 bg-indigo-600 text-white rounded transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-500'
        }`}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button
        onClick={onStop}
        disabled={!isPlaying}
        className={`px-4 py-2 bg-red-600 text-white rounded transition-colors ${
          !isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500'
        }`}
      >
        Stop
      </button>
    </div>
    <div className="flex items-center space-x-4 w-full max-w-md px-4">
      <span className="text-gray-400 text-sm whitespace-nowrap">Very Slow</span>
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
      <span className="text-gray-400 text-sm whitespace-nowrap">Normal</span>
    </div>
  </div>
);

export const QuickSortAnimation: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [pivotIndex, setPivotIndex] = useState<number>(-1);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [speed, setSpeed] = useState(1); // Default to normal speed
  const animationRef = useRef<{ current: boolean }>({ current: true });
  const sortingPromiseRef = useRef<Promise<void> | null>(null);

  const generateRandomArray = useCallback(() => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 1);
    setArray(newArray);
    setPivotIndex(-1);
    setComparingIndices([]);
    setSortedIndices([]);
    setIsCompleted(false);
    return newArray;
  }, []);

  const getDelay = (type: 'partition' | 'comparison' | 'swap'): number => {
    const baseDelay = {
      partition: 1000, // 1 second for partition operations
      comparison: 800, // 800ms for comparisons
      swap: 600 // 600ms for swaps
    };
    return baseDelay[type] / speed;
  };

  const sleep = (type: 'partition' | 'comparison' | 'swap') => 
    new Promise(resolve => setTimeout(resolve, getDelay(type)));

  const partition = async (arr: number[], low: number, high: number) => {
    if (!animationRef.current.current) return { arr, pivotIndex: -1 };
    
    const pivot = arr[high];
    setPivotIndex(high);
    await sleep('partition');

    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (!animationRef.current.current) return { arr, pivotIndex: -1 };
      
      setComparingIndices([j, high]);
      await sleep('comparison');

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await sleep('swap');
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await sleep('swap');
    
    return { arr, pivotIndex: i + 1 };
  };

  const quickSort = async (arr: number[], low: number, high: number): Promise<void> => {
    if (!animationRef.current.current || low >= high) {
      if (low === high) {
        setSortedIndices(prev => [...prev, low]);
      }
      return;
    }

    const { pivotIndex } = await partition(arr, low, high);
    if (pivotIndex === -1 || !animationRef.current.current) return;

    setSortedIndices(prev => [...prev, pivotIndex]);
    await sleep('partition'); // Use partition delay for sub-array operations

    await Promise.all([
      quickSort(arr, low, pivotIndex - 1),
      quickSort(arr, pivotIndex + 1, high)
    ]);
  };

  const startAnimation = async () => {
    if (sortingPromiseRef.current) return;
    
    animationRef.current.current = true;
    setIsPlaying(true);
    setIsCompleted(false);
    
    const arr = [...array];
    sortingPromiseRef.current = quickSort(arr, 0, arr.length - 1).then(() => {
      if (animationRef.current.current) {
        setIsCompleted(true);
        setIsPlaying(false);
      }
      sortingPromiseRef.current = null;
    });
  };

  const stopAnimation = () => {
    animationRef.current.current = false;
    setIsPlaying(false);
    sortingPromiseRef.current = null;
  };

  const resetAnimation = () => {
    if (isPlaying) return;
    
    animationRef.current.current = false;
    sortingPromiseRef.current = null;
    setIsPlaying(false);
    setIsCompleted(false);
    generateRandomArray();
  };

  useEffect(() => {
    generateRandomArray();
    return () => {
      animationRef.current.current = false;
    };
  }, [generateRandomArray]);

  const maxValue = Math.max(...array);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="h-64 flex items-end justify-center bg-gray-900 rounded-lg p-4">
        <AnimatePresence mode="wait">
          {array.map((value, index) => (
            <Bar
              key={`${index}-${value}`}
              value={value}
              height={(value / maxValue) * 200}
              isPivot={index === pivotIndex}
              isComparing={comparingIndices.includes(index)}
              isSorted={sortedIndices.includes(index)}
            />
          ))}
        </AnimatePresence>
      </div>
      <AnimationControls
        onReset={resetAnimation}
        onPlay={startAnimation}
        onPause={() => {
          animationRef.current.current = false;
          setIsPlaying(false);
        }}
        onStop={stopAnimation}
        isPlaying={isPlaying}
        disabled={false}
        speed={speed}
        onSpeedChange={(newSpeed) => {
          // Clamp speed between 0.25 and 2
          const clampedSpeed = Math.max(0.25, Math.min(2, newSpeed));
          setSpeed(clampedSpeed);
        }}
      />
      <div className="mt-4 text-center text-sm text-gray-400">
        <div className="flex justify-center flex-wrap gap-4 text-sm">
          <span className="flex items-center">
            <div className="w-4 h-4 bg-indigo-600 rounded-full mr-2"></div>
            Pivot element
          </span>
          <span className="flex items-center">
            <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div>
            Traversing at
          </span>
          <span className="flex items-center">
            <div className="w-4 h-4 bg-emerald-400 rounded-full mr-2"></div>
            Sorted
          </span>
        </div>
        {isCompleted && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-emerald-500 font-semibold mt-2"
          >
            Sorting complete! Click Reset to try again.
          </motion.p>
        )}
      </div>
    </div>
  );
};
