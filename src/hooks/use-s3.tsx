import { useContext } from 'react';
import { S3Context } from '@/context';

export const useS3 = () => {
  return useContext(S3Context);
};
