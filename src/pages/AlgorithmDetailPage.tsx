import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from '../services/api';
import type { Algorithm } from '../services/api';
import { AlgorithmContent } from '../components/AlgorithmContent';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Algorithm Detail Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8 min-h-screen bg-gray-900 flex flex-col items-center justify-center">
          <div className="text-red-400 mb-6 bg-red-900/20 p-6 rounded-lg border border-red-700/30 max-w-lg">
            <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>
            <p>We're having trouble displaying this algorithm.</p>
          </div>
          <button 
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
            onClick={() => window.location.href = '/algorithms'}
          >
            Return to Algorithms
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const AlgorithmDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlgorithm = async () => {
      if (!id) {
        setError('No algorithm ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await apiService.getAlgorithmById(id);
        
        if (!data) {
          setError('Algorithm not found');
          return;
        }        // Validate required fields
        if (!data.name) {
          setError('Invalid algorithm data: missing name');
          return;
        }
        
        // Implementation might be provided through algorithmImplementationsMap
        // so we don't want to block algorithms that use that approach
        
        // Ensure all fields are properly typed
        setAlgorithm({
          ...data,
          id: String(data.id),
          name: String(data.name),
          category: String(data.category),
          timeComplexity: String(data.timeComplexity),
          spaceComplexity: String(data.spaceComplexity),
          description: String(data.description),
          implementation: String(data.implementation),
          useCases: data.useCases?.map(String) || [],
          examples: data.examples || []
        });
        
      } catch (err) {
        console.error('Error fetching algorithm:', err);
        setError(err instanceof Error ? err.message : 'Failed to load algorithm');
      } finally {
        setLoading(false);
      }
    };

    fetchAlgorithm();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-400">Loading algorithm details...</p>
        </div>
      </div>
    );
  }

  if (error || !algorithm) {
    return (
      <div className="text-center p-8 min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <div className="text-amber-400 mb-6 bg-amber-900/20 p-6 rounded-lg border border-amber-700/30 max-w-lg">
          <h2 className="text-xl font-semibold mb-2">{error ? 'Error' : 'Not Found'}</h2>
          <p>{error || "The algorithm you're looking for could not be found."}</p>
        </div>
        <button 
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
          onClick={() => navigate('/algorithms')}
        >
          Return to Algorithms
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AlgorithmContent algorithm={algorithm} />
    </ErrorBoundary>
  );
};

export default AlgorithmDetailPage;
