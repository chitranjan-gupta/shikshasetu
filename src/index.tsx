import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import Router from '@/routes';
import { BrowserRouter } from 'react-router-dom';
import '@/styles/index.css';

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </StrictMode>
);
