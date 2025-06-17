// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    signOut,
    updateProfile
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Uses environment variables from .env.local file
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async (customUsername?: string) => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // If a custom username is provided, update the profile
        if (customUsername && user) {
            // Make sure we set the displayName correctly
            await updateProfile(user, {
                displayName: customUsername
            });

            // Log to make sure the profile update worked
            console.log("Updated user profile:", user.displayName);
        }

        return user;
    } catch (error) {
        console.error("Error signing in with Google", error);
        throw error;
    }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    } catch (error) {
        console.error("Error signing in with email and password", error);
        throw error;
    }
};

// Create a new user with email and password
export const createUserWithEmail = async (email: string, password: string, username: string) => {
    try {
        // First create the user account
        const result = await createUserWithEmailAndPassword(auth, email, password);

        // Then update the profile with the username
        if (result.user) {
            await updateProfile(result.user, {
                displayName: username
            });

            // Send email verification that serves as a welcome email
            await sendEmailVerification(result.user, {
                url: window.location.origin, // Redirect URL after verification
                handleCodeInApp: true,
                // You can customize these settings in the Firebase console
            });
        }

        return result.user;
    } catch (error) {
        console.error("Error creating user with email and password", error);
        throw error;
    }
};

// Reset password
export const resetPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error("Error sending password reset email", error);
        throw error;
    }
};

// Sign out
export const logOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out", error);
        throw error;
    }
};
