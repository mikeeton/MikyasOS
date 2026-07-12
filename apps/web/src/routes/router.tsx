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
const ProjectsDashboardPage = lazy(() =>
  import('@/features/projects/pages/projects-dashboard-page').then((module) => ({
    default: module.ProjectsDashboardPage,
  })),
);
const ProjectsListPage = lazy(() =>
  import('@/features/projects/pages/projects-list-page').then((module) => ({
    default: module.ProjectsListPage,
  })),
);
const ProjectFormPage = lazy(() =>
  import('@/features/projects/pages/project-form-page').then((module) => ({
    default: module.ProjectFormPage,
  })),
);
const ProjectDetailPage = lazy(() =>
  import('@/features/projects/pages/project-detail-page').then((module) => ({
    default: module.ProjectDetailPage,
  })),
);
const ProjectSettingsPage = lazy(() =>
  import('@/features/projects/pages/project-settings-page').then((module) => ({
    default: module.ProjectSettingsPage,
  })),
);
const ProjectBoardPage = lazy(() =>
  import('@/features/projects/pages/project-views-page').then((module) => ({
    default: module.ProjectBoardPage,
  })),
);
const ProjectTaskListPage = lazy(() =>
  import('@/features/projects/pages/project-views-page').then((module) => ({
    default: module.ProjectTaskListPage,
  })),
);
const ProjectTimelinePage = lazy(() =>
  import('@/features/projects/pages/project-views-page').then((module) => ({
    default: module.ProjectTimelinePage,
  })),
);
const ProjectCalendarPage = lazy(() =>
  import('@/features/projects/pages/project-views-page').then((module) => ({
    default: module.ProjectCalendarPage,
  })),
);
const ProjectWorkloadPage = lazy(() =>
  import('@/features/projects/pages/project-views-page').then((module) => ({
    default: module.ProjectWorkloadPage,
  })),
);
const TaskDetailPage = lazy(() =>
  import('@/features/projects/pages/task-detail-page').then((module) => ({
    default: module.TaskDetailPage,
  })),
);
const TasksPage = lazy(() =>
  import('@/features/projects/pages/tasks-page').then((module) => ({
    default: module.TasksPage,
  })),
);
const DocumentsHomePage = lazy(() =>
  import('@/features/documents/pages/documents-pages').then((module) => ({
    default: module.DocumentsHomePage,
  })),
);
const DocumentsAllPage = lazy(() =>
  import('@/features/documents/pages/documents-pages').then((module) => ({
    default: module.DocumentsAllPage,
  })),
);
const DocumentsFoldersPage = lazy(() =>
  import('@/features/documents/pages/documents-pages').then((module) => ({
    default: module.DocumentsFoldersPage,
  })),
);
const DocumentFolderDetailPage = lazy(() =>
  import('@/features/documents/pages/documents-pages').then((module) => ({
    default: module.DocumentFolderDetailPage,
  })),
);
const DocumentDetailPage = lazy(() =>
  import('@/features/documents/pages/documents-pages').then((module) => ({
    default: module.DocumentDetailPage,
  })),
);
const DocumentPreviewPage = lazy(() =>
  import('@/features/documents/pages/documents-pages').then((module) => ({
    default: module.DocumentPreviewPage,
  })),
);
const DocumentVersionsPage = lazy(() =>
  import('@/features/documents/pages/documents-pages').then((module) => ({
    default: module.DocumentVersionsPage,
  })),
);
const DocumentPermissionsPage = lazy(() =>
  import('@/features/documents/pages/documents-pages').then((module) => ({
    default: module.DocumentPermissionsPage,
  })),
);
const DocumentActivityPage = lazy(() =>
  import('@/features/documents/pages/documents-pages').then((module) => ({
    default: module.DocumentActivityPage,
  })),
);
const DocumentsSearchPage = lazy(() =>
  import('@/features/documents/pages/documents-pages').then((module) => ({
    default: module.DocumentsSearchPage,
  })),
);
const DocumentTagsPage = lazy(() =>
  import('@/features/documents/pages/documents-pages').then((module) => ({
    default: module.DocumentTagsPage,
  })),
);
const DocumentsTrashPage = lazy(() =>
  import('@/features/documents/pages/documents-pages').then((module) => ({
    default: module.DocumentsTrashPage,
  })),
);
const DocumentsNotePlaceholderPage = lazy(() =>
  import('@/features/documents/pages/documents-pages').then((module) => ({
    default: module.DocumentsNotePlaceholderPage,
  })),
);
const AiWorkspacePage = lazy(() =>
  import('@/features/ai/pages/ai-pages').then((module) => ({
    default: module.AiWorkspacePage,
  })),
);
const AiHistoryPage = lazy(() =>
  import('@/features/ai/pages/ai-pages').then((module) => ({
    default: module.AiHistoryPage,
  })),
);
const AiSettingsPage = lazy(() =>
  import('@/features/ai/pages/ai-pages').then((module) => ({
    default: module.AiSettingsPage,
  })),
);
const AiMemoryPage = lazy(() =>
  import('@/features/ai/pages/ai-pages').then((module) => ({
    default: module.AiMemoryPage,
  })),
);
const AiPromptsPage = lazy(() =>
  import('@/features/ai/pages/ai-pages').then((module) => ({
    default: module.AiPromptsPage,
  })),
);
const ChatPage = lazy(() =>
  import('@/features/communication/pages/communication-pages').then((module) => ({
    default: module.ChatPage,
  })),
);
const ConversationPage = lazy(() =>
  import('@/features/communication/pages/communication-pages').then((module) => ({
    default: module.ConversationPage,
  })),
);
const ChannelsPage = lazy(() =>
  import('@/features/communication/pages/communication-pages').then((module) => ({
    default: module.ChannelsPage,
  })),
);
const AnnouncementsPage = lazy(() =>
  import('@/features/communication/pages/communication-pages').then((module) => ({
    default: module.AnnouncementsPage,
  })),
);
const MeetingsPage = lazy(() =>
  import('@/features/communication/pages/communication-pages').then((module) => ({
    default: module.MeetingsPage,
  })),
);
const MeetingDetailPage = lazy(() =>
  import('@/features/communication/pages/communication-pages').then((module) => ({
    default: module.MeetingDetailPage,
  })),
);
const MeetingNotesPage = lazy(() =>
  import('@/features/communication/pages/communication-pages').then((module) => ({
    default: module.MeetingNotesPage,
  })),
);
const PresencePage = lazy(() =>
  import('@/features/communication/pages/communication-pages').then((module) => ({
    default: module.PresencePage,
  })),
);
const AutomationDashboardPage = lazy(() =>
  import('@/features/automation/pages/automation-pages').then((module) => ({
    default: module.AutomationDashboardPage,
  })),
);
const AutomationWorkflowsPage = lazy(() =>
  import('@/features/automation/pages/automation-pages').then((module) => ({
    default: module.AutomationWorkflowsPage,
  })),
);
const AutomationTemplatesPage = lazy(() =>
  import('@/features/automation/pages/automation-pages').then((module) => ({
    default: module.AutomationTemplatesPage,
  })),
);
const AutomationHistoryPage = lazy(() =>
  import('@/features/automation/pages/automation-pages').then((module) => ({
    default: module.AutomationHistoryPage,
  })),
);
const AutomationLogsPage = lazy(() =>
  import('@/features/automation/pages/automation-pages').then((module) => ({
    default: module.AutomationLogsPage,
  })),
);
const AutomationSettingsPage = lazy(() =>
  import('@/features/automation/pages/automation-pages').then((module) => ({
    default: module.AutomationSettingsPage,
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
          {
            path: 'projects',
            element: withSuspense(<ProjectsDashboardPage />),
          },
          {
            path: 'projects/list',
            element: withSuspense(<ProjectsListPage />),
          },
          {
            path: 'projects/archive',
            element: withSuspense(<ProjectsListPage archive />),
          },
          {
            path: 'projects/new',
            element: withSuspense(<ProjectFormPage />),
          },
          {
            path: 'projects/:id',
            element: withSuspense(<ProjectDetailPage />),
          },
          {
            path: 'projects/:id/settings',
            element: withSuspense(<ProjectSettingsPage />),
          },
          {
            path: 'projects/:id/board',
            element: withSuspense(<ProjectBoardPage />),
          },
          {
            path: 'projects/:id/list',
            element: withSuspense(<ProjectTaskListPage />),
          },
          {
            path: 'projects/:id/timeline',
            element: withSuspense(<ProjectTimelinePage />),
          },
          {
            path: 'projects/:id/calendar',
            element: withSuspense(<ProjectCalendarPage />),
          },
          {
            path: 'projects/:id/workload',
            element: withSuspense(<ProjectWorkloadPage />),
          },
          {
            path: 'tasks',
            element: withSuspense(<TasksPage />),
          },
          {
            path: 'tasks/:id',
            element: withSuspense(<TaskDetailPage />),
          },
          {
            path: 'documents',
            element: withSuspense(<DocumentsHomePage />),
          },
          {
            path: 'documents/all',
            element: withSuspense(<DocumentsAllPage />),
          },
          {
            path: 'documents/folders',
            element: withSuspense(<DocumentsFoldersPage />),
          },
          {
            path: 'documents/folders/:id',
            element: withSuspense(<DocumentFolderDetailPage />),
          },
          {
            path: 'documents/search',
            element: withSuspense(<DocumentsSearchPage />),
          },
          {
            path: 'documents/tags',
            element: withSuspense(<DocumentTagsPage />),
          },
          {
            path: 'documents/trash',
            element: withSuspense(<DocumentsTrashPage />),
          },
          {
            path: 'documents/new-note',
            element: withSuspense(<DocumentsNotePlaceholderPage />),
          },
          {
            path: 'documents/:id/preview',
            element: withSuspense(<DocumentPreviewPage />),
          },
          {
            path: 'documents/:id/versions',
            element: withSuspense(<DocumentVersionsPage />),
          },
          {
            path: 'documents/:id/permissions',
            element: withSuspense(<DocumentPermissionsPage />),
          },
          {
            path: 'documents/:id/activity',
            element: withSuspense(<DocumentActivityPage />),
          },
          {
            path: 'documents/:id',
            element: withSuspense(<DocumentDetailPage />),
          },
          {
            path: 'ai',
            element: withSuspense(<AiWorkspacePage />),
          },
          {
            path: 'ai/history',
            element: withSuspense(<AiHistoryPage />),
          },
          {
            path: 'ai/settings',
            element: withSuspense(<AiSettingsPage />),
          },
          {
            path: 'ai/memory',
            element: withSuspense(<AiMemoryPage />),
          },
          {
            path: 'ai/prompts',
            element: withSuspense(<AiPromptsPage />),
          },
          {
            path: 'chat',
            element: withSuspense(<ChatPage />),
          },
          {
            path: 'chat/:conversationId',
            element: withSuspense(<ConversationPage />),
          },
          {
            path: 'channels',
            element: withSuspense(<ChannelsPage />),
          },
          {
            path: 'announcements',
            element: withSuspense(<AnnouncementsPage />),
          },
          {
            path: 'meetings',
            element: withSuspense(<MeetingsPage />),
          },
          {
            path: 'meetings/:id',
            element: withSuspense(<MeetingDetailPage />),
          },
          {
            path: 'meeting-notes',
            element: withSuspense(<MeetingNotesPage />),
          },
          {
            path: 'presence',
            element: withSuspense(<PresencePage />),
          },
          {
            path: 'automation',
            element: withSuspense(<AutomationDashboardPage />),
          },
          {
            path: 'automation/workflows',
            element: withSuspense(<AutomationWorkflowsPage />),
          },
          {
            path: 'automation/templates',
            element: withSuspense(<AutomationTemplatesPage />),
          },
          {
            path: 'automation/history',
            element: withSuspense(<AutomationHistoryPage />),
          },
          {
            path: 'automation/logs',
            element: withSuspense(<AutomationLogsPage />),
          },
          {
            path: 'automation/settings',
            element: withSuspense(<AutomationSettingsPage />),
          },
        ],
      },
    ],
  },
]);
