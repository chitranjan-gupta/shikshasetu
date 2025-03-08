import { createContext } from 'react';
import type { TokenType, SignInState } from '@/types';

interface AuthContextType {
  token: TokenType | null;
  status: string; //'idle' | 'pending' | 'signOut' | 'signIn'
  isloading: boolean;
  error: string | null;
  signIn: (data: SignInState) => Promise<void>;
  signOut: () => Promise<void>;
  changepassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  refresh: (newToken: TokenType | null, logout: boolean) => Promise<void>;
  oauth: (provider: string, register: boolean) => Promise<void>;
  oauth_success: (url: string) => Promise<boolean>;
  hydrate: () => Promise<void>;
  handleDashboard: () => void;
  handleLogout: () => void;
}

const defaultContextValue = {
  token: null,
  status: 'idle',
  isloading: false,
  error: null,
  signIn: async (data: SignInState) => {
    console.log(data);
  },
  signOut: async () => {},
  changepassword: async (currentPassword: string, newPassword: string) => {
    console.log(currentPassword, newPassword);
  },
  refresh: async (newToken: TokenType | null, logout: boolean) => {
    console.log(newToken, logout);
  },
  oauth: async (provider: string, register: boolean = true) => {
    console.log(provider, register);
  },
  oauth_success: async (url: string) => {
    console.log(url);
    return false;
  },
  hydrate: async () => {},
  handleDashboard: () => {},
  handleLogout: () => {},
};

// Create the context with the default value
export const AuthContext = createContext<AuthContextType>(defaultContextValue);
