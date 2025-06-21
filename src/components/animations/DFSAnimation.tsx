import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface NodeProps {
  id: number;
  x: number;
  y: number;
  isStart: boolean;
  isVisited: boolean;
  isCurrentlyVisiting: boolean;
  isInStack: boolean;
  onClick: (id: number) => void;
  disabled: boolean;
}

const Node: React.FC<NodeProps> = ({ 
  id, 
  x, 
  y, 
  isStart, 
  isVisited, 
  isCurrentlyVisiting, 
  isInStack, 
  onClick, 
  disabled 
}) => (
  <motion.circle
    cx={x}
    cy={y}
    r={20}
    fill={
      isStart 
        ? '#6366F1' // Indigo for start node
        : isCurrentlyVisiting 
          ? '#F59E0B' // Amber for currently visiting
          : isInStack 
            ? '#8B5CF6' // Purple for nodes in stack
            : isVisited 
              ? '#10B981' // Emerald for visited
              : '#4B5563' // Gray for unvisited
    }
    stroke="#E5E7EB"
    strokeWidth={2}
    className={`cursor-pointer transition-all duration-300 ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:stroke-indigo-400'}`}
    onClick={() => !disabled && onClick(id)}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    whileHover={!disabled ? { scale: 1.1 } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
  />
);

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isActive: boolean;
}

const Edge: React.FC<EdgeProps> = ({ x1, y1, x2, y2, isActive }) => (
  <motion.line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke={isActive ? '#6366F1' : '#374151'}
    strokeWidth={isActive ? 3 : 2}
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 0.5 }}
  />
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
      <span className="text-gray-400 text-sm whitespace-nowrap">Fast</span>
    </div>
  </div>
);

interface GraphNode {
  id: number;
  x: number;
  y: number;
  neighbors: number[];
}

interface GraphEdge {
  from: number;
  to: number;
}

