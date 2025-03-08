import { createContext } from 'react';

// Define the type for the context value
interface AccountContextType {
  account: number;
  setAccount: (account: number) => void;
}

// Set up a default value for the context
const defaultContextValue: AccountContextType = {
  account: 0,
  setAccount: () => {},
};

// Create the context with the default value
export const AccountContext =
  createContext<AccountContextType>(defaultContextValue);
