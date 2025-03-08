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
    title: 'Dashboard',
    description: 'Edit your profiles details saved locally and on the cloud.',
    link: '/dashboard',
  },
  {
    title: 'Register',
    description:
      'Register to synchronize values across different devices and browser.',
    link: '/register',
  },
  {
    title: 'Login',
    description:
      'Login to synchronize values across different devices and browser.',
    link: '/login',
  },
];

const OptionComponent: FC = () => {
  return <Paths className="w-screen h-screen" boxes={boxes} />;
};

const Option = memo(OptionComponent);

export default Option;
