'use client';

import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { persistOptions } from './common';

import type { Message } from '@/types';

export const messages$ = observable({
  messages: [] as Message[][],
  saveMessages: (id: number, values: Message[]) => {
    messages$.messages[id].set(values);
  },
});

syncObservable(
  messages$,
  persistOptions({
    persist: {
      name: 'messages', // IndexedDB table name
    },
  })
);
