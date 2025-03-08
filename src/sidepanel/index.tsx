import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';

import Router from '@/routes';
import '@/styles/index.css';

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <MemoryRouter>
      <Router loc="/sidepanel" />
    </MemoryRouter>
  </StrictMode>
);
