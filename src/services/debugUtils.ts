// Debug utilities for monitoring and testing problem matching

// Enable or disable debug mode
const DEBUG_MODE = true;

/**
 * Log debug messages if debug mode is enabled
 * @param message Debug message
 * @param data Optional data to log
 */
export function debugLog(message: string, data?: any): void {
  if (DEBUG_MODE) {
    if (data) {
      console.log(`[Debug] ${message}`, data);
    } else {
      console.log(`[Debug] ${message}`);
    }
  }
}

/**
 * Track problem matches for debugging
 */
interface MatchRecord {
  problem: {
    id: number;
    title: string;
    source: string;
  };
  matchType: string;
  matchedWith?: string;
  timestamp: number;
}

const problemMatches: MatchRecord[] = [];

/**
 * Record a successful problem match for debugging
 */
export function recordProblemMatch(
  problem: { id: number; title: string; source: string },
  matchType: string,
  matchedWith?: string
): void {
  if (DEBUG_MODE) {
    problemMatches.push({
      problem,
      matchType,
      matchedWith,
      timestamp: Date.now()
    });
    
    debugLog(
      `Match recorded: ${problem.source} problem #${problem.id} "${problem.title}" via ${matchType}` +
      (matchedWith ? ` with "${matchedWith}"` : '')
    );
  }
}

/**
 * Get all recorded problem matches
 */
export function getRecordedProblemMatches(): MatchRecord[] {
  return [...problemMatches];
}

/**
 * Clear recorded problem matches
 */
export function clearRecordedProblemMatches(): void {
  problemMatches.length = 0;
}

/**
 * Get stats about recorded matches
 */
export function getMatchStats(): { total: number; bySource: Record<string, number>; byMatchType: Record<string, number> } {
  const stats = {
    total: problemMatches.length,
    bySource: {} as Record<string, number>,
    byMatchType: {} as Record<string, number>
  };
  
  problemMatches.forEach(match => {
    // Count by source
    const source = match.problem.source.toLowerCase();
    stats.bySource[source] = (stats.bySource[source] || 0) + 1;
    
    // Count by match type
    stats.byMatchType[match.matchType] = (stats.byMatchType[match.matchType] || 0) + 1;
  });
  
  return stats;
}

/**
 * Test if a problem would match with an external solved problem list
 * @param problem The problem to test
 * @param externalLists External problem lists
 * @returns Match result with details
 */
export function testProblemMatch(
  problem: Record<string, any>,
  externalLists: Record<string, any>
): { matched: boolean; source?: string; matchType?: string; matchValue?: any } {
  // Implementation would mirror the logic in getCombinedProblemStatus
  // but return detailed match information instead of just a status
  
  if (!problem || !externalLists) {
    return { matched: false };
  }
  
  // Simplified implementation - in a real app, would mirror getCombinedProblemStatus logic
  return { matched: false };
}
