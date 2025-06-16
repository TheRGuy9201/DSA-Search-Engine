import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from '../services/api';
import type { Algorithm } from '../services/api';

const AlgorithmDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchAlgorithm = async () => {
      setLoading(true);

      try {
        if (id) {
          const data = await apiService.getAlgorithmById(id);
          if (data) {
            setAlgorithm(data);
          } else {
            setError('Algorithm not found');
          }
        }
      } catch (err) {
        console.error('Error fetching algorithm:', err);
        setError('Failed to load algorithm data');
      } finally {
        setLoading(false);
      }
    };

    fetchAlgorithm();
  }, [id]);
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  if (!algorithm) {
    return <div className="text-center p-8">Algorithm not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{algorithm.name}</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-full">
          {algorithm.category}
        </span>
        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
          Time: {algorithm.timeComplexity}
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
          Space: {algorithm.spaceComplexity}
        </span>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {['description', 'implementation', 'use-cases', 'examples'].map((tab) => (
            <button
              key={tab}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on active tab */}
      <div className="prose max-w-none">
        {activeTab === 'description' && (
          <div>
            <p className="text-lg">{algorithm.description}</p>
          </div>
        )}

        {activeTab === 'implementation' && algorithm.implementation && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Implementation</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{algorithm.implementation}</code>
            </pre>
          </div>
        )}

        {activeTab === 'use-cases' && algorithm.useCases && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Use Cases</h2>
            <ul className="list-disc pl-6">
              {algorithm.useCases.map((useCase, index) => (
                <li key={index} className="mb-2">{useCase}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'examples' && algorithm.examples && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Examples</h2>
            {algorithm.examples.map((example, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-lg font-medium mb-2">{example.title}</h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-2">
                  <code>{example.code}</code>
                </pre>
                <p>{example.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmDetailPage;
