'use client';

import {
  useEffect,
  useCallback,
  useState,
  useRef,
  type ReactNode,
  type FC,
} from 'react';
import { observer } from '@legendapp/state/react';
import { s3$ } from '@/store';
import { S3Context } from '@/context';
import { useAccount, useUser, useAuth } from '@/hooks';

import type { Bucket, Buckets } from '@/types';

interface S3ProviderProps {
  children: ReactNode;
}

// Check if the string matches the pattern 'arr.index.name'
const regex = /^([a-zA-Z0-9_]+)\.(\d+)\.([a-zA-Z0-9_]+)$/;

const S3ProviderComponent: FC<S3ProviderProps> = ({ children }) => {
  const [buckets, setBuckets] = useState<Buckets>(new Map());
  const { profiles, setProfile } = useUser();
  const { status, token } = useAuth();
  const { account } = useAccount();
  const s3buckets = s3$.get().buckets;
  const workerRef = useRef<Worker | null>(null);
  const initialiseWorker = useCallback(() => {
    if (status !== 'signIn') {
      return;
    }
    if (window.Worker) {
      if (!workerRef.current) {
        workerRef.current = new Worker(
          new URL('../lib/worker', import.meta.url),
          { type: 'module' }
        );
        workerRef.current?.postMessage(['initialise', token]);
        if (workerRef.current) {
          workerRef.current.onmessage = function (e) {
            try {
              if (e.data[0] === 'uploaded') {
                const key = e.data[1];
                const value = e.data[2];
                s3$.addBucket(key, value);
                for (const [k, v] of value) {
                  console.log(v);
                  if (v.cloud) {
                    const currentProfile: any = profiles[key];
                    const id = currentProfile?.id;
                    if (currentProfile && id) {
                      const splits = k.match(regex);
                      if (splits) {
                        const docIndex = splits[1];
                        const arr: any = currentProfile[docIndex];
                        const indexDoc = arr[Number(splits[2])];
                        arr[Number(splits[2])] = {
                          ...indexDoc,
                          [splits[3]]: v.cloud.url,
                        };
                        setProfile({
                          ...currentProfile,
                          id: id,
                          [docIndex]: arr,
                        });
                      } else {
                        setProfile({
                          ...currentProfile,
                          id: id,
                          [k]: v.cloud.url,
                        });
                      }
                    }
                  }
                }
              } else if (e.data[0] === 'downloaded') {
                const name = e.data[1];
                const url = e.data[2];
                const file = e.data[3];
                const key = e.data[4];
                const bucket = {
                  name: name,
                  value: url,
                  file: file,
                  cloud: {
                    name: file.name,
                    url: url,
                    filename: file.name,
                    extension: file.type,
                  },
                };
                const currentBucket = s3$.get().buckets[key];
                const newBucket = new Map(currentBucket);
                newBucket.set(name, bucket);
                setBuckets(newBucket);
                s3$.addBucket(key, newBucket);
              }
            } catch (error) {
              console.log(error);
            }
          };
        }
      }
    }
  }, [token, status, profiles, setProfile, setBuckets]);
  const sendToWorker = useCallback(
    (data: any[]) => {
      if (chrome && chrome.runtime) {
      } else {
        if (!workerRef.current) {
          initialiseWorker();
        }
        workerRef.current?.postMessage(data);
      }
    },
    [initialiseWorker]
  );
  const fetchBucket = useCallback(
    (name: string, value: string, key: number) => {
      sendToWorker(['download', name, value, key]);
    },
    [sendToWorker]
  );
  const addBucket = useCallback(
    (key: string, value: Bucket) => {
      setBuckets((prevMap) => new Map(prevMap.set(key, value)));
    },
    [setBuckets]
  );
  const saveBuckets = useCallback(
    (key: number, value: Buckets) => {
      if (value.size === 0) {
        return;
      }
      s3$.addBucket(key, value);
      sendToWorker(['upload', key, value]);
    },
    [sendToWorker]
  );
  const clearBuckets = useCallback(
    (key: number, value: Buckets) => {
      s3$.buckets[key].set(value);
      setBuckets(value);
    },
    [setBuckets]
  );
  useEffect(() => {
    if (typeof account !== 'undefined') {
      setBuckets(s3buckets[account] || new Map());
    }
  }, [account, s3buckets]);
  return (
    <S3Context.Provider
      value={{
        buckets,
        setBuckets,
        addBucket,
        saveBuckets,
        clearBuckets,
        fetchBucket,
      }}
    >
      {children}
    </S3Context.Provider>
  );
};

export const S3Provider = observer(S3ProviderComponent);
