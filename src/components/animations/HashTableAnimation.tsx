import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HashSlot {
  key: string;
  value: string;
  collisions: Array<{key: string, value: string}>;
}

export const HashTableAnimation: React.FC = () => {
  const [tableSize, /*setTableSize*/] = useState<number>(7);
  const [hashTable, setHashTable] = useState<HashSlot[]>(Array(tableSize).fill(null).map(() => ({
    key: '',
    value: '',
    collisions: []
  })));
  const [key, setKey] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [searchKey, setSearchKey] = useState<string>('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');

  // Simple hash function
  const hashFunction = useCallback((key: string): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i)) % tableSize;
    }
    return hash;
  }, [tableSize]);

  // Insert a key-value pair
  const insertItem = () => {
    if (!key || !value) {
      showMessage('Please enter both key and value', 'error');
      return;
    }

    const hash = hashFunction(key);
    setActiveSlot(hash);
    
    const newTable = [...hashTable];
    
    // If slot is empty
    if (!newTable[hash].key) {
      newTable[hash] = { key, value, collisions: [] };
      setHashTable(newTable);
      showMessage(`Inserted "${key}: ${value}" at index ${hash}`, 'success');
    } 
    // If key already exists, update value
    else if (newTable[hash].key === key) {
      newTable[hash].value = value;
      setHashTable(newTable);
      showMessage(`Updated "${key}" with value "${value}" at index ${hash}`, 'success');
    }
    // Handle collision with chaining
    else {
      // Check if key exists in collision chain
      const collisionIndex = newTable[hash].collisions.findIndex(item => item.key === key);
      
      if (collisionIndex >= 0) {
        newTable[hash].collisions[collisionIndex].value = value;
        showMessage(`Updated "${key}" with value "${value}" in collision chain at index ${hash}`, 'success');
      } else {
        newTable[hash].collisions.push({ key, value });
        showMessage(`Added "${key}: ${value}" to collision chain at index ${hash}`, 'success');
      }
      setHashTable(newTable);
    }
    
    // Reset input fields
    setKey('');
    setValue('');
    
    // Clear active slot after animation
    setTimeout(() => setActiveSlot(null), 1500);
  };

  // Lookup a value by key
  const lookupItem = () => {
    if (!searchKey) {
      showMessage('Please enter a key to search', 'error');
      return;
    }

    const hash = hashFunction(searchKey);
    setActiveSlot(hash);
    
    if (!hashTable[hash].key) {
      setSearchResult(null);
      showMessage(`Key "${searchKey}" not found`, 'error');
    } else if (hashTable[hash].key === searchKey) {
      setSearchResult(hashTable[hash].value);
      showMessage(`Found "${searchKey}" with value "${hashTable[hash].value}" at index ${hash}`, 'success');
    } else {
      // Search in collision chain
      const collision = hashTable[hash].collisions.find(item => item.key === searchKey);
      if (collision) {
        setSearchResult(collision.value);
        showMessage(`Found "${searchKey}" with value "${collision.value}" in collision chain at index ${hash}`, 'success');
      } else {
        setSearchResult(null);
        showMessage(`Key "${searchKey}" not found`, 'error');
      }
    }
    
    // Clear active slot after animation
    setTimeout(() => setActiveSlot(null), 1500);
  };

  // Delete an item by key
  const deleteItem = () => {
    if (!searchKey) {
      showMessage('Please enter a key to delete', 'error');
      return;
    }

    const hash = hashFunction(searchKey);
    setActiveSlot(hash);
    
    const newTable = [...hashTable];
    
    if (!newTable[hash].key) {
      showMessage(`Key "${searchKey}" not found`, 'error');
    } else if (newTable[hash].key === searchKey) {
      // If there are collisions, move the first collision up
      if (newTable[hash].collisions.length > 0) {
        const firstCollision = newTable[hash].collisions.shift();
        newTable[hash] = {
          key: firstCollision!.key,
          value: firstCollision!.value,
          collisions: newTable[hash].collisions
        };
      } else {
        // Simply clear the slot
        newTable[hash] = { key: '', value: '', collisions: [] };
      }
      setHashTable(newTable);
      showMessage(`Deleted key "${searchKey}" from index ${hash}`, 'success');
    } else {
      // Check if key is in collision chain
      const collisionIndex = newTable[hash].collisions.findIndex(item => item.key === searchKey);
      
      if (collisionIndex >= 0) {
        newTable[hash].collisions.splice(collisionIndex, 1);
        setHashTable(newTable);
        showMessage(`Deleted key "${searchKey}" from collision chain at index ${hash}`, 'success');
      } else {
        showMessage(`Key "${searchKey}" not found`, 'error');
      }
    }
    
    // Clear search and results
    setSearchKey('');
    setSearchResult(null);
    
    // Clear active slot after animation
    setTimeout(() => setActiveSlot(null), 1500);
  };

  // Show a message with auto-clear
  const showMessage = (msg: string, type: 'info' | 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl p-6 mb-6 border border-gray-700/50 shadow-xl">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white mb-4">Hash Table Operations</h3>
          
          {/* Insert Section */}
          <div className="mb-6 bg-gray-800/50 p-4 rounded-md">
            <h4 className="text-md font-medium text-gray-300 mb-3">Insert / Update</h4>
            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Key"
                className="bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Value"
                className="bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={insertItem}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md transition-colors"
              >
                Insert
              </button>
            </div>
          </div>
          
          {/* Lookup/Delete Section */}
          <div className="bg-gray-800/50 p-4 rounded-md">
            <h4 className="text-md font-medium text-gray-300 mb-3">Lookup / Delete</h4>
            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="Key"
                className="bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={lookupItem}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md transition-colors"
              >
                Lookup
              </button>
              <button
                onClick={deleteItem}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
            
            {searchResult !== null && (
              <div className="mt-3 bg-gray-700/50 p-3 rounded-md text-emerald-300">
                Found value: <span className="font-mono">{searchResult}</span>
              </div>
            )}
          </div>
          
          {/* Status Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 p-3 rounded-md text-sm ${
                  messageType === 'success' ? 'bg-green-900/30 text-green-300 border border-green-700/30' :
                  messageType === 'error' ? 'bg-red-900/30 text-red-300 border border-red-700/30' :
                  'bg-blue-900/30 text-blue-300 border border-blue-700/30'
                }`}
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Hash Table Visualization */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-white mb-4">Hash Table Visualization</h3>
          <div className="grid gap-3">
            {hashTable.map((slot, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-md ${
                  activeSlot === index 
                    ? 'bg-indigo-900/70 border-2 border-indigo-500' 
                    : 'bg-gray-800/70 border border-gray-700/50'
                }`}
                animate={activeSlot === index ? {
                  scale: [1, 1.03, 1],
                  transition: { duration: 0.5 }
                } : {}}
              >
                <div className="flex justify-between items-start">
                  <span className="text-gray-400 font-mono text-sm">Index {index}</span>
                  <span className="text-gray-500 text-xs">hash = {index}</span>
                </div>
                
                {/* Main slot */}
                <div className={`mt-2 p-3 rounded ${slot.key ? 'bg-gray-700/60' : 'bg-gray-700/20 border border-dashed border-gray-700/50'}`}>
                  {slot.key ? (
                    <div className="flex justify-between">
                      <span className="text-indigo-400 font-medium">{slot.key}:</span>
                      <span className="text-white font-mono">{slot.value}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">Empty Slot</span>
                  )}
                </div>
                
                {/* Collision chain */}
                {slot.collisions.length > 0 && (
                  <div className="mt-2 ml-4 border-l-2 border-indigo-500/30 pl-3">
                    <div className="text-xs text-indigo-400 mb-1">Collision chain:</div>
                    {slot.collisions.map((collision, cIndex) => (
                      <div
                        key={cIndex}
                        className="mt-1 p-2 bg-indigo-900/30 rounded border border-indigo-700/30"
                      >
                        <div className="flex justify-between">
                          <span className="text-indigo-300 font-medium">{collision.key}:</span>
                          <span className="text-gray-300 font-mono">{collision.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-400">
        <span className="flex items-center">
          <div className="w-4 h-4 bg-gray-700/20 rounded-md border border-dashed border-gray-700/50 mr-2"></div>
          Empty Slot
        </span>
        <span className="flex items-center">
          <div className="w-4 h-4 bg-gray-700/60 rounded-md mr-2"></div>
          Occupied Slot
        </span>
        <span className="flex items-center">
          <div className="w-4 h-4 bg-indigo-900/30 rounded-md border border-indigo-700/30 mr-2"></div>
          Collision Entry
        </span>
        <span className="flex items-center">
          <div className="w-4 h-4 bg-indigo-900/70 rounded-md border-2 border-indigo-500 mr-2"></div>
          Active Operation
        </span>
      </div>
    </div>
  );
};

export default HashTableAnimation;
