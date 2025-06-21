import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the structure of a node in our linked list
interface ListNode {
  id: number;
  value: number;
  next: number | null;
}

// Node visualization component for the linked list
interface NodeProps {
  node: ListNode;
  position: { x: number; y: number };
  isActive: boolean;
  isHighlighted: boolean;
  isSelected: boolean;
  onClick?: () => void;
}

const Node: React.FC<NodeProps> = ({ 
  node, 
  position, 
  isActive,
  isHighlighted,
  isSelected,
  onClick 
}) => (
  <motion.g
    onClick={onClick}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0 }}
    whileHover={{ scale: 1.05 }}
    className={`cursor-pointer ${onClick ? 'hover:opacity-80' : ''}`}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
  >
    {/* Node box */}
    <motion.rect
      x={position.x}
      y={position.y}
      width={70}
      height={60}
      rx={5}
      fill={
        isSelected
          ? '#10B981' // Emerald for selected node
          : isActive 
            ? '#F59E0B' // Amber for active node
            : isHighlighted 
              ? '#8B5CF6' // Purple for highlighted node
              : '#6366F1' // Indigo for normal node
      }
      stroke={isSelected ? '#34D399' : isActive || isHighlighted ? '#ffffff' : '#E5E7EB'}
      strokeWidth={isSelected ? 3 : 2}
    />
    
    {/* Value section */}
    <motion.rect
      x={position.x}
      y={position.y}
      width={35}
      height={60}
      rx={5}
      fill={
        isActive 
          ? '#F59E0B' // Amber for active node
          : isHighlighted 
            ? '#8B5CF6' // Purple for highlighted node
            : '#6366F1' // Indigo for normal node
      }
      stroke={isActive || isHighlighted ? '#ffffff' : '#E5E7EB'}
      strokeWidth={2}
    />
    
    {/* Value text */}
    <text
      x={position.x + 17.5}
      y={position.y + 35}
      textAnchor="middle"
      dominantBaseline="middle"
      className="fill-white text-base font-semibold"
    >
      {node.value}
    </text>
    
    {/* Divider line */}
    <line
      x1={position.x + 35}
      y1={position.y}
      x2={position.x + 35}
      y2={position.y + 60}
      stroke={isActive || isHighlighted ? '#ffffff' : '#E5E7EB'}
      strokeWidth={2}
    />
    
    {/* Arrow symbol in pointer section */}
    {node.next !== null && (
      <text
        x={position.x + 52.5}
        y={position.y + 32}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white text-xl"
      >
        →
      </text>
    )}
    
    {/* NULL indicator */}
    {node.next === null && (
      <text
        x={position.x + 52.5}
        y={position.y + 32}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white text-sm font-mono"
      >
        NULL
      </text>
    )}
  </motion.g>
);

// Arrow connecting two nodes
interface ArrowProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isActive: boolean;
}

const Arrow: React.FC<ArrowProps> = ({ 
  startX, 
  startY, 
  endX, 
  endY, 
  isActive 
}) => (
  <motion.path
    d={`M${startX},${startY} C${startX + 40},${startY} ${endX - 40},${endY} ${endX},${endY}`}
    stroke={isActive ? '#F59E0B' : '#4B5563'}
    strokeWidth={isActive ? 3 : 2}
    fill="none"
    markerEnd={isActive ? "url(#activearrowhead)" : "url(#arrowhead)"}
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 1 }}
    exit={{ pathLength: 0, opacity: 0 }}
    transition={{ duration: 0.4 }}
  />
);

