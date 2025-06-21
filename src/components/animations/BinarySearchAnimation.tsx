import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BarProps {
  value: number;
  height: number;
  isTarget: boolean;
  isMid: boolean;
  isInRange: boolean;
  isFound: boolean;
}

const Bar: React.FC<BarProps> = ({ value, height, isTarget, isMid, isInRange, isFound }) => (
  <motion.div
    layout
    initial={{ opacity: 0, height: 0 }}
    animate={{ 
      opacity: 1, 
      height,
      backgroundColor: isFound 
        ? '#10B981' // Emerald for found
        : isTarget 
          ? '#F59E0B' // Amber for target
          : isMid 
            ? '#6366F1' // Indigo for mid point
            : isInRange 
              ? '#4B5563' // Gray for active range
              : '#1F2937' // Dark gray for out of range
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
  onTargetChange: (target: number) => void;
  targetValue: number;
  maxTarget: number;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({ 
  onReset, 
  onPlay, 
  onPause,
  onStop, 
  isPlaying, 
  disabled,
  speed,
  onSpeedChange,
  onTargetChange,
  targetValue,
  maxTarget
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
    <div className="flex items-center space-x-4 w-full max-w-md px-4">
      <span className="text-gray-400 text-sm whitespace-nowrap">Target:</span>
      <input
        type="range"
        min="1"
        max={maxTarget}
        value={targetValue}
        onChange={(e) => onTargetChange(Number(e.target.value))}
        disabled={isPlaying}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #F59E0B 0%, #F59E0B ${(targetValue/maxTarget)*100}%, #374151 ${(targetValue/maxTarget)*100}%, #374151 100%)`
        }}
      />
      <span className="text-amber-400 text-sm font-medium">{targetValue}</span>
    </div>
  </div>
);

export const BinarySearchAnimation: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(25);
  const [left, setLeft] = useState<number>(0);
  const [right, setRight] = useState<number>(0);
  const [mid, setMid] = useState<number>(-1);
  const [found, setFound] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [speed, setSpeed] = useState(1); // Default to normal speed
  const animationRef = useRef<{ current: boolean }>({ current: true });
  const searchPromiseRef = useRef<Promise<void> | null>(null);

  const generateSortedArray = useCallback(() => {
    const size = 15;
    const newArray = Array.from({ length: size }, (_, i) => (i + 1) * 3); // Creates [3, 6, 9, ..., 45]
    setArray(newArray);
    setLeft(0);
    setRight(newArray.length - 1);
    setMid(-1);
    setFound(false);
    setIsCompleted(false);
    return newArray;
  }, []);

  const getDelay = (type: 'comparison' | 'update'): number => {
    const baseDelay = {
      comparison: 1000, // 1 second for comparisons
      update: 800, // 800ms for updates
    };
    return baseDelay[type] / speed;
  };

  const sleep = (type: 'comparison' | 'update') => 
    new Promise(resolve => setTimeout(resolve, getDelay(type)));

  const binarySearch = async () => {
    let leftIndex = 0;
    let rightIndex = array.length - 1;

    while (leftIndex <= rightIndex) {
      if (!animationRef.current.current) return;

      const midIndex = Math.floor((leftIndex + rightIndex) / 2);
      setLeft(leftIndex);
      setRight(rightIndex);
      setMid(midIndex);
      
      await sleep('comparison');

      if (array[midIndex] === target) {
        setFound(true);
        return midIndex;
      }

      await sleep('update');

      if (array[midIndex] < target) {
        leftIndex = midIndex + 1;
      } else {
        rightIndex = midIndex - 1;
      }
    }

    return -1;
  };

  const startAnimation = async () => {
    if (searchPromiseRef.current) return;
    
    animationRef.current.current = true;
    setIsPlaying(true);
    setIsCompleted(false);
    
    searchPromiseRef.current = binarySearch().then(() => {
      if (animationRef.current.current) {
        setIsCompleted(true);
        setIsPlaying(false);
      }
      searchPromiseRef.current = null;
    });
  };

  const stopAnimation = () => {
    animationRef.current.current = false;
    setIsPlaying(false);
    searchPromiseRef.current = null;
  };

  const resetAnimation = () => {
    if (isPlaying) return;
    
    animationRef.current.current = false;
    searchPromiseRef.current = null;
    setIsPlaying(false);
    setIsCompleted(false);
    generateSortedArray();
  };

  useEffect(() => {
    generateSortedArray();
    return () => {
      animationRef.current.current = false;
    };
  }, [generateSortedArray]);

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
              isTarget={value === target}
              isMid={index === mid}
              isInRange={index >= left && index <= right}
              isFound={found && index === mid}
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
          const clampedSpeed = Math.max(0.25, Math.min(2, newSpeed));
          setSpeed(clampedSpeed);
        }}
        onTargetChange={setTarget}
        targetValue={target}
        maxTarget={maxValue}
      />
      <div className="mt-4 text-center text-sm text-gray-400">
        <div className="flex justify-center flex-wrap gap-4 text-sm">
          <span className="flex items-center">
            <div className="w-4 h-4 bg-indigo-600 rounded-full mr-2"></div>
            Mid value
          </span>
          <span className="flex items-center">
            <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div>
            Target
          </span>
          <span className="flex items-center">
            <div className="w-4 h-4 bg-gray-700 rounded-full mr-2"></div>
            Visited
          </span>
          <span className="flex items-center">
            <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
            Not Visited
          </span>
        </div>
        {isCompleted && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-semibold mt-2 ${found ? 'text-emerald-500' : 'text-red-500'}`}
          >
            {found ? 'Target found! Click Reset to try another search.' : 'Target not found in array. Click Reset to try again.'}
          </motion.p>
        )}
      </div>
    </div>
  );
};
