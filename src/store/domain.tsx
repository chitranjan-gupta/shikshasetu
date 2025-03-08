'use client';

import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { persistOptions } from './common';

import type { Domain } from '@/types';

export const domains$ = observable({
  domains: [] as Domain[],
  addDomains: (values: Domain[]) => {
    domains$.domains.set(values);
  },
});

syncObservable(
  domains$,
  persistOptions({
    persist: {
      name: 'domains', // IndexedDB table name
    },
  })
);
