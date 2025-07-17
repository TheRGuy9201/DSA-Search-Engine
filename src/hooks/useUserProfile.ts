import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
  firstName: string;
  lastName: string;
  institution: string;
  email: string;
  profileImage: string | null;
  leetcodeId: string;
  codeforcesId: string;
  linkedin: string;
  darkMode: boolean;
  emailNotifications: boolean;
}

const defaultProfile: UserProfile = {
  firstName: '',
  lastName: '',
  institution: '',
  email: '',
  profileImage: null,
  leetcodeId: '',
  codeforcesId: '',
  linkedin: '',
  darkMode: true,
  emailNotifications: false
};

/**
 * Custom hook to get the user profile data including platform IDs
 * This combines Google auth data with locally stored profile settings
 */
export const useUserProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = () => {
      setIsLoading(true);
      
      try {
        // Start with default profile
        let loadedProfile = { ...defaultProfile };
        
        // Load saved profile from localStorage
        const savedProfile = localStorage.getItem('user_profile');
        if (savedProfile) {
          try {
            const parsedProfile = JSON.parse(savedProfile);
            loadedProfile = { ...loadedProfile, ...parsedProfile };
          } catch (e) {
            console.error('Error parsing saved profile:', e);
          }
        }
        
        // Override with Google auth data if available
        if (currentUser) {
          loadedProfile.email = currentUser.email || loadedProfile.email;
          
          // Use Google profile data if not set locally
          if (!loadedProfile.firstName && currentUser.given_name) {
            loadedProfile.firstName = currentUser.given_name;
          }
          if (!loadedProfile.lastName && currentUser.family_name) {
            loadedProfile.lastName = currentUser.family_name;
          }
        }
        
        setProfile(loadedProfile);
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [currentUser]);

  // Function to save profile updates
  const saveProfile = (updates: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    
    try {
      localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return {
    profile,
    isLoading,
    saveProfile,
    // Quick access to commonly used fields
    leetcodeId: profile.leetcodeId,
    codeforcesId: profile.codeforcesId,
    hasLeetcodeId: !!profile.leetcodeId,
    hasCodeforcesId: !!profile.codeforcesId,
    hasPlatformIds: !!(profile.leetcodeId || profile.codeforcesId)
  };
};
