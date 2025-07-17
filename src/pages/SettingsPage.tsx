import React, { useState, useEffect, useRef } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useProblemStats } from '../hooks/useProblemStats';
// We're importing and using ActivityData and defaultActivityData through useProblemStats hook now

// Required field indicator component
const RequiredField: React.FC = () => (
  <span className="text-red-500 ml-1">*</span>
);

const SettingsPage: React.FC = () => {
  const { 
    profile, 
    saveProfile, 
    leetcodeId, 
    codeforcesId 
  } = useUserProfile();
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [syncError, setSyncError] = useState('');
  
  const handleSyncSubmissions = async () => {
    if (!profile.leetcodeId && !profile.codeforcesId) {
      setSyncError('Please enter your LeetCode and/or CodeForces usernames first');
      return;
    }
    
    setIsSyncing(true);
    setSyncError('');
    
    try {
      // Clear the API cache first
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith('leetcode-') || 
          key.startsWith('codeforces-') || 
          key.startsWith('all-solved:')
        )) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Force refresh the stats
      await refreshStats();
      
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 5000);
    } catch (error) {
      console.error('Sync error:', error);
      setSyncError('Failed to sync submissions. Please try again.');
      setTimeout(() => setSyncError(''), 5000);
    } finally {
      setIsSyncing(false);
    }
  };
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use our problem stats hook to get combined stats
  const { 
    activityData, 
    problemStats, 
    isLoading: isLoadingStats, 
    refreshStats 
  } = useProblemStats(leetcodeId, codeforcesId);

  // Load profile data and set up initial state
  useEffect(() => {
    if (profile.profileImage) {
      setImagePreview(profile.profileImage);
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    saveProfile({ [name]: value });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleToggle = (name: 'darkMode' | 'emailNotifications') => {
    saveProfile({ [name]: !profile[name] });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setImagePreview(base64Image);
        saveProfile({ profileImage: base64Image });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!profile.firstName) newErrors.firstName = 'First name is required';
    if (!profile.lastName) newErrors.lastName = 'Last name is required';
    if (!profile.institution) newErrors.institution = 'Institution is required';
    if (!profile.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Profile is already saved via the saveProfile function
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Refresh platform stats if platform IDs changed
      refreshStats();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Function to create activity chart bars
  const renderActivityChart = () => {
    const { lastWeek } = activityData;
    const maxValue = Math.max(...lastWeek, 1); // Ensure we don't divide by zero
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return (
      <div className="flex items-end justify-between h-32 gap-1">
        {lastWeek.map((value: number, index: number) => {
          const height = value === 0 ? '4px' : `${(value / maxValue) * 100}%`;
          const isToday = index === lastWeek.length - 1;
          
          return (
            <div key={index} className="flex flex-col items-center w-full">
              <div 
                className={`w-full rounded-t-sm ${isToday ? 'bg-indigo-500' : 'bg-indigo-600'}`} 
                style={{ height }}
                title={`${value} problems`}
              ></div>
              <div className="text-xs mt-2 text-gray-400">{days[index]}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="page-transition min-h-screen flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
        Profile Settings
      </h1>
      
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Profile and Platform Links */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile picture upload */}
          <div className="glass-effect p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Profile Picture</h3>
            <div className="flex flex-col items-center">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
              
              <div 
                className="w-32 h-32 rounded-full mb-4 bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-indigo-500 cursor-pointer hover:opacity-90 transition-all"
                onClick={triggerFileInput}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                )}
              </div>
              
              <button 
                className="text-sm text-indigo-400 hover:text-indigo-300"
                onClick={triggerFileInput}
              >
                Change picture
              </button>
            </div>
          </div>
          
          {/* Personal information */}
          <div className="glass-effect p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  First Name <RequiredField />
                </label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={profile.firstName} 
                  onChange={handleInputChange}
                  className={`w-full bg-gray-800 rounded-lg px-4 py-2 text-white border ${errors.firstName ? 'border-red-500' : 'border-gray-700'} focus:border-indigo-500 focus:outline-none`} 
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Last Name <RequiredField />
                </label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={profile.lastName} 
                  onChange={handleInputChange}
                  className={`w-full bg-gray-800 rounded-lg px-4 py-2 text-white border ${errors.lastName ? 'border-red-500' : 'border-gray-700'} focus:border-indigo-500 focus:outline-none`} 
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Institution <RequiredField />
                </label>
                <input 
                  type="text" 
                  name="institution" 
                  value={profile.institution} 
                  onChange={handleInputChange}
                  className={`w-full bg-gray-800 rounded-lg px-4 py-2 text-white border ${errors.institution ? 'border-red-500' : 'border-gray-700'} focus:border-indigo-500 focus:outline-none`} 
                />
                {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Email <RequiredField />
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={profile.email} 
                  onChange={handleInputChange}
                  className={`w-full bg-gray-800 rounded-lg px-4 py-2 text-white border ${errors.email ? 'border-red-500' : 'border-gray-700'} focus:border-indigo-500 focus:outline-none`} 
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>
          
          {/* Platform links */}
          <div className="glass-effect p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Platform Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  <div className="flex items-center">
                    <img src="https://leetcode.com/static/images/LeetCode_logo.png" alt="LeetCode" className="h-4 w-4 mr-1" />
                    LeetCode Username
                  </div>
                </label>
                <input 
                  type="text" 
                  name="leetcodeId" 
                  value={profile.leetcodeId} 
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none" 
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  <div className="flex items-center">
                    <img src="https://codeforces.org/s/0/favicon-32x32.png" alt="CodeForces" className="h-4 w-4 mr-1" />
                    CodeForces Handle
                  </div>
                </label>
                <input 
                  type="text" 
                  name="codeforcesId" 
                  value={profile.codeforcesId} 
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none" 
                />
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <div className="flex flex-col space-y-3">
                  <button 
                    onClick={handleSyncSubmissions}
                    disabled={isSyncing || (!profile.leetcodeId && !profile.codeforcesId)}
                    className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center gap-2 ${
                      isSyncing 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isSyncing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        Syncing Submissions...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Sync Submissions
                      </>
                    )}
                  </button>
                  
                  {syncSuccess && (
                    <div className="text-green-400 text-sm flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Submissions synced successfully! Navigate to problemset to see updated status.
                    </div>
                  )}
                  
                  {syncError && (
                    <div className="text-red-400 text-sm flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {syncError}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-400">
                    Real-time sync your latest submissions from LeetCode and CodeForces. 
                    This will clear cache and fetch the most recent data.
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-blue-400 mr-1" viewBox="0 0 16 16">
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                    </svg>
                    LinkedIn
                  </div>
                </label>
                <input 
                  type="text" 
                  name="linkedin" 
                  value={profile.linkedin} 
                  onChange={handleInputChange}
                  placeholder="username"
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none" 
                />
                <div className="text-xs text-gray-500 mt-1">linkedin.com/in/username</div>
              </div>
            </div>
          </div>
          
          {/* Preferences */}
          <div className="glass-effect p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-300 text-sm inline-flex items-center">
                  <span>Dark Mode</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={profile.darkMode}
                    onChange={() => handleToggle('darkMode')}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-gray-300 text-sm inline-flex items-center">
                  <span>Email Notifications</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={profile.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Save button */}
          <div className="flex items-center justify-between">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`px-8 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSaving && (
                <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
              )}
              Save Changes
            </button>
            
            {saveSuccess && (
              <span className="text-green-400 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Changes saved successfully
              </span>
            )}
          </div>
        </div>
        
        {/* Right column - Stats and activity */}
        <div className="lg:col-span-1 space-y-8">
          {/* Activity tracker */}
          <div className="glass-effect p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Activity</h3>
            
            {/* Current streak */}
            <div className="mb-8">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Current streak</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-indigo-400">{activityData.streak}</span>
                <span className="text-sm text-gray-400">days</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full mt-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full" 
                  style={{ width: `${Math.min(activityData.streak * 10, 100)}%` }} 
                ></div>
              </div>
            </div>
            
            {/* Weekly activity */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Last 7 days activity</h4>
              {renderActivityChart()}
            </div>
          </div>
          
          {/* Platform stats */}
          <div className="glass-effect p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Platform Statistics</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-2">
                  <img src="https://leetcode.com/static/images/LeetCode_logo.png" alt="LeetCode" className="h-5 w-5 mr-2" />
                  <h4 className="text-sm font-medium text-gray-300">
                    LeetCode problems {isLoadingStats && profile.leetcodeId && <span className="text-xs text-gray-400">(loading...)</span>}
                  </h4>
                </div>
                {problemStats.leetcode.error && profile.leetcodeId ? (
                  <div className="text-xs text-orange-400">
                    Error: {problemStats.leetcode.error}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-white">{activityData.totalSolved.leetcode}</span>
                      <span className="text-xs text-gray-400">problems solved</span>
                    </div>
                    {problemStats.leetcode.success && (
                      <div className="flex gap-3 mt-2 text-xs">
                        <span className="text-green-400">Easy: {problemStats.leetcode.easy}</span>
                        <span className="text-yellow-400">Medium: {problemStats.leetcode.medium}</span>
                        <span className="text-red-400">Hard: {problemStats.leetcode.hard}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <img src="https://codeforces.org/s/0/favicon-32x32.png" alt="CodeForces" className="h-5 w-5 mr-2" />
                  <h4 className="text-sm font-medium text-gray-300">
                    CodeForces problems {isLoadingStats && profile.codeforcesId && <span className="text-xs text-gray-400">(loading...)</span>}
                  </h4>
                </div>
                {problemStats.codeforces.error && profile.codeforcesId ? (
                  <div className="text-xs text-orange-400">
                    Error: {problemStats.codeforces.error}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-white">{activityData.totalSolved.codeforces}</span>
                      <span className="text-xs text-gray-400">problems solved</span>
                    </div>
                    {problemStats.codeforces.success && problemStats.codeforces.rating && (
                      <div className="flex gap-2 mt-2 text-xs items-center">
                        <span className="text-gray-300">Rating:</span>
                        <span className="text-yellow-400 font-medium">{problemStats.codeforces.rating}</span>
                        {problemStats.codeforces.rank && (
                          <span className="bg-gray-800 px-2 py-0.5 rounded text-gray-300">{problemStats.codeforces.rank}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <h4 className="text-sm font-medium text-gray-300">
                    Platform problems
                  </h4>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-white">{activityData.totalSolved.platform}</span>
                  <span className="text-xs text-gray-400">problems solved</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-700/50">
                <div className="flex items-center justify-between mb-2 mt-2">
                  <span className="text-sm font-medium text-gray-300">Total problems solved</span>
                  <span className="text-xl font-bold text-indigo-400">
                    {activityData.totalSolved.total}
                  </span>
                </div>
                {!profile.leetcodeId && !profile.codeforcesId && (
                  <div className="text-xs text-gray-400 mt-2">
                    Add your LeetCode and CodeForces usernames in the Profile section to see your problem-solving statistics.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
