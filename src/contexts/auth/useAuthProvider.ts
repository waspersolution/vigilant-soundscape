
import { useState } from 'react';
import { useSession } from './hooks/useSession';
import { login, register, logout } from './services/authService';

export function useAuthProvider() {
  const { user, isLoading, setUser } = useSession();
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  const handleLogin = async (email: string, password: string) => {
    setIsAuthLoading(true);
    try {
      await login(email, password);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, fullName: string) => {
    setIsAuthLoading(true);
    try {
      await register(email, password, fullName);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Clear user state
      setUser(null);
    } catch (error) {
      // Error handling is done in the logout function
    }
  };

  return {
    user,
    isLoading: isLoading || isAuthLoading,
    isAuthenticated: !!user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout
  };
}
