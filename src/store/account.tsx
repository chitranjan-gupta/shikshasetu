'use client';

import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { persistOptions } from './common';

import type { Account } from '@/types';

export const accounts$ = observable({
  accounts: [] as Account[],
  addAccount: (values: Account) => {
    accounts$.accounts[accounts$.accounts.length].set({
      ...values,
    });
  },
});

syncObservable(
  accounts$,
  persistOptions({
    persist: {
      name: 'accounts', // IndexedDB table name
    },
  })
);
