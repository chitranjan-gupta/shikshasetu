import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { Bucket, Buckets } from '@/types';

// Define the type for the context value
interface S3ContextType {
  buckets: Buckets;
  setBuckets: Dispatch<SetStateAction<Buckets>>;
  addBucket: (key: string, value: Bucket) => void;
  saveBuckets: (key: number, value: Buckets) => void;
  clearBuckets: (key: number, value: Buckets) => void;
  fetchBucket: (name: string, value: string, key: number) => void;
}

// Create the context with the default value
export const S3Context = createContext<S3ContextType>(
  {} as unknown as S3ContextType
);
