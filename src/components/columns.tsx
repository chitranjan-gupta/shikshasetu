'use client';

import { ColumnDef } from '@tanstack/react-table';

import type { Data } from '@/types';

export const columns: ColumnDef<Data>[] = [
  {
    header: 'Title',
    accessorKey: '0',
  },
  {
    header: 'Value',
    accessorKey: '1',
  },
];
