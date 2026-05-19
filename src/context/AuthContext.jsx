import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/services.js';

const AuthContext = createContext(null);

const normalizeUser = (u) => (u ? { ...u, _id: u._id || u.id } : null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => setUser(normalizeUser(res.data)))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem('token', res.data.token);
    const me = await authApi.me();
    const user = normalizeUser(me.data);
    setUser(user);
    return user;
  };

  const register = async (payload) => {
    const res = await authApi.register(payload);
    localStorage.setItem('token', res.data.token);
    const me = await authApi.me();
    const user = normalizeUser(me.data);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const refreshUser = async () => {
    const res = await authApi.me();
    setUser(normalizeUser(res.data));
    return normalizeUser(res.data);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
