import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { queryClient } from './lib/queryClient';
import { router } from './router';
import { initTelegram } from './lib/telegram';
import '@dmh/ui/styles.css';
import './styles/fonts-game.css';
import './styles/dead-men.css';
import './styles/onboarding.css';
import './styles.css';

initTelegram();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
