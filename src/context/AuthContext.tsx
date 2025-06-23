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
        
        // Store user info in session storage
        storeUserSession(userInfo);
        
        // Update state
        setCurrentUser(userInfo);
      } catch (err) {
        console.error('Error processing Google login:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('Google login error:', errorResponse);
      setError('Google sign-in failed. Please try again.');
      setLoading(false);
    }
  });

  const signIn = async (): Promise<GoogleUser> => {
    try {
      setLoading(true);
      setError(null);
      // This will trigger the Google login flow
      googleLogin();
      // The user will be set in the onSuccess callback
      // We return a promise that will resolve once we have user data
      return new Promise<GoogleUser>((resolve, reject) => {
        const checkInterval = 100; // ms
        const timeoutDuration = 30000; // 30 seconds
        let elapsedTime = 0;
        
        const checkUser = setInterval(() => {
          if (currentUser) {
            clearInterval(checkUser);
            resolve(currentUser);
          }
          
          elapsedTime += checkInterval;
          if (elapsedTime >= timeoutDuration) {
            clearInterval(checkUser);
            reject(new Error('Sign-in timed out. Please try again.'));
          }
          
          if (error) {
            clearInterval(checkUser);
            reject(new Error(error));
          }
        }, checkInterval);
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
