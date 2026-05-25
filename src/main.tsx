import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import ErrorBoundary from './ErrorBoundary.tsx';
import { App } from './components';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { ThemeProvider } from './dark-light-theme/theme-provider.tsx';
import { store } from './store/store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>
);
