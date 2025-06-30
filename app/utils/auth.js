import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from './api';

export const AUTH_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  IS_LOGGED_IN: 'isLoggedIn',
};

export const authUtils = {
  // Store authentication data
  storeAuthData: async (authData) => {
    try {
      await AsyncStorage.multiSet([
        [AUTH_KEYS.AUTH_TOKEN, authData.accessToken],
        [AUTH_KEYS.REFRESH_TOKEN, authData.refreshToken],
        [AUTH_KEYS.USER_DATA, JSON.stringify(authData.user)],
        [AUTH_KEYS.IS_LOGGED_IN, 'true'],
      ]);
      return true;
    } catch (error) {
      console.error('Error storing auth data:', error);
      return false;
    }
  },

  // Get authentication token
  getAuthToken: async () => {
    try {
      return await AsyncStorage.getItem(AUTH_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  // Get refresh token
  getRefreshToken: async () => {
    try {
      return await AsyncStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  // Get user data
  getUserData: async () => {
    try {
      const userData = await AsyncStorage.getItem(AUTH_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Check if user is logged in
  isLoggedIn: async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem(AUTH_KEYS.IS_LOGGED_IN);
      return isLoggedIn === 'true';
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  },

  // Clear all authentication data
  clearAuthData: async () => {
    try {
      await AsyncStorage.multiRemove([
        AUTH_KEYS.AUTH_TOKEN,
        AUTH_KEYS.REFRESH_TOKEN,
        AUTH_KEYS.USER_DATA,
        AUTH_KEYS.IS_LOGGED_IN,
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  },

  // Login function
  login: async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const authData = response.data;
      
      const success = await authUtils.storeAuthData(authData);
      return { success, data: authData };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  // Logout function
  logout: async () => {
    try {
      // Call logout API
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API call success
      await authUtils.clearAuthData();
    }
  },

  // Update user data
  updateUserData: async (userData) => {
    try {
      await AsyncStorage.setItem(AUTH_KEYS.USER_DATA, JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error updating user data:', error);
      return false;
    }
  },
}; 