'use client';

import type { ReactNode, FC } from 'react';
import { UserProvider } from './UserProvider';
import { AccountProvider } from './AccountProvider';
import { S3Provider } from './S3Provider';
import { AuthProvider } from './AuthProvider';

interface ContextProviderProps {
  children: ReactNode;
}

const ContextProvider: FC<ContextProviderProps> = ({ children }) => {
  return (
    <UserProvider>
      <AuthProvider>
        <AccountProvider>
          <S3Provider>{children}</S3Provider>
        </AccountProvider>
      </AuthProvider>
    </UserProvider>
  );
};

export default ContextProvider;
