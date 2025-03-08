'use client';

import { memo, type FC } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface AvatarsProps {
  url: string;
}

const AvatarsComponent: FC<AvatarsProps> = ({ url }) => {
  return (
    <Avatar>
      <AvatarImage src={url} alt="default" />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  );
};

export const Avatars = memo(AvatarsComponent);
