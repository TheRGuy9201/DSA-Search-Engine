import axios from 'axios';

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  photoURL?: string;
  id: string;
  verified_email?: boolean;
  given_name?: string;
  family_name?: string;
  leetcodeId?: string;
  codeforcesId?: string;
  institution?: string;
  linkedIn?: string;
}

/**
 * Exchange Google OAuth token for user profile information
 * @param accessToken Access token from Google OAuth
 * @returns User profile information
 */
export const getGoogleUserInfo = async (accessToken: string): Promise<GoogleUser> => {
  try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    const userData = response.data;
    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      verified_email: userData.verified_email,
      given_name: userData.given_name,
      family_name: userData.family_name
    };
  } catch (error) {
    console.error('Error fetching Google user info:', error);
    throw new Error('Failed to fetch user information from Google');
  }
};

/**
 * Store user information in local storage
 * @param user User profile information
 */
export const storeUserSession = (user: GoogleUser): void => {
  localStorage.setItem('dsa_user', JSON.stringify(user));
};

/**
 * Get stored user information from local storage
 * @returns User profile information or null if not found
 */
export const getStoredUser = (): GoogleUser | null => {
  const storedUser = localStorage.getItem('dsa_user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }
  return null;
};

/**
 * Clear user information from local storage
 */
export const clearUserSession = (): void => {
  localStorage.removeItem('dsa_user');
};
