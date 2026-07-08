import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router';

import { AppShell } from '@/components/layout/app-shell';
import { AcceptInvitePage } from '@/features/auth/accept-invite-page';
import { ForgotPasswordPage, ResetPasswordPage } from '@/features/auth/password-pages';
import { LoginPage } from '@/features/auth/login-page';
import { RegisterPage } from '@/features/auth/register-page';
import { ProtectedRoute } from '@/features/app/protected-route';
import { OnboardingPage } from '@/features/onboarding/onboarding-page';
import { NewOrganisationPage } from '@/features/organisations/new-organisation-page';

const AppHomePage = lazy(() =>
  import('@/features/app/app-home-page').then((module) => ({ default: module.AppHomePage })),
);

const WorkspaceShell = lazy(() =>
  import('@/features/app/workspace-shell').then((module) => ({ default: module.WorkspaceShell })),
);

const WorkspaceSettingsPage = lazy(() =>
  import('@/features/workspace/components/workspace-settings-page').then((module) => ({
    default: module.WorkspaceSettingsPage,
  })),
);

const CrmDashboardPage = lazy(() =>
  import('@/features/crm/pages/crm-dashboard-page').then((module) => ({
    default: module.CrmDashboardPage,
  })),
);
const CompaniesPage = lazy(() =>
  import('@/features/crm/pages/companies-page').then((module) => ({
    default: module.CompaniesPage,
  })),
);
const CompanyFormPage = lazy(() =>
  import('@/features/crm/pages/company-form-page').then((module) => ({
    default: module.CompanyFormPage,
  })),
);
const CompanyDetailPage = lazy(() =>
  import('@/features/crm/pages/company-detail-page').then((module) => ({
    default: module.CompanyDetailPage,
  })),
);
const ContactsPage = lazy(() =>
  import('@/features/crm/pages/contacts-page').then((module) => ({
    default: module.ContactsPage,
  })),
);
const ContactFormPage = lazy(() =>
  import('@/features/crm/pages/contact-form-page').then((module) => ({
    default: module.ContactFormPage,
  })),
);
const ContactDetailPage = lazy(() =>
  import('@/features/crm/pages/contact-detail-page').then((module) => ({
    default: module.ContactDetailPage,
  })),
);
const LeadsPage = lazy(() =>
  import('@/features/crm/pages/leads-page').then((module) => ({ default: module.LeadsPage })),
);
const PipelinePage = lazy(() =>
  import('@/features/crm/pages/pipeline-page').then((module) => ({
    default: module.PipelinePage,
  })),
);
const OpportunitiesPage = lazy(() =>
  import('@/features/crm/pages/opportunities-page').then((module) => ({
    default: module.OpportunitiesPage,
  })),
);
const CrmSearchPage = lazy(() =>
  import('@/features/crm/pages/crm-search-page').then((module) => ({
    default: module.CrmSearchPage,
  })),
);

function withSuspense(children: ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[40vh] place-items-center text-sm text-muted-foreground">
          Loading workspace...
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

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
        element: withSuspense(<WorkspaceShell />),
        children: [
          {
            index: true,
            element: withSuspense(<AppHomePage />),
          },
          {
            path: 'settings',
            element: withSuspense(<WorkspaceSettingsPage />),
          },
          {
            path: 'crm',
            element: withSuspense(<CrmDashboardPage />),
          },
          {
            path: 'crm/companies',
            element: withSuspense(<CompaniesPage />),
          },
          {
            path: 'crm/companies/new',
            element: withSuspense(<CompanyFormPage mode="create" />),
          },
          {
            path: 'crm/companies/:id',
            element: withSuspense(<CompanyDetailPage />),
          },
          {
            path: 'crm/companies/:id/edit',
            element: withSuspense(<CompanyFormPage mode="edit" />),
          },
          {
            path: 'crm/contacts',
            element: withSuspense(<ContactsPage />),
          },
          {
            path: 'crm/contacts/new',
            element: withSuspense(<ContactFormPage mode="create" />),
          },
          {
            path: 'crm/contacts/:id',
            element: withSuspense(<ContactDetailPage />),
          },
          {
            path: 'crm/contacts/:id/edit',
            element: withSuspense(<ContactFormPage mode="edit" />),
          },
          {
            path: 'crm/leads',
            element: withSuspense(<LeadsPage />),
          },
          {
            path: 'crm/pipeline',
            element: withSuspense(<PipelinePage />),
          },
          {
            path: 'crm/opportunities',
            element: withSuspense(<OpportunitiesPage />),
          },
          {
            path: 'crm/search',
            element: withSuspense(<CrmSearchPage />),
          },
        ],
      },
    ],
  },
]);
