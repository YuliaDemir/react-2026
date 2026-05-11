import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import ErrorBoundary from './ErrorBoundary.tsx';
import { App, Search, ThrowErrorButton } from './components';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Search />
      <App />
      <ThrowErrorButton />
    </ErrorBoundary>
  </StrictMode>
);