interface AnimationControlsProps {
  onReset: () => void;
  onInsert: () => void;
  onDelete: () => void;
  onTraverse: () => void;
  onValueChange: (value: number) => void;
  inputValue: number;
  isPlaying: boolean;
  disabled: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({
  onReset,
  onInsert,
  onDelete,
  onTraverse,
  onValueChange,
  inputValue,
  isPlaying,
  disabled,
  speed,
  onSpeedChange
}) => (
  <div className="flex flex-col items-center space-y-4 mt-4">
    <div className="flex items-center space-x-4 mb-2">
      <input
        type="number"
        min="1"
        max="99"
        value={inputValue}
        onChange={(e) => onValueChange(Math.min(99, Math.max(1, parseInt(e.target.value) || 1)))}
        disabled={isPlaying}
        className="w-16 px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={onInsert}
        disabled={disabled || isPlaying}
        className={`px-4 py-2 bg-green-600 text-white rounded transition-colors ${
          disabled || isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-500'
        }`}
      >
        Insert
      </button>      <button
        onClick={onDelete}
        disabled={disabled || isPlaying}
        className={`px-4 py-2 bg-red-600 text-white rounded transition-colors ${
          disabled || isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500'
        }`}
      >
        Delete
      </button>
      <button
        onClick={onTraverse}
        disabled={disabled || isPlaying}
        className={`px-4 py-2 bg-indigo-600 text-white rounded transition-colors ${
          disabled || isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-500'
        }`}
      >
        Traverse
      </button>
    </div>
    
    <div className="flex space-x-4">
      <button
        onClick={onReset}
        disabled={isPlaying}
        className={`px-4 py-2 bg-gray-700 text-white rounded transition-colors ${
          isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
        }`}
      >
        Reset
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

// Messages for operation feedback
interface MessageProps {
  text: string;
  type: 'info' | 'success' | 'error';
}

const Message: React.FC<MessageProps> = ({ text, type }) => {
  const bgColor = 
    type === 'success' ? 'bg-green-500/20 border-green-500/30' : 
    type === 'error' ? 'bg-red-500/20 border-red-500/30' : 
    'bg-blue-500/20 border-blue-500/30';
  
  const textColor = 
    type === 'success' ? 'text-green-400' : 
    type === 'error' ? 'text-red-400' : 
    'text-blue-400';
  
  return (
    <motion.div 
      className={`${bgColor} ${textColor} py-2 px-4 rounded-md border text-center`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {text}
    </motion.div>
  );
};

export const LinkedListAnimation: React.FC = () => {
  const [nodes, setNodes] = useState<ListNode[]>([
    { id: 1, value: 10, next: 2 },
    { id: 2, value: 20, next: 3 },
    { id: 3, value: 30, next: 4 },
    { id: 4, value: 40, next: null }
  ]);
    const [head, setHead] = useState<number>(1);
  const [inputValue, setInputValue] = useState<number>(50);
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<Set<number>>(new Set());
  const [activeArrow, setActiveArrow] = useState<[number, number] | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageProps | null>(null);
  const [speed, setSpeed] = useState<number>(1);
  const [nextNodeId, setNextNodeId] = useState<number>(5); // For generating unique IDs
  
  const animationRef = useRef<boolean>(true);
  const operationPromiseRef = useRef<Promise<void> | null>(null);    const getNodePosition = (index: number) => {
    // Calculate position based on index - moved starting position to the right to leave space for head label
    return { 
      x: 150 + (index * 120), 
      y: 140
    };
  };
  
  const getNodeById = (id: number) => {
    return nodes.find(node => node.id === id);
  };
  
  const getNodeIndex = (id: number) => {
    return nodes.findIndex(node => node.id === id);
  };
  
  const getDelay = () => {
    return 1000 / speed; // Base delay of 1 second divided by speed
  };
  
  const sleep = () => 
    new Promise(resolve => setTimeout(resolve, getDelay()));
    const resetAnimation = () => {
    if (isPlaying) return;
    
    animationRef.current = false;
    operationPromiseRef.current = null;
    setNodes([
      { id: 1, value: 10, next: 2 },
      { id: 2, value: 20, next: 3 },
      { id: 3, value: 30, next: 4 },
      { id: 4, value: 40, next: null }
    ]);
    setHead(1);
    setActiveNodeId(null);
    setSelectedNodeId(null);
    setHighlightedNodeIds(new Set());
    setActiveArrow(null);
    setMessage(null);
    setNextNodeId(5);
    setInputValue(50);
  };
  
  // Insertion animation
  const insertNode = async () => {
    if (operationPromiseRef.current || nodes.length >= 8) return;
    
    if (nodes.length >= 8) {
      setMessage({ 
        text: "Linked list is at maximum capacity (8 nodes)",
        type: "error" 
      });
      return;
    }
    
    animationRef.current = true;
    setIsPlaying(true);
    setMessage({ text: "Inserting a new node...", type: "info" });
    
    const newNodeId = nextNodeId;
    setNextNodeId(prevId => prevId + 1);
    
    operationPromiseRef.current = (async () => {
      // Start at head node
      setActiveNodeId(head);
      await sleep();
      
      if (!animationRef.current) return;
      
      // Traverse to the last node
      let currentNodeId = head;
      let currentNode = getNodeById(currentNodeId);
      
      while (currentNode && currentNode.next !== null && animationRef.current) {
        const nextNodeId = currentNode.next;
        setActiveArrow([currentNodeId, nextNodeId]);
        await sleep();
        
        if (!animationRef.current) return;
        
        setActiveNodeId(nextNodeId);
        setActiveArrow(null);
        await sleep();
        
        if (!animationRef.current) return;
        
        currentNodeId = nextNodeId;
        currentNode = getNodeById(currentNodeId);
      }
      
      if (!animationRef.current) return;
      
      // Create new node
      const newNode: ListNode = {
        id: newNodeId,
        value: inputValue,
        next: null
      };
      
      // Highlight the last node and add the new node
      setHighlightedNodeIds(new Set([currentNodeId]));
      await sleep();
      
      if (!animationRef.current) return;
      
      // Update the last node's next pointer
      setNodes(prevNodes => {
        const updatedNodes = [...prevNodes];
        const lastNodeIndex = updatedNodes.findIndex(n => n.id === currentNodeId);
        if (lastNodeIndex !== -1) {
          updatedNodes[lastNodeIndex] = {
            ...updatedNodes[lastNodeIndex],
            next: newNodeId
          };
        }
        return [...updatedNodes, newNode];
      });
      
      setActiveArrow([currentNodeId, newNodeId]);
      await sleep();
      
      if (!animationRef.current) return;
      
      // Highlight the new node
      setHighlightedNodeIds(new Set([newNodeId]));
      setActiveNodeId(newNodeId);
      setActiveArrow(null);
      await sleep();
      
      if (!animationRef.current) return;
        // Complete the operation
      setActiveNodeId(null);
      setHighlightedNodeIds(new Set());
      setMessage({ text: `Node with value ${inputValue} inserted successfully!`, type: "success" });
      setInputValue(prev => (prev + 10) % 100 || 10); // Generate next value for convenience
      setIsPlaying(false);
    })();
    
    operationPromiseRef.current.then(() => {
      operationPromiseRef.current = null;
    });
  };
    // Deletion animation
  const deleteNode = async () => {
    if (operationPromiseRef.current || nodes.length <= 1) return;
    
    // If no node is selected, show an info message
    if (!selectedNodeId) {
      setMessage({ 
        text: "Please select a node to delete by clicking on it", 
        type: "info" 
      });
      return;
    }
    
    animationRef.current = true;
    setIsPlaying(true);
    setMessage({ text: "Deleting the selected node...", type: "info" });
    
    const nodeIdToDelete = selectedNodeId;
    const nodeToDelete = getNodeById(nodeIdToDelete);
    
    if (!nodeToDelete) {
      setIsPlaying(false);
      setMessage({ text: "Error: Could not find selected node", type: "error" });
      return;
    }
    
    const valueToDelete = nodeToDelete.value;
    
    operationPromiseRef.current = (async () => {
      // Highlight the selected node
      setActiveNodeId(nodeIdToDelete);
      await sleep();
      
      if (!animationRef.current) return;
      
      if (nodes.length === 1) {
        // Only one node left, reset the list
        setHighlightedNodeIds(new Set([nodeIdToDelete]));
        await sleep();
        
        if (!animationRef.current) return;
        
        setNodes([]);
        setHead(-1);
        setMessage({ text: "Linked list is now empty", type: "info" });
        setActiveNodeId(null);
        setHighlightedNodeIds(new Set());
        setSelectedNodeId(null);
        setIsPlaying(false);
        return;
      }
      
      // Handle head deletion (special case)
      if (nodeIdToDelete === head) {
        setHighlightedNodeIds(new Set([head]));
        await sleep();
        
        if (!animationRef.current) return;
        
        const nextHead = getNodeById(head)?.next;
        if (nextHead !== null && nextHead !== undefined) {
          setActiveArrow([head, nextHead]);
          await sleep();
          
          if (!animationRef.current) return;
          
          // Update head and remove the old head node
          setHead(nextHead);
          setActiveNodeId(nextHead);
          setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeIdToDelete));
          setHighlightedNodeIds(new Set());
          setActiveArrow(null);
          await sleep();
        }
      } else {
        // Find the previous node (the one that points to our target)
        const prevNodeId = nodes.find(node => node.next === nodeIdToDelete)?.id;
        
        if (prevNodeId) {
          // Start from head, traverse to the previous node
          setActiveNodeId(head);
          await sleep();
          
          if (!animationRef.current) return;
          
          // Highlight the path to prev node
          let currentId = head;
          while (currentId !== prevNodeId && getNodeById(currentId)?.next) {
            const nextId = getNodeById(currentId)?.next;
            if (nextId) {
              setActiveArrow([currentId, nextId]);
              await sleep();
              
              if (!animationRef.current) return;
              
              setActiveNodeId(nextId);
              setActiveArrow(null);
              await sleep();
              
              if (!animationRef.current) return;
              
              currentId = nextId;
            } else {
              break;
            }
          }
          
          // Highlight the previous node
          setHighlightedNodeIds(new Set([prevNodeId]));
          await sleep();
          
          if (!animationRef.current) return;
          
          // Show connection from prev to target
          setActiveArrow([prevNodeId, nodeIdToDelete]);
          await sleep();
          
          if (!animationRef.current) return;
          
          // Get the next node (after the one we're deleting)
          const nextNodeId = nodeToDelete.next;
          
          // Update the previous node's next pointer to skip the deleted node
          setNodes(prevNodes => prevNodes.map(node => 
            node.id === prevNodeId 
              ? { ...node, next: nextNodeId } 
              : node
          ));
          
          // Show connection from prev to next (skipping target)
          if (nextNodeId !== null) {
            setActiveArrow([prevNodeId, nextNodeId]);
            await sleep();
            
            if (!animationRef.current) return;
          }
          
          // Remove the node from the list
          setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeIdToDelete));
          setActiveArrow(null);
          await sleep();
        }
      }
      
      if (!animationRef.current) return;
      
      // Complete the operation
      setActiveNodeId(null);
      setHighlightedNodeIds(new Set());
      setSelectedNodeId(null);
      setMessage({ text: `Node with value ${valueToDelete} deleted successfully!`, type: "success" });
      setIsPlaying(false);
    })();
    
