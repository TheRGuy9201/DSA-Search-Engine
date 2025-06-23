import { useState, useEffect, useCallback } from 'react';
import { 
  getPaginatedLeetcodeProblems, 
  getPaginatedCodeforcesProblems 
} from '../services/problemsApi';
import { useProblemUserData } from './useProblemUserData';
import type { Problem } from '../types';

interface UseProblemsetFilters {
  searchTerm: string;
  platform: string;
  difficulty: string;
  tag: string;
  status: string;
  bookmarkedOnly: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface UseProblemsetReturn {
  problems: Problem[];
  loading: boolean;
  totalProblems: number;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  filters: UseProblemsetFilters;
  setSearchTerm: (term: string) => void;
  setPlatform: (platform: string) => void;
  setDifficulty: (difficulty: string) => void;
  setTag: (tag: string) => void;
  setStatus: (status: string) => void;
  setBookmarkedOnly: (bookmarkedOnly: boolean) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  resetFilters: () => void;
  handleSearch: (e: React.FormEvent) => void;
  problemsWithUserData: Problem[];  
  toggleBookmark: (id: number, source?: string) => void;
  updateProblemStatus: (id: number, status: 'Solved' | 'Attempted' | 'Not Attempted', source?: string) => void;
  isBookmarked: (id: number, source?: string) => boolean;
  getProblemStatus: (id: number, source?: string) => 'Solved' | 'Attempted' | 'Not Attempted';
}

interface ProblemResult {
  problems: Problem[];
  totalProblems: number;
  totalPages: number;
}

export const useProblemset = (itemsPerPageParam: number = 20): UseProblemsetReturn => {
  // State for problems
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalProblems, setTotalProblems] = useState<number>(0);
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [platform, setPlatform] = useState<string>('All');
  const [difficulty, setDifficulty] = useState<string>('All');
  const [tag, setTag] = useState<string>('All');
  const [status, setStatus] = useState<string>('All');
  const [bookmarkedOnly, setBookmarkedOnly] = useState<boolean>(false);
  
  // Sorting state
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemsPerPage] = useState<number>(itemsPerPageParam);
  
  // Apply user data (solved status, bookmarks) to problems
  const { problemsWithUserData, toggleBookmark, updateProblemStatus, isBookmarked, getProblemStatus } = useProblemUserData(problems);

  // Reset all filters to default values
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setPlatform('All');
    setDifficulty('All');
    setTag('All');
    setStatus('All');
    setBookmarkedOnly(false);
    setSortBy('id');
    setSortOrder('asc');
    setCurrentPage(1);
  }, []);

  // Function to fetch problems
  const fetchProblems = useCallback(async () => {
    setLoading(true);

    const filters = {
      searchTerm: searchTerm.trim(),
      difficulty: difficulty !== 'All' ? difficulty : undefined,
      tags: tag !== 'All' ? [tag] : undefined,
      status: status !== 'All' ? status : undefined,
      bookmarkedOnly: bookmarkedOnly
    };

    try {
      let leetcodeResult: ProblemResult = { problems: [], totalProblems: 0, totalPages: 0 };
      let codeforcesResult: ProblemResult = { problems: [], totalProblems: 0, totalPages: 0 };

      // Fetch based on selected platform
      if (platform === 'All' || platform === 'LeetCode') {
        leetcodeResult = await getPaginatedLeetcodeProblems(currentPage, itemsPerPage, filters);
      }

      if (platform === 'All' || platform === 'Codeforces') {
        codeforcesResult = await getPaginatedCodeforcesProblems(currentPage, itemsPerPage, filters);
      }

      // Combine and process results
      let combinedProblems: Problem[] = [];
      let combinedTotal = 0;

      if (platform === 'All') {
        // If showing both platforms, we need to merge and sort the results
        const leetcodeProblemsWithSource = leetcodeResult.problems.map(p => ({ 
          ...p, 
          source: 'LeetCode' as const 
        }));
        
        const codeforcesProblemsWithSource = codeforcesResult.problems.map(p => ({ 
          ...p, 
          source: 'Codeforces' as const 
        }));
        
        combinedProblems = [
          ...leetcodeProblemsWithSource,
          ...codeforcesProblemsWithSource
        ];
        
        combinedTotal = leetcodeResult.totalProblems + codeforcesResult.totalProblems;

        // Take only itemsPerPage items
        combinedProblems = combinedProblems.slice(0, itemsPerPage);
      } else if (platform === 'LeetCode') {
        combinedProblems = leetcodeResult.problems.map(p => ({ 
          ...p, 
          source: 'LeetCode' as const 
        }));
        combinedTotal = leetcodeResult.totalProblems;
        setTotalPages(leetcodeResult.totalPages);
      } else {
        combinedProblems = codeforcesResult.problems.map(p => ({ 
          ...p, 
          source: 'Codeforces' as const 
        }));
        combinedTotal = codeforcesResult.totalProblems;
        setTotalPages(codeforcesResult.totalPages);
      }

      setProblems(combinedProblems);
      setTotalProblems(combinedTotal);
      if (platform === 'All') {
        setTotalPages(Math.ceil(combinedTotal / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
      setProblems([]);
      setTotalProblems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, platform, difficulty, tag, status, searchTerm, bookmarkedOnly, itemsPerPage, sortBy, sortOrder]);

  // Fetch problems when filters or pagination change
  useEffect(() => {
    fetchProblems();
  }, [fetchProblems, currentPage, platform, difficulty, tag, status, bookmarkedOnly, sortBy, sortOrder]);

  // Reset to page 1 when search term changes and user submits search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page
    fetchProblems();
  };

  return {
    problems,
    loading,
    totalProblems,
    totalPages,
    currentPage,
    setCurrentPage,
    filters: {
      searchTerm,
      platform,
      difficulty,
      tag,
      status,
      bookmarkedOnly,
      sortBy,
      sortOrder
    },
    setSearchTerm,
    setPlatform,
    setDifficulty,
    setTag,
    setStatus,
    setBookmarkedOnly,
    setSortBy,
    setSortOrder,
    resetFilters,
    handleSearch,
    problemsWithUserData,
    toggleBookmark,
    updateProblemStatus,
    isBookmarked,
    getProblemStatus
  };
};
