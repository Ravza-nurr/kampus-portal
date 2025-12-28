import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { fetchCsrfToken } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // CSRF token'ı al
    fetchCsrfToken();

    // Check for saved token on load
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Set default header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        console.error("Error parsing saved user", e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: apiUser } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(apiUser));
      
      // Set default header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(apiUser);
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Giriş başarısız' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user: apiUser } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(apiUser));
      
      // Set default header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(apiUser);
      return { success: true };
    } catch (error) {
      console.error("Register Error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Kayıt başarısız' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
    role: user?.role,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
