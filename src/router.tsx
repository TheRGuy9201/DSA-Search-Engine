import { createBrowserRouter, Navigate, useNavigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from './App';

// Use dynamic imports for code-splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomepageWrapper />,
      },
      {
        path: 'search',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SearchPage />
          </Suspense>
        ),
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
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AlgorithmDetailPage />
          </Suspense>
        ),
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
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PlatformPage platform="" onBackClick={() => { }} />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;
