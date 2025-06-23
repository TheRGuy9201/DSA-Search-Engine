import { useState, useEffect } from 'react';
import { getRecordedProblemMatches, getMatchStats } from '../services/debugUtils';

interface DebugPanelProps {
  isAdmin?: boolean;
}

/**
 * Debug panel to help diagnose problem matching issues
 * Only shown to admins or when in development mode
 */
export const DebugPanel: React.FC<DebugPanelProps> = ({ isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [matchStats, setMatchStats] = useState<any>(null);
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  
  // Only show the debug panel if user is admin or in development mode
  const isDevelopment = import.meta.env.DEV;
  const showDebugPanel = isAdmin || isDevelopment;
  
  // Update stats periodically
  useEffect(() => {
    if (!showDebugPanel) return;
    
    const updateStats = () => {
      const stats = getMatchStats();
      const matches = getRecordedProblemMatches().slice(-10); // Get last 10 matches
      
      setMatchStats(stats);
      setRecentMatches(matches);
    };
    
    updateStats(); // Initial update
    
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, [showDebugPanel]);
  
  if (!showDebugPanel) return null;
  
  return (
    <div className="mt-8 border-t pt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-amber-500">Debug Panel</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-2 py-1 bg-gray-800 text-white text-sm rounded"
        >
          {isOpen ? 'Hide' : 'Show'} Debug Info
        </button>
      </div>
      
      {isOpen && (
        <div className="mt-4 p-4 bg-gray-900 rounded-lg text-sm">
          <h4 className="font-bold mb-2">Problem Match Statistics</h4>
          
          {matchStats ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-800 p-3 rounded">
                  <p className="text-green-400 mb-1">Total Matches</p>
                  <p className="text-xl font-mono">{matchStats.total}</p>
                </div>
                
                <div className="bg-gray-800 p-3 rounded">
                  <p className="text-blue-400 mb-1">By Source</p>
                  <div className="font-mono">
                    {Object.entries(matchStats.bySource).map(([source, count]) => (
                      <div key={source} className="flex justify-between gap-4">
                        <span>{source}:</span>
                        <span>{count as number}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-800 p-3 rounded">
                  <p className="text-purple-400 mb-1">By Match Type</p>
                  <div className="font-mono">
                    {Object.entries(matchStats.byMatchType).map(([type, count]) => (
                      <div key={type} className="flex justify-between gap-4">
                        <span>{type}:</span>
                        <span>{count as number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-2">Recent Matches</h4>
                <div className="bg-gray-800 p-3 rounded overflow-auto max-h-60">
                  {recentMatches.length > 0 ? (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="p-1">ID</th>
                          <th className="p-1">Title</th>
                          <th className="p-1">Source</th>
                          <th className="p-1">Match Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentMatches.map((match, idx) => (
                          <tr key={idx} className="border-b border-gray-700">
                            <td className="p-1">{match.problem.id}</td>
                            <td className="p-1 truncate max-w-48">{match.problem.title}</td>
                            <td className="p-1">{match.problem.source}</td>
                            <td className="p-1">{match.matchType}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No matches recorded yet</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p>Loading stats...</p>
          )}
        </div>
      )}
    </div>
  );
};
