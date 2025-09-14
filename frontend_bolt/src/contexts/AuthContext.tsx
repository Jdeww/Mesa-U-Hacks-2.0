import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Get stored accounts
    const accounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');
    
    // Find matching account
    const account = accounts.find((acc: any) => 
      acc.username === username && acc.password === password
    );

    if (account) {
      const userData = {
        id: account.id,
        username: account.username,
        email: account.email,
        createdAt: account.createdAt
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Get existing accounts
    const accounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');
    
    // Check if username or email already exists
    const existingUser = accounts.find((acc: any) => 
      acc.username === username || acc.email === email
    );

    if (existingUser) {
      return false; // User already exists
    }

    // Create new account
    const newAccount = {
      id: Date.now(),
      username,
      email,
      password,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    accounts.push(newAccount);
    localStorage.setItem('userAccounts', JSON.stringify(accounts));

    // Auto-login the new user
    const userData = {
      id: newAccount.id,
      username: newAccount.username,
      email: newAccount.email,
      createdAt: newAccount.createdAt
    };
    
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};