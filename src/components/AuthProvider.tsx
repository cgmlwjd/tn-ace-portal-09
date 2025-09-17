import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Test accounts
const TEST_ACCOUNTS = [
  { id: '1', username: 'student', password: '1234', role: 'student' as UserRole, name: '김학생' },
  { id: '2', username: 'teacher', password: '1234', role: 'teacher' as UserRole, name: '이선생' },
  { id: '3', username: 'admin', password: '1234', role: 'admin' as UserRole, name: '박관리자' },
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = (username: string, password: string): boolean => {
    const account = TEST_ACCOUNTS.find(
      acc => acc.username === username && acc.password === password
    );
    
    if (account) {
      setUser({
        id: account.id,
        username: account.username,
        role: account.role,
        name: account.name
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};