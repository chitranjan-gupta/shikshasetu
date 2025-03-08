'use client';

import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { persistOptions } from './common';

import type { Mail } from '@/types';

export const mails$ = observable({
  mails: [] as Mail[],
  addMails: (values: Mail[]) => {
    mails$.mails.set(values);
  },
  addMail: (values: Mail) => {
    mails$.mails[mails$.mails.length].set({
      ...values,
    });
  },
});

syncObservable(
  mails$,
  persistOptions({
    persist: {
      name: 'mails', // IndexedDB table name
    },
  })
);
