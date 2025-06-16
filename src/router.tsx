import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import AlgorithmDetailPage from './pages/AlgorithmDetailPage';

// Get base URL from Vite configuration for GitHub Pages
const baseUrl = import.meta.env.BASE_URL;

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,        // Handle the onPlatformSelect prop correctly
        element: <HomePage onPlatformSelect={() => { }} />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'algorithm/:id',
        element: <AlgorithmDetailPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  // Use basename to handle GitHub Pages subpath
  basename: baseUrl,
});

export default router;
