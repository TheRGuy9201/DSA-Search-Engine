import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { GoogleUser } from '../services/googleAuthService';

const GoogleSignIn: React.FC = () => {
  const { currentUser, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleAuth = async () => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    try {
      setIsSigningOut(true);
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const getDisplayName = (user: GoogleUser) => {
    if (user.name) return user.name;
    if (user.given_name) return user.given_name;
    return user.email.split('@')[0];
  };

  if (loading) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-5 py-1.5 rounded-full glass-effect text-white/80 transition-all duration-300 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
      >
        <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-indigo-200 animate-spin"></div>
        <span className="text-sm">Loading...</span>
      </button>
    );
  }

  if (currentUser) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-full glass-effect border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300">
        {currentUser.picture && (
          <img
            src={currentUser.picture}
            alt={getDisplayName(currentUser)}
            className="w-7 h-7 rounded-full border-2 border-indigo-300/50 hover:border-indigo-300/70 transition-colors"
          />
        )}
        <div className="flex flex-col pr-2">
          <span className="text-xs text-white/80 font-medium">
            {getDisplayName(currentUser)}
          </span>
          <button
            onClick={handleAuth}
            disabled={isSigningOut}
            className="text-xs bg-gradient-to-r from-indigo-200 to-blue-100 bg-clip-text text-transparent hover:from-indigo-100 hover:to-white transition-all duration-300 text-left"
          >
            {isSigningOut ? (
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full border-2 border-t-transparent border-current animate-spin"></div>
                Signing out...
              </span>
            ) : (
              'Sign out'
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleAuth}
      className="flex items-center gap-2 px-5 py-1.5 rounded-full glass-effect text-white/80 hover:text-white transition-all duration-300 border border-white/20 hover:border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      <span className="text-sm">Sign in</span>
    </button>
  );
};

export default GoogleSignIn;