export const DFSAnimation: React.FC = () => {
  // Graph structure - same as BFS for consistency
  const [nodes] = useState<GraphNode[]>([
    { id: 0, x: 250, y: 80, neighbors: [1, 2] },
    { id: 1, x: 150, y: 180, neighbors: [0, 3, 4] },
    { id: 2, x: 350, y: 180, neighbors: [0, 5] },
    { id: 3, x: 80, y: 280, neighbors: [1, 6] },
    { id: 4, x: 220, y: 280, neighbors: [1, 5, 7] },
    { id: 5, x: 420, y: 280, neighbors: [2, 4, 8] },
    { id: 6, x: 120, y: 380, neighbors: [3, 7] },
    { id: 7, x: 250, y: 380, neighbors: [4, 6, 8] },
    { id: 8, x: 380, y: 380, neighbors: [5, 7] }
  ]);

  const [edges] = useState<GraphEdge[]>(() => {
    const edgeSet = new Set<string>();
    const edgeList: GraphEdge[] = [];
    
    nodes.forEach(node => {
      node.neighbors.forEach(neighborId => {
        const edgeKey = [node.id, neighborId].sort().join('-');
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          edgeList.push({ from: node.id, to: neighborId });
        }
      });
    });
    
    return edgeList;
  });

  const [startNodeId, setStartNodeId] = useState<number>(0);
  const [visitedNodes, setVisitedNodes] = useState<Set<number>>(new Set());
  const [currentNode, setCurrentNode] = useState<number>(-1);
  const [stack, setStack] = useState<number[]>([]);
  const [activeEdges, setActiveEdges] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [traversalOrder, setTraversalOrder] = useState<number[]>([]);
  
  const animationRef = useRef<{ current: boolean }>({ current: true });
  const dfsPromiseRef = useRef<Promise<void> | null>(null);

  const getDelay = () => {
    return 1000 / speed; // Base delay of 1 second divided by speed
  };

  const sleep = () => 
    new Promise(resolve => setTimeout(resolve, getDelay()));

  const handleNodeClick = (nodeId: number) => {
    if (isPlaying) return;
    setStartNodeId(nodeId);
    resetAnimation();
  };

  const resetAnimation = () => {
    if (isPlaying) return;
    
    animationRef.current.current = false;
    dfsPromiseRef.current = null;
    setIsPlaying(false);
    setIsCompleted(false);
    setVisitedNodes(new Set());
    setCurrentNode(-1);
    setStack([]);
    setActiveEdges(new Set());
    setTraversalOrder([]);
  };

  // The iterative DFS implementation (using a stack instead of recursion for animation)
  const startDFS = async () => {
    if (dfsPromiseRef.current) return;
    
    animationRef.current.current = true;
    setIsPlaying(true);
    setIsCompleted(false);
    
    const visited = new Set<number>();
    const dfsStack = [startNodeId]; // Using a stack for iterative DFS
    const order: number[] = [];
    
    setStack([startNodeId]);
    
    dfsPromiseRef.current = (async () => {
      while (dfsStack.length > 0 && animationRef.current.current) {
        // Pop from stack (last-in, first-out - LIFO)
        const currentNodeId = dfsStack.pop()!;
        
        if (visited.has(currentNodeId)) continue;
        
        // Mark as currently visiting
        setCurrentNode(currentNodeId);
        setStack([...dfsStack]);
        await sleep();
        
        if (!animationRef.current.current) return;
        
        // Mark as visited
        visited.add(currentNodeId);
        order.push(currentNodeId);
        setVisitedNodes(new Set(visited));
        setTraversalOrder([...order]);
        setCurrentNode(-1);
        
        // Push neighbors to stack (in reverse order to match typical DFS order)
        const currentGraphNode = nodes.find(n => n.id === currentNodeId);
        if (currentGraphNode) {
          const newNeighbors = currentGraphNode.neighbors
            .filter(neighborId => !visited.has(neighborId))
            .reverse(); // Reverse to process left-to-right in visualization
          
          // Highlight edges to new neighbors
          const newActiveEdges = new Set<string>();
          newNeighbors.forEach(neighborId => {
            const edgeKey = [currentNodeId, neighborId].sort().join('-');
            newActiveEdges.add(edgeKey);
          });
          setActiveEdges(newActiveEdges);
          
          dfsStack.push(...newNeighbors);
          setStack([...dfsStack]);
          
          if (newNeighbors.length > 0) {
            await sleep(); // Wait to show the edge highlighting
          }
        }
        
        // Clear active edges after showing them
        setActiveEdges(new Set());
        
        if (!animationRef.current.current) return;
      }
      
      if (animationRef.current.current) {
        setIsCompleted(true);
        setIsPlaying(false);
        setStack([]);
      }
    })();
    
    dfsPromiseRef.current.then(() => {
      dfsPromiseRef.current = null;
    });
  };

  const stopAnimation = () => {
    animationRef.current.current = false;
    setIsPlaying(false);
    dfsPromiseRef.current = null;
  };

  const pauseAnimation = () => {
    animationRef.current.current = false;
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      animationRef.current.current = false;
    };
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <svg width="500" height="500" className="mx-auto block">
          {/* Render edges */}
          {edges.map((edge, index) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;
            
            const edgeKey = [edge.from, edge.to].sort().join('-');
            return (
              <Edge
                key={index}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                isActive={activeEdges.has(edgeKey)}
              />
            );
          })}
          
          {/* Render nodes */}
          {nodes.map(node => (
            <Node
              key={node.id}
              id={node.id}
              x={node.x}
              y={node.y}
              isStart={node.id === startNodeId}
              isVisited={visitedNodes.has(node.id)}
              isCurrentlyVisiting={node.id === currentNode}
              isInStack={stack.includes(node.id)}
              onClick={handleNodeClick}
              disabled={isPlaying}
            />
          ))}
          
          {/* Render node labels */}
          {nodes.map(node => (
            <text
              key={`label-${node.id}`}
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              className="fill-white text-sm font-semibold pointer-events-none"
            >
              {node.id}
            </text>
          ))}
        </svg>
      </div>
      
      <AnimationControls
        onReset={resetAnimation}
        onPlay={startDFS}
        onPause={pauseAnimation}
        onStop={stopAnimation}
        isPlaying={isPlaying}
        disabled={false}
        speed={speed}
        onSpeedChange={(newSpeed) => {
          const clampedSpeed = Math.max(0.25, Math.min(2, newSpeed));
          setSpeed(clampedSpeed);
        }}
      />
      
      <div className="mt-6 text-center text-sm text-gray-400 space-y-3">
        <p className="text-base">Click any node to set it as the starting point for DFS</p>
        <div className="flex justify-center flex-wrap gap-4 text-sm">
          <span className="flex items-center">
            <div className="w-4 h-4 bg-indigo-600 rounded-full mr-2"></div>
            Start Node
          </span>
          <span className="flex items-center">
            <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div>
            Currently Visiting
          </span>
          <span className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
            In Stack
          </span>
          <span className="flex items-center">
            <div className="w-4 h-4 bg-emerald-500 rounded-full mr-2"></div>
            Visited
          </span>
        </div>
        
        {stack.length > 0 && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-purple-400"
          >
            Stack: [{stack.join(', ')}]
          </motion.p>
        )}
        
        {traversalOrder.length > 0 && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-emerald-400"
          >
            Traversal Order: {traversalOrder.join(' → ')}
          </motion.p>
        )}
        
        {isCompleted && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-emerald-500 font-semibold"
          >
            DFS traversal complete! Click any node to start from a different position.
          </motion.p>
        )}
      </div>
    </div>
  );
};
