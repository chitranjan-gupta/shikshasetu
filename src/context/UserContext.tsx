import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { SignUpState, User, FormSchemaType } from '@/types';

interface UserContextType {
  status: string; //'idle' | 'pending'
  isloading: boolean;
  error: string | null;
  user: User | null;
  profiles: (FormSchemaType & { id?: string; sites?: any })[];
  setProfiles: (
    values: (FormSchemaType & { id?: string; sites?: any })[]
  ) => void;
  setProfile: (values: FormSchemaType & { id?: string; sites?: any }) => void;
  clearProfile: (key: number) => void;
  editUser: Dispatch<SetStateAction<User>>;
  setUser: (data: SignUpState) => Promise<boolean>;
  getUser: () => Promise<void>;
  removeUser: () => void;
  hydrate: () => Promise<void>;
}

export const defaultUser = {
  userId: '',
  name: 'Guest User',
  email: 'me@example.com',
  role: '',
  avatar: '',
};

// Set up a default value for the context
const defaultContextValue: UserContextType = {
  status: 'idle',
  isloading: false,
  error: null,
  user: defaultUser,
  profiles: [],
  setProfiles: (values: (FormSchemaType & { id?: string; sites?: any })[]) => {
    console.log(values);
  },
  setProfile: (values: FormSchemaType & { id?: string }) => {
    console.log(values);
  },
  clearProfile: (key: number) => {
    console.log(key);
  },
  editUser: () => {},
  setUser: async (data: SignUpState) => {
    console.log(data);
    return false;
  },
  getUser: async () => {},
  removeUser: () => {},
  hydrate: async () => {},
};

// Create the context with the default value
export const UserContext = createContext<UserContextType>(defaultContextValue);
