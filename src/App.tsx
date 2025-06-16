import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import ProblemsetPage from './pages/ProblemsetPage';
import SearchPage from './pages/SearchPage';
import MorePage from './pages/MorePage';
import PlatformPage from './pages/PlatformPage';
import { MenuIcon } from './components/icons/Icons';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [currentPlatform, setCurrentPlatform] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Listen to scroll events for the app
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Function to handle platform selection
  const handlePlatformSelection = (platform: string) => {
    setCurrentPlatform(platform);
    setCurrentPage('platform');
  };

  // Function to handle back button click - always go to home
  const handleBackClick = () => {
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPlatformSelect={handlePlatformSelection} />;
      case 'settings':
        return <SettingsPage />;
      case 'problemset':
        return <ProblemsetPage />;
      case 'search':
        return <SearchPage />;
      case 'more':
        return <MorePage />;
      case 'platform':
        return <PlatformPage platform={currentPlatform || ''} onBackClick={handleBackClick} />;
      default:
        return <HomePage onPlatformSelect={handlePlatformSelection} />;
    }
  };

  // Overlay for when sidebar is open
  const sidebarOverlay = isSidebarOpen ? (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={toggleSidebar}
    ></div>
  ) : null;

  return (
    <div className="relative smooth-scroll">
      {/* Hamburger Menu Button */}
      <button
        className={`fixed top-4 left-4 z-50 p-3 rounded-full transition-all duration-300 ${isScrolled ? 'glass-effect' : 'bg-transparent'
          } hover:bg-indigo-600`}
        onClick={toggleSidebar}
        aria-label="Menu"
      >
        <MenuIcon />
      </button>

      {sidebarOverlay}

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        setCurrentPage={setCurrentPage}
      />

      {/* Main Content */}
      <main className="min-h-screen">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
