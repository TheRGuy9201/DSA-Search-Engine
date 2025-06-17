import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import { MenuIcon } from './components/icons/Icons';
import GoogleSignIn from './components/GoogleSignIn';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

      {/* Google Sign In Button */}
      <div className="fixed top-4 right-4 z-50">
        <GoogleSignIn />
      </div>

      {sidebarOverlay}

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content - Render the current route */}
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
