import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserProfile, logout as logoutService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for a user profile in localStorage on initial load
    try {
      const storedUser = getUserProfile();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Failed to parse user profile from storage", error);
      // If parsing fails, clear out the bad data
      logoutService();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
