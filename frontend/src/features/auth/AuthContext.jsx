import { createContext, useEffect, useRef, useState } from 'react';
import { fetchCurrentUser, loginUser, registerUser } from './auth.api';
import { configureApiClient } from '../../services/api/client';
import { clearStoredToken, getStoredToken, setStoredToken } from '../../utils/storage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const hasHandledUnauthorizedRef = useRef(false);

  const clearSession = () => {
    hasHandledUnauthorizedRef.current = true;
    setToken(null);
    setUser(null);
    clearStoredToken();
  };

  useEffect(() => {
    configureApiClient({
      tokenGetter: () => token,
      unauthorizedHandler: () => {
        if (hasHandledUnauthorizedRef.current) {
          return;
        }

        hasHandledUnauthorizedRef.current = true;
        clearSession();
        window.location.href = '/login';
      },
    });
  }, [token]);

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setIsInitializing(false);
        hasHandledUnauthorizedRef.current = false;
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
        hasHandledUnauthorizedRef.current = false;
      } catch (error) {
        clearSession();
      } finally {
        setIsInitializing(false);
      }
    }

    void restoreSession();
  }, [token]);

  const login = async (payload) => {
    setIsAuthLoading(true);

    try {
      const response = await loginUser(payload);
      setStoredToken(response.access_token);
      setToken(response.access_token);
      setUser(response.user);
      hasHandledUnauthorizedRef.current = false;
      return response.user;
    } finally {
      setIsAuthLoading(false);
      setIsInitializing(false);
    }
  };

  const register = async (payload) => {
    setIsAuthLoading(true);

    try {
      return await registerUser(payload);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = () => {
    clearSession();
    hasHandledUnauthorizedRef.current = false;
  };

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    isInitializing,
    isAuthLoading,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
