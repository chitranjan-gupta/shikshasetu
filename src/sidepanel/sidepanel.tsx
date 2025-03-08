'use client';

import type { FC } from 'react';

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

const SidePanel: FC = () => {
  return <Paths className="w-screen h-screen" boxes={boxes} />;
};

export default SidePanel;
