import { useState, useEffect } from 'react';
import apiService from '../services/api';
import type { Algorithm } from '../services/api';

type SearchHookReturn = {
  results: Algorithm[];
  loading: boolean;
  error: string | null;
  search: (term: string) => void;
};

const useAlgorithmSearch = (): SearchHookReturn => {
  const [results, setResults] = useState<Algorithm[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const search = (term: string) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await apiService.searchAlgorithms(searchTerm);
        setResults(data);
      } catch (err) {
        setError('Failed to fetch results. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    // Add debounce to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return { results, loading, error, search };
};

export default useAlgorithmSearch;
