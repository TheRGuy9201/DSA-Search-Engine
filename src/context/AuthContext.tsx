import * as React from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import type { TokenResponse } from '@react-oauth/google';
import { getGoogleUserInfo, storeUserSession, getStoredUser, clearUserSession } from '../services/googleAuthService';
import type { GoogleUser } from '../services/googleAuthService';

const { createContext, useContext, useState, useEffect } = React;

interface AuthContextType {
  currentUser: GoogleUser | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<GoogleUser>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  error: null,
  signIn: async () => {
    throw new Error('AuthContext not yet initialized');
  },
  signOut: async () => {
    throw new Error('AuthContext not yet initialized');
  },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for stored user on component mount
  useEffect(() => {
    const checkStoredUser = () => {
      try {
        const storedUser = getStoredUser();
        if (storedUser) {
          setCurrentUser(storedUser);
        }
      } catch (err) {
        console.error('Error retrieving stored user:', err);
        setError('Failed to retrieve user session');
      } finally {
        setLoading(false);
      }
    };

    checkStoredUser();
  }, []);

  // Configure Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      try {
        setLoading(true);
        setError(null);
        
        // Get user info using the access token
        const userInfo = await getGoogleUserInfo(tokenResponse.access_token);
        
        // Store user info in local storage
        storeUserSession(userInfo);
        
        // Update state with the user info
        setCurrentUser(userInfo);
        
        // Dispatch an event that authentication is complete
        window.dispatchEvent(new CustomEvent('auth_completed', { detail: { success: true, user: userInfo } }));
      } catch (err) {
        console.error('Error processing Google login:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google';
        setError(errorMessage);
        window.dispatchEvent(new CustomEvent('auth_completed', { detail: { success: false, error: errorMessage } }));
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('Google login error:', errorResponse);
      const errorMessage = 'Google sign-in failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
      window.dispatchEvent(new CustomEvent('auth_completed', { detail: { success: false, error: errorMessage } }));
    }
  });

  const signIn = async (): Promise<GoogleUser> => {
    try {
      setLoading(true);
      setError(null);
      
      return new Promise<GoogleUser>((resolve, reject) => {
        // Set up listener for auth completion before initiating login
        const authCompletedListener = (event: CustomEvent) => {
          if (event.detail.success) {
            resolve(event.detail.user);
          } else {
            reject(new Error(event.detail.error || 'Authentication failed'));
          }
          // Remove the listener after it's triggered
          window.removeEventListener('auth_completed' as any, authCompletedListener as EventListener);
        };
        
        // Add listener for auth completion event
        window.addEventListener('auth_completed' as any, authCompletedListener as EventListener);
        
        // Start the Google login flow after setting up the listener
        googleLogin();
        
        // Set a timeout to clean up if auth never completes
        setTimeout(() => {
          window.removeEventListener('auth_completed' as any, authCompletedListener as EventListener);
          reject(new Error('Sign-in timed out. Please try again.'));
        }, 30000); // 30 seconds timeout
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      // Sign out from Google OAuth
      googleLogout();
      // Clear local storage
      clearUserSession();
      // Update state
      setCurrentUser(null);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
