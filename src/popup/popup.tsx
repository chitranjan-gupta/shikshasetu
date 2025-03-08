'use client';

import { memo, type FC } from 'react';

import { Paths } from '@/components';

const boxes = [
  {
    title: 'AI',
    description:
      'Chat with AI, ChatGPT, Meta AI, Gemini, llama, gemma, deepseek.',
    link: '/ai',
  },
  {
    title: 'Profile',
    description: 'View your profiles details saved locally and on the cloud.',
    link: '/profile',
  },
];

const PopupComponent: FC = () => {
  return <Paths className="w-[400px] h-screen" boxes={boxes} />;
};

const Popup = memo(PopupComponent);

export default Popup;
