'use client';

import { observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';
import { syncObservable } from '@legendapp/state/sync';
import { v4 as uuidv4 } from 'uuid';
import { getAutofill, setAutofill } from '@/api';
import { isAuth$ } from './auth';
import { persistOptions } from './common';

import type { FormSchemaType } from '@/types';

export const autofills$ = observable({
  autofills: synced({
    initial: [] as (FormSchemaType & { id: string })[],
    // When the fetch resolves it will update the observable
    get: () => (isAuth$.get() ? getAutofill() : []),
    // When the observable is changed it will send the changes back to the server.
    set: ({ value }) =>
      isAuth$.get() ? setAutofill(value) : Promise.resolve(),
    transform: {
      load: (value, method) =>
        method === 'get' ? JSON.parse(value.data) : value,
    },
    waitFor: isAuth$,
    mode: 'merge',
  }),
  currentAutofill: 0,
  addAutofill: (values: FormSchemaType) => {
    autofills$.autofills[autofills$.get().currentAutofill].set({
      id: uuidv4(),
      ...values,
    });
  },
  editAutofill: (values: FormSchemaType & { id: string }) => {
    autofills$.autofills[autofills$.get().currentAutofill].set(values);
  },
  setAutofill: (values: (FormSchemaType & { id?: string })[]) => {
    autofills$.autofills.set(values);
  },
  setCurrentAutofill: (index: number) => {
    autofills$.currentAutofill.set(index);
  },
});

syncObservable(
  autofills$,
  persistOptions({
    persist: {
      name: 'autofills', // IndexedDB table name
    },
  })
);
