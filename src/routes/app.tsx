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
    title: 'Profile',
    description: 'View your profiles details saved locally and on the cloud.',
    link: '/profile',
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
  {
    title: 'Change Password',
    description: 'Change your current password with new password.',
    link: '/changepassword',
  },
  {
    title: 'Option',
    description: 'Option View',
    link: '/option',
  },
  {
    title: 'Popup',
    description: 'Popup View',
    link: '/popup',
  },
  {
    title: 'Chat',
    description: 'Chat View',
    link: '/chat',
  },
];

const AppComponent: FC = () => {
  return <Paths className="w-screen h-screen" boxes={boxes} />;
};

const App = memo(AppComponent);

export default App;
