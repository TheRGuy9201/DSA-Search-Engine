import { createBrowserRouter, Navigate, useNavigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from './App';

// Get base URL from environment variable
const basename = import.meta.env.VITE_BASE_URL || '/';

// Use dynamic imports for code-splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const AlgorithmsPage = lazy(() => import('./pages/AlgorithmsPage'));
const AlgorithmDetailPage = lazy(() => import('./pages/AlgorithmDetailPage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ProblemsetPage = lazy(() => import('./pages/ProblemsetPage'));
const MorePage = lazy(() => import('./pages/MorePage'));
const PlatformPage = lazy(() => import('./pages/PlatformPage'));

// Loading component for suspense fallback
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="loader"></div>
  </div>
);

// We'll use a component with useNavigate
const HomepageWrapper = () => {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomePage onPlatformSelect={(platform) => navigate(`/platform/${platform}`)} />
    </Suspense>
  );
};

// PlatformPage wrapper with navigate
const PlatformPageWrapper = () => {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PlatformPage onBackClick={() => navigate('/')} />
    </Suspense>
  );
};

// AlgorithmDetailPage wrapper with loading state
const AlgorithmDetailPageWrapper = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AlgorithmDetailPage />
    </Suspense>
  );
};

/**
 * Router configuration for React Router v6.
 * Uses code splitting with suspense for better performance.
 */
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
    children: [
      {
        index: true,
        element: <HomepageWrapper />
      },
      {
        path: 'algorithms',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AlgorithmsPage />
          </Suspense>
        ),
      },
      {
        path: 'search',
        element: <Navigate to="/algorithms" replace />,
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SettingsPage />
          </Suspense>
        ),
      },
      {
        path: 'problemset',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProblemsetPage />
          </Suspense>
        ),
      },
      {
        path: 'more',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <MorePage />
          </Suspense>
        ),
      },
      {
        path: 'algorithm/:id',
        element: <AlgorithmDetailPageWrapper />
      },
      {
        path: 'signin',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SignInPage />
          </Suspense>
        ),
      },
      {
        path: 'platform/:platformName',
        element: <PlatformPageWrapper />
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
  ],
  {
    basename // Use the environment variable for base URL
  }
);

export default router;
