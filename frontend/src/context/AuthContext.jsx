import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Load existing session or default to demo patient for instant exploration
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const result = await authService.login(email, password, role);
      setUser(result.user);
      showToast(`Welcome back, ${result.user.name}! Logged in as ${result.user.role}.`, 'success');
      return result;
    } catch (err) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      setUser(result.user);
      showToast(`Account created successfully! Welcome to CareConnect AI, ${result.user.name}.`, 'success');
      return result;
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    showToast('You have been logged out safely.', 'info');
  };

  const switchRole = (newRole) => {
    const switchedUser = authService.switchDemoRole(newRole);
    setUser(switchedUser);
    showToast(`Switched active view to ${newRole.toUpperCase()} mode (${switchedUser.name})`, 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'patient',
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        switchRole
      }}
    >
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
