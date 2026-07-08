import { createBrowserRouter } from 'react-router';

import { AppShell } from '@/components/layout/app-shell';
import { AcceptInvitePage } from '@/features/auth/accept-invite-page';
import { ForgotPasswordPage, ResetPasswordPage } from '@/features/auth/password-pages';
import { LoginPage } from '@/features/auth/login-page';
import { RegisterPage } from '@/features/auth/register-page';
import { AppHomePage } from '@/features/app/app-home-page';
import { ProtectedRoute } from '@/features/app/protected-route';
import { WorkspaceShell } from '@/features/app/workspace-shell';
import { OnboardingPage } from '@/features/onboarding/onboarding-page';
import { NewOrganisationPage } from '@/features/organisations/new-organisation-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/accept-invite',
    element: <AcceptInvitePage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/onboarding',
        element: <OnboardingPage />,
      },
      {
        path: '/organisations/new',
        element: <NewOrganisationPage />,
      },
      {
        path: '/app',
        element: <WorkspaceShell />,
        children: [
          {
            index: true,
            element: <AppHomePage />,
          },
          {
            path: 'settings',
            element: <AppHomePage />,
          },
        ],
      },
    ],
  },
]);
