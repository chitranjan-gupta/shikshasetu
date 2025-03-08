'use client';

import { useState, memo, type FC } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

import { cn } from '@/lib';

import type { Account } from '@/types';

interface AccountSwitcherProps {
  isCollapsed: boolean;
  accounts: Account[];
}

const AccountSwitcherComponent: FC<AccountSwitcherProps> = ({
  isCollapsed,
  accounts,
}) => {
  const [selectedAccount, setSelectedAccount] = useState<string>(
    accounts[0]?.address || ''
  );

  return (
    <Select defaultValue={selectedAccount} onValueChange={setSelectedAccount}>
      <SelectTrigger
        className={cn(
          'flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
          isCollapsed &&
            'flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden'
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          <span className={cn('ml-2', isCollapsed && 'hidden')}>
            {
              accounts.find((account) => account.address === selectedAccount)
                ?.address
            }
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => (
          <SelectItem key={account.address} value={account.address}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {account.address}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const AccountSwitcher = memo(AccountSwitcherComponent);
