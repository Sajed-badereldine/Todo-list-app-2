import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearStoredToken, getStoredToken, setStoredToken } from '../utils/storage';
import { configureApiClient } from '../services/api/client';
import { getCurrentUser, loginUser, signupUser } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    configureApiClient({
      tokenGetter: () => token,
      unauthorizedHandler: () => {
        clearStoredToken();
        setToken(null);
        setUser(null);
        navigate('/login', { replace: true });
      },
    });
  }, [navigate, token]);

  const refreshCurrentUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      return null;
    }

    const currentUser = await getCurrentUser();
    setUser(currentUser);
    return currentUser;
  }, [token]);

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        await refreshCurrentUser();
      } catch (_error) {
        clearStoredToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    }

    void restoreSession();
  }, [refreshCurrentUser, token]);

  const login = async (payload) => {
    setIsAuthLoading(true);

    try {
      const response = await loginUser(payload);
      setStoredToken(response.access_token);
      setToken(response.access_token);
      setUser(response.user);
      return response.user;
    } finally {
      setIsAuthLoading(false);
      setIsInitializing(false);
    }
  };

  const signup = async (payload) => {
    setIsAuthLoading(true);

    try {
      return await signupUser(payload);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = () => {
    clearStoredToken();
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isInitializing,
      isAuthLoading,
      login,
      signup,
      logout,
      refreshCurrentUser,
    }),
    [token, user, isInitializing, isAuthLoading, refreshCurrentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
