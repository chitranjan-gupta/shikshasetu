'use client';

import { configureSynced } from '@legendapp/state/sync';
import { observablePersistIndexedDB } from '@legendapp/state/persist-plugins/indexeddb';

export const persistOptions = configureSynced({
  persist: {
    plugin: observablePersistIndexedDB({
      databaseName: 'users',
      version: 1,
      tableNames: ['autofills', 'accounts', 'mails', 'domains', 'messages'],
    }),
  },
});
