'use client';

import { observable } from '@legendapp/state';
import { configureSynced, syncObservable } from '@legendapp/state/sync';
import { observablePersistIndexedDB } from '@legendapp/state/persist-plugins/indexeddb';

import type { Buckets } from '@/types';

const persistOptions = configureSynced({
  persist: {
    plugin: observablePersistIndexedDB({
      databaseName: 's3',
      version: 1,
      tableNames: ['buckets'],
    }),
  },
});

export const s3$ = observable({
  buckets: [] as Buckets[],
  addBucket: (id: number, values: Buckets) => {
    s3$.buckets[id].set(values);
  },
});

syncObservable(
  s3$,
  persistOptions({
    persist: {
      name: 'buckets', // IndexedDB table name
    },
  })
);
