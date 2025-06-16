import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import AlgorithmDetailPage from './pages/AlgorithmDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
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
]);

export default router;
