import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import Router from '@/routes';
import '@/styles/index.css';

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <HashRouter>
      <Router loc="/option" />
    </HashRouter>
  </StrictMode>
);
