import { createBrowserRouter } from 'react-router';

import { AppShell } from '@/components/layout/app-shell';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
  },
]);
