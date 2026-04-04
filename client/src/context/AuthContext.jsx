import { createContext, useContext, useState, useEffect } from 'react';
import { apiCall } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  const clearAuthState = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAdmin(null);
    setIsAuthenticated(false);
  };

  const fetchCurrentAdmin = async () => {
    const response = await apiCall.get('/admin/me');
    setAdmin(response.admin);
    setIsAuthenticated(true);
    return response.admin;
  };

  const tryRefreshSession = async () => {
    const response = await apiCall.post('/admin/refresh-token');
    if (response?.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
      return true;
    }
    return false;
  };

  // Check or restore session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('accessToken');

        if (token) {
          await fetchCurrentAdmin();
          return;
        }

        const refreshed = await tryRefreshSession();
        if (refreshed) {
          await fetchCurrentAdmin();
          return;
        }

        clearAuthState();
      } catch {
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiCall.post('/admin/login', { email, password });
      localStorage.setItem('accessToken', response.accessToken);
      setAdmin(response.admin);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiCall.post('/admin/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuthState();
      setIsLoading(false);
    }
  };

  const value = {
    admin,
    isLoading,
    isAuthenticated,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
