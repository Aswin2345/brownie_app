import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('admin_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setAdmin(res.data.data || res.data);
      setToken(storedToken);
    } catch (err) {
      localStorage.removeItem('admin_token');
      setAdmin(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, data: adminData } = res.data;
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
    setAdmin(adminData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
