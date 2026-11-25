import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiSignup, apiForgotPassword, apiResetPassword, apiGetMe, apiLogout } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('sharedrop_auth_token'));
  const [loading, setLoading] = useState(true);

  // Restore session on load
  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      if (token) {
        const profile = await apiGetMe();
        if (mounted) {
          if (profile) {
            setUser(profile);
          } else {
            // Token expired or invalid
            localStorage.removeItem('sharedrop_auth_token');
            setToken(null);
            setUser(null);
          }
        }
      }
      if (mounted) setLoading(false);
    };
    checkAuth();
    return () => {
      mounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    localStorage.setItem('sharedrop_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (name, email, password) => {
    const data = await apiSignup(name, email, password);
    localStorage.setItem('sharedrop_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const forgotPassword = async (email) => {
    return await apiForgotPassword(email);
  };

  const resetPassword = async (email, code, newPassword) => {
    return await apiResetPassword(email, code, newPassword);
  };

  const logout = async () => {
    await apiLogout();
    localStorage.removeItem('sharedrop_auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
