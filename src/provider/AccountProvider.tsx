'use client';

import type { ReactNode, FC } from 'react';
import { observer } from '@legendapp/state/react';
import { autofills$ } from '@/store';
import { AccountContext } from '@/context';

interface AccountProviderProps {
  children: ReactNode;
}

const AccountProviderComponent: FC<AccountProviderProps> = ({ children }) => {
  const account = autofills$.get().currentAutofill;
  const setAccount = autofills$.setCurrentAutofill;
  return (
    <AccountContext.Provider value={{ account, setAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

export const AccountProvider = observer(AccountProviderComponent);