    operationPromiseRef.current.then(() => {
      operationPromiseRef.current = null;
    });
  };
  
  // Traversal animation
  const traverseList = async () => {
    if (operationPromiseRef.current || nodes.length === 0) return;
    
    animationRef.current = true;
    setIsPlaying(true);
    setMessage({ text: "Traversing the linked list...", type: "info" });
    
    operationPromiseRef.current = (async () => {
      // Start at head node
      setActiveNodeId(head);
      const traversalOrder: number[] = [getNodeById(head)?.value || 0];
      await sleep();
      
      if (!animationRef.current) return;
      
      // Traverse the list
      let currentNodeId = head;
      let currentNode = getNodeById(currentNodeId);
      
      while (currentNode && currentNode.next !== null && animationRef.current) {
        const nextNodeId = currentNode.next;
        setActiveArrow([currentNodeId, nextNodeId]);
        await sleep();
        
        if (!animationRef.current) return;
        
        setActiveNodeId(nextNodeId);
        setActiveArrow(null);
        traversalOrder.push(getNodeById(nextNodeId)?.value || 0);
        await sleep();
        
        if (!animationRef.current) return;
        
        currentNodeId = nextNodeId;
        currentNode = getNodeById(currentNodeId);
      }
      
      // Complete the traversal
      setActiveNodeId(null);
      setMessage({ 
        text: `Traversal complete: ${traversalOrder.join(' → ')}`,
        type: "success"
      });
      setIsPlaying(false);
    })();
    
    operationPromiseRef.current.then(() => {
      operationPromiseRef.current = null;
    });
  };
  
  useEffect(() => {
    return () => {
      animationRef.current = false;
    };
  }, []);
  
  // Calculate the viewBox based on the number of nodes
  const viewBoxWidth = Math.max(800, nodes.length * 120 + 240);
  
  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl p-6 mb-6 min-h-[500px] border border-gray-700/50 shadow-xl">
        <svg 
          width="100%" 
          height="300" 
          viewBox={`0 0 ${viewBoxWidth} 300`} 
          className="mx-auto block"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Define arrowhead markers and gradients */}
          <defs>
            {/* Regular arrowhead */}
            <marker
              id="arrowhead"
              markerWidth="12"
              markerHeight="9"
              refX="10"
              refY="4.5"
              orient="auto"
            >
              <polygon
                points="0 0, 12 4.5, 0 9"
                fill="#4B5563"
                stroke="#4B5563"
                strokeWidth="1"
              />
            </marker>
            
            {/* Active arrowhead with glow */}
            <marker
              id="activearrowhead"
              markerWidth="14"
              markerHeight="10"
              refX="12"
              refY="5"
              orient="auto"
            >
              <polygon
                points="0 0, 14 5, 0 10"
                fill="#F59E0B"
                stroke="#FFFFFF"
                strokeWidth="1"
              />
            </marker>
            
            {/* Head-specific arrowhead */}
            <marker
              id="headarrowhead"
              markerWidth="14"
              markerHeight="10"
              refX="12"
              refY="5"
              orient="auto"
            >
              <polygon
                points="0 0, 14 5, 0 10"
                fill="#818CF8"
                stroke="#FFFFFF"
                strokeWidth="1"
              />
            </marker>
            
            {/* Head arrow gradient */}
            <linearGradient id="headArrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
              {/* Glow filter for arrowheads */}
            <filter id="arrowGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feColorMatrix 
                in="blur" 
                type="matrix" 
                values="0 0 0 0 1
                        0 0 0 0 0.6
                        0 0 0 0 0
                        0 0 0 0.7 0"
                result="glow" 
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Ambient light overlay */}
            <radialGradient id="ambientLight" cx="50%" cy="50%" r="75%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          
          {/* Ambient light effect */}
          <circle 
            cx={viewBoxWidth / 2}
            cy="150"
            r="200"
            fill="url(#ambientLight)"
            opacity="0.7"
          />
            {/* Head pointer - enhanced and moved left */}
          <motion.g
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >            {/* Head label background */}
            <rect
              x="15"
              y="120"
              width="75"
              height="40"
              rx="6"
              fill="rgba(99, 102, 241, 0.3)"
              stroke="rgba(129, 140, 248, 0.8)"
              strokeWidth="2"
              filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
            />
            
            {/* Head text */}
            <text
              x="52.5"
              y="140"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-base font-bold"
              filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.5))"
            >
              HEAD
            </text>
              {/* Arrow from HEAD to first node */}
            <motion.path
              d={`M90,140 C${(getNodePosition(0).x - 90) * 0.3 + 90},140 ${(getNodePosition(0).x - 90) * 0.7 + 90},140 ${getNodePosition(0).x - 15},140`}
              stroke="url(#headArrowGradient)"
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              markerEnd="url(#headarrowhead)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
              {/* Pulse effect around head */}
            <circle
              cx="52.5"
              cy="140"
              r="35"
              stroke="#6366F1"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            >
              <animate 
                attributeName="r" 
                values="35;40;35" 
                dur="2.5s" 
                repeatCount="indefinite" 
              />
              <animate 
                attributeName="opacity" 
                values="0.5;0.2;0.5" 
                dur="2.5s" 
                repeatCount="indefinite" 
              />
            </circle>
          </motion.g>
          
          {/* Draw arrows between nodes */}
          <AnimatePresence>
            {nodes.map((node, index) => {
              if (node.next !== null) {
                const nextNode = getNodeById(node.next);
                if (nextNode) {
                  const nextIndex = getNodeIndex(nextNode.id);
                  const isActive = activeArrow && activeArrow[0] === node.id && activeArrow[1] === nextNode.id;
                  
                  return (                    <Arrow
                      key={`arrow-${node.id}-${nextNode.id}`}
                      startX={getNodePosition(index).x + 70}
                      startY={getNodePosition(index).y + 30}
                      endX={getNodePosition(nextIndex).x}
                      endY={getNodePosition(nextIndex).y + 30}
                      isActive={!!isActive}
                    />
                  );
                }
              }
              return null;
            })}
          </AnimatePresence>
            {/* Render nodes */}
          <AnimatePresence>
            {nodes.map((node, index) => (
              <Node
                key={`node-${node.id}`}
                node={node}
                position={getNodePosition(index)}
                isActive={activeNodeId === node.id}
                isHighlighted={highlightedNodeIds.has(node.id)}
                isSelected={selectedNodeId === node.id}
                onClick={() => !isPlaying && setSelectedNodeId(node.id)}
              />
            ))}
          </AnimatePresence>
        </svg>
      </div>
        <AnimationControls
        onReset={resetAnimation}
        onInsert={insertNode}
        onDelete={deleteNode}
        onTraverse={traverseList}
        onValueChange={setInputValue}
        inputValue={inputValue}
        isPlaying={isPlaying}
        disabled={nodes.length === 0}
        speed={speed}
        onSpeedChange={(newSpeed) => {
          const clampedSpeed = Math.max(0.25, Math.min(2, newSpeed));
          setSpeed(clampedSpeed);
        }}
      />
      
      {!isPlaying && !selectedNodeId && nodes.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-blue-400">
            <span className="inline-block animate-pulse mr-1">💡</span>
            Click on a node to select it for deletion
          </p>
        </div>
      )}
        <div className="mt-6 text-center text-sm text-gray-400 space-y-3">
        <div className="flex justify-center flex-wrap gap-4 text-sm">
          <span className="flex items-center">
            <div className="w-4 h-4 bg-indigo-600 rounded-full mr-2"></div>
            Normal Node
          </span>
          <span className="flex items-center">
            <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div>
            Active Node
          </span>
          <span className="flex items-center">
            <div className="w-4 h-4 bg-emerald-500 rounded-full mr-2"></div>
            Selected Node (For Deletion)
          </span>
        </div>
        
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              key={message.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Message text={message.text} type={message.type} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
