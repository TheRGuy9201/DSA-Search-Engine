import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeOffIcon } from '../components/icons/EyeIcons';

type AuthMode = 'signin' | 'signup';

interface FormField {
  type: string;
  value: string;
  placeholder: string;
  name: string;
  label: string;
  showPassword?: boolean;
  autoComplete?: string;
  isValid: boolean;
  errorMessage?: string;
  touched: boolean; // Add touched state to track field interaction
}

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, signIn, loading: authLoading, error: authError } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [, setIsFormDirty] = useState(false);
    // Redirect if user is already logged in
  useEffect(() => {
    // Check if we have a current user in context or in localStorage
    const isLoggedIn = currentUser || localStorage.getItem('dsa_user');
    
    if (isLoggedIn) {
      console.log('User already logged in, redirecting to home page');
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);
    // Field states with validation
  const [fields, setFields] = useState<Record<string, FormField>>({
    username: {
      type: 'text',
      value: '',
      placeholder: 'Username',
      name: 'username',
      label: 'Username',
      autoComplete: 'username',
      isValid: true,
      touched: false
    },
    email: {
      type: 'email',
      value: '',
      placeholder: 'Email address',
      name: 'email',
      label: 'Email address',
      autoComplete: 'email',
      isValid: true,
      touched: false
    },
    password: {
      type: 'password',
      value: '',
      placeholder: 'Password',
      name: 'password',
      label: 'Password',
      showPassword: false,
      autoComplete: mode === 'signin' ? 'current-password' : 'new-password',
      isValid: true,
      touched: false
    },
    confirmPassword: {
      type: 'password',
      value: '',
      placeholder: 'Confirm password',
      name: 'confirmPassword',
      label: 'Confirm password',
      showPassword: false,
      autoComplete: 'new-password',
      isValid: true,
      touched: false
    },
    leetcodeId: {
      type: 'text',
      value: '',
      placeholder: 'LeetCode Username (optional)',
      name: 'leetcodeId',
      label: 'LeetCode Username',
      isValid: true,
      touched: false
    },
    codeforcesId: {
      type: 'text',
      value: '',
      placeholder: 'CodeForces Username (optional)',
      name: 'codeforcesId',
      label: 'CodeForces Username',
      isValid: true,
      touched: false
    }
  });

  // Reset form when switching modes
  useEffect(() => {
    // Update autocomplete for password when mode changes
    setFields(prev => ({
      ...prev,
      password: {
        ...prev.password,
        autoComplete: mode === 'signin' ? 'current-password' : 'new-password'
      }
    }));
    
    setError('');
    setSuccessMessage('');
    setIsFormDirty(false);
  }, [mode]);

  // Handle auth errors from context
  useEffect(() => {
    if (authError) {
      setError(authError);
      setIsLoading(false);
    }
  }, [authError]);

  // Validate a single field and return the updated field
  const validateField = (name: string, value: string, allFields: Record<string, FormField>): FormField => {
    const field = { ...allFields[name] };

    switch (name) {
      case 'email':
        if (!value) {
          field.isValid = false;
          field.errorMessage = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          field.isValid = false;
          field.errorMessage = 'Please enter a valid email address';
        } else {
          field.isValid = true;
          field.errorMessage = undefined;
        }
        break;

      case 'password':
        if (!value) {
          field.isValid = false;
          field.errorMessage = 'Password is required';
        } else if (value.length < 6) {
          field.isValid = false;
          field.errorMessage = 'Password must be at least 6 characters';
        } else {
          field.isValid = true;
          field.errorMessage = undefined;
        }
        
        // Also validate confirmPassword if it's touched and we're in signup mode
        if (mode === 'signup' && allFields.confirmPassword.touched && allFields.confirmPassword.value) {
          const confirmField = { ...allFields.confirmPassword };
          if (value !== confirmField.value) {
            confirmField.isValid = false;
            confirmField.errorMessage = 'Passwords do not match';
          } else {
            confirmField.isValid = true;
            confirmField.errorMessage = undefined;
          }
          allFields.confirmPassword = confirmField;
        }
        break;

      case 'username':
        if (mode === 'signup') {
          if (!value) {
            field.isValid = false;
            field.errorMessage = 'Username is required';
          } else if (value.length < 3) {
            field.isValid = false;
            field.errorMessage = 'Username must be at least 3 characters';
          } else {
            field.isValid = true;
            field.errorMessage = undefined;
          }
        }
        break;

      case 'confirmPassword':
        if (mode === 'signup') {
          if (value !== allFields.password.value) {
            field.isValid = false;
            field.errorMessage = 'Passwords do not match';
          } else {
            field.isValid = true;
            field.errorMessage = undefined;
          }
        }
        break;

      default:
        break;
    }

    return field;
  };

  // Handle input changes with real-time validation
  const handleInputChange = (name: string, value: string) => {
    const updatedFields = { ...fields };
    
    // Mark field as touched
    updatedFields[name] = {
      ...updatedFields[name],
      value,
      touched: true
    };
    
    // Validate the field in real time
    updatedFields[name] = validateField(name, value, updatedFields);
    
    // Special case for password and confirmPassword relationship
    if (name === 'password' && mode === 'signup' && updatedFields.confirmPassword.touched) {
      updatedFields.confirmPassword = validateField('confirmPassword', updatedFields.confirmPassword.value, updatedFields);
    }
    
    setFields(updatedFields);
    setError('');
    setIsFormDirty(true);
  };

  // Handle field blur for validation
  const handleBlur = (name: string) => {
    const updatedFields = { ...fields };
    updatedFields[name] = {
      ...updatedFields[name],
      touched: true
    };
    
    // Validate on blur
    updatedFields[name] = validateField(name, updatedFields[name].value, updatedFields);
    setFields(updatedFields);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (fieldName: 'password' | 'confirmPassword') => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        showPassword: !prev[fieldName].showPassword,
        type: prev[fieldName].showPassword ? 'password' : 'text'
      }
    }));
  };

  // Validate all fields
  const validateForm = () => {
    let isValid = true;
    const updatedFields = { ...fields };

    // Mark all fields as touched
    Object.keys(updatedFields).forEach(key => {
      updatedFields[key] = {
        ...updatedFields[key],
        touched: true
      };
        // Skip validation for fields not used in current mode
      if (mode === 'signin' && (key === 'username' || key === 'confirmPassword' || key === 'leetcodeId' || key === 'codeforcesId')) {
        return;
      }
      
      const validatedField = validateField(key, updatedFields[key].value, updatedFields);
      updatedFields[key] = validatedField;
      
      if (!validatedField.isValid) {
        isValid = false;
      }
    });

    setFields(updatedFields);
    return isValid;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (isLoading || authLoading) return;
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // If we're in signup mode, save platform IDs
      if (mode === 'signup') {
        // Save platform IDs to localStorage for future use in settings
        const platformData = {
          leetcodeId: fields.leetcodeId.value,
          codeforcesId: fields.codeforcesId.value
        };
        localStorage.setItem('platform_ids', JSON.stringify(platformData));
      }
      
      // Use Google auth for authentication
      await handleGoogleSignIn();
      
      // For future implementation with email/password
      // if (mode === 'signup') {
      //   // Handle sign up
      //   setSuccessMessage('Account created successfully! You can now sign in.');
      //   setMode('signin');
      // } else {
      //   // Handle sign in
      //   navigate('/');
      // }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };  const handleGoogleSignIn = async () => {
    try {
      const user = await signIn();
      
      // Only navigate if we successfully got a user
      if (user && user.email) {
        console.log('Successfully signed in, redirecting to home page');
        navigate('/', { replace: true });
      } else {
        throw new Error('User information is incomplete');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw new Error('Failed to sign in with Google. Please try again.');
    }
  };

  const switchMode = () => {
    // Reset fields when switching modes
    const resetFields = { ...fields };
    Object.keys(resetFields).forEach(key => {
      resetFields[key as keyof typeof resetFields].value = '';
      resetFields[key as keyof typeof resetFields].isValid = true;
      resetFields[key as keyof typeof resetFields].errorMessage = undefined;
      resetFields[key as keyof typeof resetFields].touched = false;
      
      if (resetFields[key as keyof typeof resetFields].showPassword) {
        resetFields[key as keyof typeof resetFields].showPassword = false;
        resetFields[key as keyof typeof resetFields].type = 'password';
      }
    });
    
    setFields(resetFields);
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
    setSuccessMessage('');
    setIsFormDirty(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 py-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 transition-all">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-300 to-blue-400 bg-clip-text text-transparent">
            {mode === 'signin' ? 'Welcome back!' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={switchMode}
              className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 py-2 px-4 rounded-lg border border-red-500/20 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="text-green-400 text-sm bg-green-500/10 py-2 px-4 rounded-lg border border-green-500/20 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* Username field - only show for signup */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete={fields.username.autoComplete}
                    required
                    value={fields.username.value}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    onBlur={() => handleBlur('username')}
                    className={`appearance-none rounded-lg w-full pl-4 pr-10 py-3 bg-slate-700/50 border ${
                      !fields.username.isValid && fields.username.touched ? 'border-red-500' : 'border-slate-600'
                    } placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                    placeholder="Username"
                  />
                  {!fields.username.isValid && fields.username.touched && fields.username.errorMessage && (
                    <p className="mt-1 text-xs text-red-400">{fields.username.errorMessage}</p>
                  )}
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete={fields.email.autoComplete}
                  required
                  value={fields.email.value}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`appearance-none rounded-lg w-full pl-4 pr-10 py-3 bg-slate-700/50 border ${
                    !fields.email.isValid && fields.email.touched ? 'border-red-500' : 'border-slate-600'
                  } placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  placeholder="Email address"
                />
                {!fields.email.isValid && fields.email.touched && fields.email.errorMessage && (
                  <p className="mt-1 text-xs text-red-400">{fields.email.errorMessage}</p>
                )}
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={fields.password.type}
                  autoComplete={fields.password.autoComplete}
                  required
                  value={fields.password.value}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`appearance-none rounded-lg w-full pl-4 pr-10 py-3 bg-slate-700/50 border ${
                    !fields.password.isValid && fields.password.touched ? 'border-red-500' : 'border-slate-600'
                  } placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  onClick={() => togglePasswordVisibility('password')}
                >
                  {fields.password.showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
                {!fields.password.isValid && fields.password.touched && fields.password.errorMessage && (
                  <p className="mt-1 text-xs text-red-400">{fields.password.errorMessage}</p>
                )}
              </div>
            </div>            {/* Confirm password field - only show for signup */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm password</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={fields.confirmPassword.type}
                    autoComplete={fields.confirmPassword.autoComplete}
                    required
                    value={fields.confirmPassword.value}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    className={`appearance-none rounded-lg w-full pl-4 pr-10 py-3 bg-slate-700/50 border ${
                      !fields.confirmPassword.isValid && fields.confirmPassword.touched ? 'border-red-500' : 'border-slate-600'
                    } placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                  >
                    {fields.confirmPassword.showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {!fields.confirmPassword.isValid && fields.confirmPassword.touched && fields.confirmPassword.errorMessage && (
                  <p className="mt-1 text-xs text-red-400">{fields.confirmPassword.errorMessage}</p>
                )}
              </div>
            )}
            
            {/* Platform IDs - only show for signup */}
            {mode === 'signup' && (
              <>
                <div className="pt-3 pb-1">
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-800/50 text-gray-400">Platform Integrations</span>
                  </div>
                </div>
                
                {/* LeetCode ID field */}
                <div>
                  <label htmlFor="leetcodeId" className="sr-only">LeetCode Username</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center pointer-events-none">
                      <img src="https://leetcode.com/static/images/LeetCode_logo.png" alt="LeetCode" className="h-5 w-5" />
                    </div>
                    <input
                      id="leetcodeId"
                      name="leetcodeId"
                      type="text"
                      value={fields.leetcodeId.value}
                      onChange={(e) => handleInputChange('leetcodeId', e.target.value)}
                      className="appearance-none rounded-lg w-full pl-11 pr-3 py-3 bg-slate-700/50 border border-slate-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="LeetCode Username (optional)"
                    />
                  </div>
                  {!fields.leetcodeId.value && (
                    <a 
                      href="https://leetcode.com/accounts/signup/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-1 text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Create a LeetCode account
                    </a>
                  )}
                </div>
                
                {/* CodeForces ID field */}
                <div>
                  <label htmlFor="codeforcesId" className="sr-only">CodeForces Username</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center pointer-events-none">
                      <img src="https://codeforces.org/s/0/favicon-32x32.png" alt="CodeForces" className="h-5 w-5" />
                    </div>
                    <input
                      id="codeforcesId"
                      name="codeforcesId"
                      type="text"
                      value={fields.codeforcesId.value}
                      onChange={(e) => handleInputChange('codeforcesId', e.target.value)}
                      className="appearance-none rounded-lg w-full pl-11 pr-3 py-3 bg-slate-700/50 border border-slate-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="CodeForces Username (optional)"
                    />
                  </div>
                  {!fields.codeforcesId.value && (
                    <a 
                      href="https://codeforces.com/register" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-1 text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Create a CodeForces account
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Remember me & forgot password row */}
          {mode === 'signin' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button type="button" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot your password?
                </button>
              </div>
            </div>
          )}

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || authLoading}
              className={`group relative w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
                isLoading || authLoading
                  ? 'bg-indigo-600/50 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {(isLoading || authLoading) ? (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <div className="h-5 w-5 border-2 border-white/20 border-t-white/100 rounded-full animate-spin" />
                  </span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {mode === 'signin' ? 'Sign in' : 'Create account'}
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800/50 text-gray-400">Or continue with</span>
            </div>
          </div>          {/* Google sign in button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || authLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-slate-600 bg-slate-700/30 text-white hover:bg-slate-700/50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {isLoading || authLoading ? 'Connecting...' : 'Continue with Google'}
            </button>
          </div>

          {/* Terms and conditions */}
          <div className="text-xs text-center text-gray-500">
            By continuing, you agree to our 
            <button type="button" className="mx-1 text-indigo-400 hover:text-indigo-300 transition-colors">Terms of Service</button>
            and
            <button type="button" className="ml-1 text-indigo-400 hover:text-indigo-300 transition-colors">Privacy Policy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
