import * as React from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, signInWithGoogle, logOut } from '../services/firebase';

const { createContext, useContext, useEffect, useState } = React;

// Type for the auth context
interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    signIn: () => Promise<User | undefined>;
    signOut: () => Promise<void>;
}

// Creating the auth context
const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    loading: true,
    signIn: async () => {
        throw new Error('AuthContext not yet initialized');
    },
    signOut: async () => {
        throw new Error('AuthContext not yet initialized');
    },
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Sign in with Google
    const signIn = async () => {
        try {
            const user = await signInWithGoogle();
            return user;
        } catch (error) {
            console.error('Error signing in:', error);
            return undefined;
        }
    };

    // Sign out
    const signOut = async () => {
        try {
            await logOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const value = {
        currentUser,
        loading,
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
