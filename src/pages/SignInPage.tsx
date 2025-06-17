import React, { useState, useEffect, useRef } from 'react';
import { signInWithGoogle, signInWithEmail, createUserWithEmail, resetPassword } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from '../components/icons/EyeIcons';

type PageMode = 'signin' | 'signup' | 'reset';

const SignInPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mode, setMode] = useState<PageMode>('signin');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [googleUsername, setGoogleUsername] = useState('');
    const [showUsernamePrompt, setShowUsernamePrompt] = useState(false); const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordAutofilled, setIsPasswordAutofilled] = useState(false);
    const [isConfirmPasswordAutofilled, setIsConfirmPasswordAutofilled] = useState(false);

    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);    // Check for autofill using multiple detection methods
    useEffect(() => {
        // This function checks if the input field has been autofilled
        const checkAutofillStatus = () => {
            if (passwordRef.current) {
                // Method 1: Check background color (most reliable)
                const passwordComputed = window.getComputedStyle(passwordRef.current);
                const bgColor = passwordComputed.backgroundColor;
                const normalBgColors = ['rgb(31, 41, 55)', 'rgb(17, 24, 39)', 'rgb(15, 23, 42)', 'transparent', 'rgba(0, 0, 0, 0)'];
                const isBackgroundChanged = !normalBgColors.includes(bgColor);
                // Method 2: Check if value exists even though we haven't set it (useful for initial load)
                const hasValueButNotSet = passwordRef.current.value && password === '';

                setIsPasswordAutofilled(isBackgroundChanged || hasValueButNotSet ? true : false);

                // If autofilled, force the text color to be white
                if (isBackgroundChanged || hasValueButNotSet) {
                    passwordRef.current.style.color = 'white';
                }
            }

            if (confirmPasswordRef.current) {
                const confirmPasswordComputed = window.getComputedStyle(confirmPasswordRef.current);
                const bgColor = confirmPasswordComputed.backgroundColor;
                const normalBgColors = ['rgb(31, 41, 55)', 'rgb(17, 24, 39)', 'rgb(15, 23, 42)', 'transparent', 'rgba(0, 0, 0, 0)'];
                const isBackgroundChanged = !normalBgColors.includes(bgColor);
                const hasValueButNotSet = confirmPasswordRef.current.value && confirmPassword === '';

                setIsConfirmPasswordAutofilled(isBackgroundChanged || hasValueButNotSet ? true : false);

                if (isBackgroundChanged || hasValueButNotSet) {
                    confirmPasswordRef.current.style.color = 'white';
                }
            }
        };

        // Check multiple times to catch autofill which can happen at various times
        checkAutofillStatus(); // Immediate check
        const timeoutIds = [
            setTimeout(checkAutofillStatus, 100),  // Quick check for immediate autofill
            setTimeout(checkAutofillStatus, 500),  // Medium delay
            setTimeout(checkAutofillStatus, 1500)  // Longer delay for slow browsers
        ];

        // Set up event listeners for various events that might indicate autofill
        const events = ['input', 'change', 'animationstart', 'animationend', 'focus'];
        events.forEach(event => {
            if (passwordRef.current) {
                passwordRef.current.addEventListener(event, checkAutofillStatus);
            }
            if (confirmPasswordRef.current) {
                confirmPasswordRef.current.addEventListener(event, checkAutofillStatus);
            }
        });

        // Cleanup function
        return () => {
            timeoutIds.forEach(id => clearTimeout(id));
            events.forEach(event => {
                if (passwordRef.current) {
                    passwordRef.current.removeEventListener(event, checkAutofillStatus);
                }
                if (confirmPasswordRef.current) {
                    confirmPasswordRef.current.removeEventListener(event, checkAutofillStatus);
                }
            });
        };
    }, [password, confirmPassword, setIsPasswordAutofilled, setIsConfirmPasswordAutofilled]);

    const { currentUser } = useAuth();

    // If user is already logged in, redirect to home
    if (currentUser) {
        return <Navigate to="/" />;
    }

    const handleGoogleSignIn = async () => {
        setError(null);
        setLoading(true);
        try {
            // If we're showing the username prompt, use the entered username
            if (showUsernamePrompt) {
                if (!googleUsername.trim()) {
                    throw new Error('Username is required');
                }
                await signInWithGoogle(googleUsername);
                setShowUsernamePrompt(false);
            } else {
                // Regular sign in first
                await signInWithGoogle();
            }
            // Redirect is handled by the auth context
        } catch (error: any) {
            setError(error.message || 'An error occurred during Google sign in');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (mode === 'signin') {
                await signInWithEmail(email, password);
                // Redirect is handled by the auth context
            } else if (mode === 'signup') {
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                if (!username.trim()) {
                    throw new Error('Username is required');
                }
                await createUserWithEmail(email, password, username);
                // Redirect is handled by the auth context
            } else if (mode === 'reset') {
                await resetPassword(email);
                setMessage('Password reset email sent. Check your inbox.');
                setMode('signin');
            }
        } catch (error: any) {
            setError(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="glass-effect w-full max-w-md p-8 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent text-center">
                    {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/40 border border-red-500/50 text-red-300 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-4 p-3 bg-green-900/40 border border-green-500/50 text-green-300 text-sm rounded-lg">
                        {message}
                    </div>
                )}

                {/* Username Prompt for Google Sign In (conditional) */}
                {showUsernamePrompt ? (
                    <div className="mb-6">
                        <div className="mb-4">
                            <label htmlFor="googleUsername" className="block text-sm font-medium text-gray-300 mb-1">Choose a Username</label>
                            <input
                                type="text"
                                id="googleUsername"
                                value={googleUsername}
                                onChange={(e) => setGoogleUsername(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none"
                                required
                                placeholder="Enter your preferred username"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                            >
                                {loading ? 'Processing...' : 'Continue'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowUsernamePrompt(false)}
                                disabled={loading}
                                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setShowUsernamePrompt(true)}
                        disabled={loading}
                        className="w-full mb-6 flex items-center justify-center gap-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span className="font-medium">{mode === 'signin' ? 'Sign in with Google' : mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}</span>
                    </button>
                )}

                <div className="flex items-center my-4">
                    <div className="flex-grow h-px bg-gray-700"></div>
                    <span className="px-3 text-gray-400 text-sm">OR</span>
                    <div className="flex-grow h-px bg-gray-700"></div>
                </div>

                <form onSubmit={handleEmailSignIn}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none"
                            required
                        />
                    </div>                    {mode !== 'reset' && (
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:outline-none pr-10"
                                    required
                                    ref={passwordRef}
                                    onAnimationStart={() => setIsPasswordAutofilled(true)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-white hover:text-gray-300 bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ?
                                        <EyeOffIcon isAutofilled={isPasswordAutofilled} /> :
                                        <EyeIcon isAutofilled={isPasswordAutofilled} />}
                                </button>
                            </div>
                        </div>
                    )}

                    {mode === 'signup' && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none"
                                    required
                                />
                            </div>                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:outline-none pr-10"
                                        required
                                        ref={confirmPasswordRef}
                                        onAnimationStart={() => setIsConfirmPasswordAutofilled(true)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-white hover:text-gray-300 bg-transparent"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                    >
                                        {showConfirmPassword ?
                                            <EyeOffIcon isAutofilled={isConfirmPasswordAutofilled} /> :
                                            <EyeIcon isAutofilled={isConfirmPasswordAutofilled} />}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                    >
                        {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    {mode === 'signin' && (
                        <>
                            <button
                                type="button"
                                onClick={() => setMode('reset')}
                                className="text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Forgot Password?
                            </button>
                            <p className="mt-2 text-gray-400">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => setMode('signup')}
                                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                >
                                    Create one
                                </button>
                            </p>
                        </>
                    )}

                    {mode === 'signup' && (
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => setMode('signin')}
                                className="text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Sign in
                            </button>
                        </p>
                    )}

                    {mode === 'reset' && (
                        <button
                            type="button"
                            onClick={() => setMode('signin')}
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            Back to Sign In
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
