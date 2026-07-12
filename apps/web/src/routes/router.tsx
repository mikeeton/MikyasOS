import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router';

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
const FinanceDashboardPage = lazy(() =>
  import('@/features/finance/pages/finance-pages').then((module) => ({
    default: module.FinanceDashboardPage,
  })),
);
const InvoicesPage = lazy(() =>
  import('@/features/finance/pages/finance-pages').then((module) => ({
    default: module.InvoicesPage,
  })),
);
const QuotesPage = lazy(() =>
  import('@/features/finance/pages/finance-pages').then((module) => ({
    default: module.QuotesPage,
  })),
);
const PaymentsPage = lazy(() =>
  import('@/features/finance/pages/finance-pages').then((module) => ({
    default: module.PaymentsPage,
  })),
);
const ExpensesPage = lazy(() =>
  import('@/features/finance/pages/finance-pages').then((module) => ({
    default: module.ExpensesPage,
  })),
);
const PurchaseOrdersPage = lazy(() =>
  import('@/features/finance/pages/finance-pages').then((module) => ({
    default: module.PurchaseOrdersPage,
  })),
);
const BudgetsPage = lazy(() =>
  import('@/features/finance/pages/finance-pages').then((module) => ({
    default: module.BudgetsPage,
  })),
);
const CashFlowPage = lazy(() =>
  import('@/features/finance/pages/finance-pages').then((module) => ({
    default: module.CashFlowPage,
  })),
);
const AnalyticsDashboardPage = lazy(() =>
  import('@/features/analytics/pages/analytics-pages').then((module) => ({
    default: module.AnalyticsDashboardPage,
  })),
);
const DashboardsPage = lazy(() =>
  import('@/features/analytics/pages/analytics-pages').then((module) => ({
    default: module.DashboardsPage,
  })),
);
const AnalyticsReportsPage = lazy(() =>
  import('@/features/analytics/pages/analytics-pages').then((module) => ({
    default: module.AnalyticsReportsPage,
  })),
);
const KpisPage = lazy(() =>
  import('@/features/analytics/pages/analytics-pages').then((module) => ({
    default: module.KpisPage,
  })),
);
const ForecastsPage = lazy(() =>
  import('@/features/analytics/pages/analytics-pages').then((module) => ({
    default: module.ForecastsPage,
  })),
);
const SnapshotsPage = lazy(() =>
  import('@/features/analytics/pages/analytics-pages').then((module) => ({
    default: module.SnapshotsPage,
  })),
);
const IntegrationsDashboardPage = lazy(() =>
  import('@/features/integrations/pages/integrations-pages').then((module) => ({
    default: module.IntegrationsDashboardPage,
  })),
);
const IntegrationsMarketplacePage = lazy(() =>
  import('@/features/integrations/pages/integrations-pages').then((module) => ({
    default: module.IntegrationsMarketplacePage,
  })),
);
const InstalledIntegrationsPage = lazy(() =>
  import('@/features/integrations/pages/integrations-pages').then((module) => ({
    default: module.InstalledIntegrationsPage,
  })),
);
const IntegrationDetailPage = lazy(() =>
  import('@/features/integrations/pages/integrations-pages').then((module) => ({
    default: module.IntegrationDetailPage,
  })),
);
const IntegrationLogsPage = lazy(() =>
  import('@/features/integrations/pages/integrations-pages').then((module) => ({
    default: module.IntegrationLogsPage,
  })),
);
const IntegrationSettingsPage = lazy(() =>
  import('@/features/integrations/pages/integrations-pages').then((module) => ({
    default: module.IntegrationSettingsPage,
  })),
);
const AdminDashboardPage = lazy(() =>
  import('@/features/admin/pages/admin-pages').then((module) => ({
    default: module.AdminDashboardPage,
  })),
);
const BusinessUnitsPage = lazy(() =>
  import('@/features/admin/pages/admin-pages').then((module) => ({
    default: module.BusinessUnitsPage,
  })),
);
const AdminRolesPage = lazy(() =>
  import('@/features/admin/pages/admin-pages').then((module) => ({
    default: module.AdminRolesPage,
  })),
);
const AdminPoliciesPage = lazy(() =>
  import('@/features/admin/pages/admin-pages').then((module) => ({
    default: module.AdminPoliciesPage,
  })),
);
const AuditViewerPage = lazy(() =>
  import('@/features/admin/pages/admin-pages').then((module) => ({
    default: module.AuditViewerPage,
  })),
);
const SecurityCentrePage = lazy(() =>
  import('@/features/admin/pages/admin-pages').then((module) => ({
    default: module.SecurityCentrePage,
  })),
);
const ComplianceDashboardPage = lazy(() =>
  import('@/features/admin/pages/admin-pages').then((module) => ({
    default: module.ComplianceDashboardPage,
  })),
);
const LicensingPage = lazy(() =>
  import('@/features/admin/pages/admin-pages').then((module) => ({
    default: module.LicensingPage,
  })),
);
const AdminPlaceholderPage = lazy(() =>
  import('@/features/admin/pages/admin-pages').then((module) => ({
    default: module.AdminPlaceholderPage,
  })),
);
const PlatformDashboardPage = lazy(() =>
  import('@/features/admin/pages/admin-pages').then((module) => ({
    default: module.PlatformDashboardPage,
  })),
);
const PlatformHealthPage = lazy(() =>
  import('@/features/admin/pages/admin-pages').then((module) => ({
    default: module.PlatformHealthPage,
  })),
);
const PlatformRecordsPage = lazy(() =>
  import('@/features/admin/pages/admin-pages').then((module) => ({
    default: module.PlatformRecordsPage,
  })),
);
const PlatformIntegrationsHealthPage = lazy(() =>
  import('@/features/admin/pages/admin-pages').then((module) => ({
    default: module.PlatformIntegrationsHealthPage,
  })),
);
const AiHealthPage = lazy(() =>
  import('@/features/admin/pages/admin-pages').then((module) => ({
    default: module.AiHealthPage,
  })),
);
const HomePage = lazy(() =>
  import('@/features/launch/pages/marketing-pages').then((module) => ({
    default: module.HomePage,
  })),
);
const MarketingPage = lazy(() =>
  import('@/features/launch/pages/marketing-pages').then((module) => ({
    default: module.MarketingPage,
  })),
);
const PricingPage = lazy(() =>
  import('@/features/launch/pages/marketing-pages').then((module) => ({
    default: module.PricingPage,
  })),
);
const LegalPage = lazy(() =>
  import('@/features/launch/pages/marketing-pages').then((module) => ({
    default: module.LegalPage,
  })),
);
const HelpCentrePage = lazy(() =>
  import('@/features/launch/pages/marketing-pages').then((module) => ({
    default: module.HelpCentrePage,
  })),
);
const ContactPage = lazy(() =>
  import('@/features/launch/pages/marketing-pages').then((module) => ({
    default: module.ContactPage,
  })),
);
const BlogPage = lazy(() =>
  import('@/features/launch/pages/marketing-pages').then((module) => ({
    default: module.BlogPage,
  })),
);
const BillingDashboardPage = lazy(() =>
  import('@/features/launch/pages/billing-pages').then((module) => ({
    default: module.BillingDashboardPage,
  })),
);
const CustomerOnboardingPage = lazy(() =>
  import('@/features/launch/pages/billing-pages').then((module) => ({
    default: module.CustomerOnboardingPage,
  })),
);
const BillingRecordsPage = lazy(() =>
  import('@/features/launch/pages/billing-pages').then((module) => ({
    default: module.BillingRecordsPage,
  })),
);
const LaunchChecklistPage = lazy(() =>
  import('@/features/launch/pages/billing-pages').then((module) => ({
    default: module.LaunchChecklistPage,
  })),
);
const DataPortabilityPage = lazy(() =>
  import('@/features/launch/pages/billing-pages').then((module) => ({
    default: module.DataPortabilityPage,
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
    element: withSuspense(<HomePage />),
  },
  {
    path: '/features',
    element: withSuspense(<MarketingPage page="features" />),
  },
  {
    path: '/ai',
    element: withSuspense(<MarketingPage page="ai" />),
  },
  {
    path: '/crm',
    element: withSuspense(<MarketingPage page="crm" />),
  },
  {
    path: '/projects',
    element: withSuspense(<MarketingPage page="projects" />),
  },
  {
    path: '/documents',
    element: withSuspense(<MarketingPage page="documents" />),
  },
  {
    path: '/automation',
    element: withSuspense(<MarketingPage page="automation" />),
  },
  {
    path: '/pricing',
    element: withSuspense(<PricingPage />),
  },
  {
    path: '/enterprise',
    element: withSuspense(<MarketingPage page="enterprise" />),
  },
  {
    path: '/about',
    element: withSuspense(<MarketingPage page="about" />),
  },
  {
    path: '/careers',
    element: withSuspense(<MarketingPage page="careers" />),
  },
  {
    path: '/security',
    element: withSuspense(<MarketingPage page="security" />),
  },
  {
    path: '/privacy',
    element: withSuspense(<LegalPage type="privacy" />),
  },
  {
    path: '/terms',
    element: withSuspense(<LegalPage type="terms" />),
  },
  {
    path: '/cookies',
    element: withSuspense(<LegalPage type="cookies" />),
  },
  {
    path: '/acceptable-use',
    element: withSuspense(<LegalPage type="acceptable" />),
  },
  {
    path: '/dpa',
    element: withSuspense(<LegalPage type="dpa" />),
  },
  {
    path: '/contact',
    element: withSuspense(<ContactPage />),
  },
  {
    path: '/blog',
    element: withSuspense(<BlogPage />),
  },
  {
    path: '/help',
    element: withSuspense(<HelpCentrePage />),
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
            path: 'customer-onboarding',
            element: withSuspense(<CustomerOnboardingPage />),
          },
          {
            path: 'billing',
            element: withSuspense(<BillingDashboardPage />),
          },
          {
            path: 'billing/subscriptions',
            element: withSuspense(
              <BillingRecordsPage title="Subscriptions" resource="subscriptions" />,
            ),
          },
          {
            path: 'billing/usage',
            element: withSuspense(<BillingRecordsPage title="Usage tracking" resource="usage" />),
          },
          {
            path: 'billing/checkout',
            element: withSuspense(
              <BillingRecordsPage title="Checkout sessions" resource="checkout" />,
            ),
          },
          {
            path: 'billing/portal',
            element: withSuspense(<BillingRecordsPage title="Customer portal" resource="portal" />),
          },
          {
            path: 'billing/imports',
            element: withSuspense(<BillingRecordsPage title="Imports" resource="imports" />),
          },
          {
            path: 'billing/exports',
            element: withSuspense(<BillingRecordsPage title="Exports" resource="exports" />),
          },
          {
            path: 'billing/checklist',
            element: withSuspense(<LaunchChecklistPage />),
          },
          {
            path: 'billing/data-portability',
            element: withSuspense(<DataPortabilityPage />),
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
          {
            path: 'finance',
            element: withSuspense(<FinanceDashboardPage />),
          },
          {
            path: 'invoices',
            element: withSuspense(<InvoicesPage />),
          },
          {
            path: 'quotes',
            element: withSuspense(<QuotesPage />),
          },
          {
            path: 'payments',
            element: withSuspense(<PaymentsPage />),
          },
          {
            path: 'expenses',
            element: withSuspense(<ExpensesPage />),
          },
          {
            path: 'purchase-orders',
            element: withSuspense(<PurchaseOrdersPage />),
          },
          {
            path: 'reports',
            element: withSuspense(<AnalyticsReportsPage />),
          },
          {
            path: 'budgets',
            element: withSuspense(<BudgetsPage />),
          },
          {
            path: 'cashflow',
            element: withSuspense(<CashFlowPage />),
          },
          {
            path: 'analytics',
            element: withSuspense(<AnalyticsDashboardPage />),
          },
          {
            path: 'dashboards',
            element: withSuspense(<DashboardsPage />),
          },
          {
            path: 'kpis',
            element: withSuspense(<KpisPage />),
          },
          {
            path: 'forecasts',
            element: withSuspense(<ForecastsPage />),
          },
          {
            path: 'snapshots',
            element: withSuspense(<SnapshotsPage />),
          },
          {
            path: 'integrations',
            element: withSuspense(<IntegrationsDashboardPage />),
          },
          {
            path: 'integrations/marketplace',
            element: withSuspense(<IntegrationsMarketplacePage />),
          },
          {
            path: 'integrations/installed',
            element: withSuspense(<InstalledIntegrationsPage />),
          },
          {
            path: 'integrations/logs',
            element: withSuspense(<IntegrationLogsPage />),
          },
          {
            path: 'integrations/settings',
            element: withSuspense(<IntegrationSettingsPage />),
          },
          {
            path: 'integrations/:id',
            element: withSuspense(<IntegrationDetailPage />),
          },
          {
            path: 'admin',
            element: withSuspense(<AdminDashboardPage />),
          },
          {
            path: 'admin/organisations',
            element: withSuspense(<AdminPlaceholderPage title="Organisation hierarchy" />),
          },
          {
            path: 'admin/business-units',
            element: withSuspense(<BusinessUnitsPage />),
          },
          {
            path: 'admin/users',
            element: withSuspense(<AdminPlaceholderPage title="Enterprise users" />),
          },
          {
            path: 'admin/roles',
            element: withSuspense(<AdminRolesPage />),
          },
          {
            path: 'admin/policies',
            element: withSuspense(<AdminPoliciesPage />),
          },
          {
            path: 'admin/audit',
            element: withSuspense(<AuditViewerPage />),
          },
          {
            path: 'admin/security',
            element: withSuspense(<SecurityCentrePage />),
          },
          {
            path: 'admin/compliance',
            element: withSuspense(<ComplianceDashboardPage />),
          },
          {
            path: 'admin/licensing',
            element: withSuspense(<LicensingPage />),
          },
          {
            path: 'admin/platform',
            element: withSuspense(<PlatformDashboardPage />),
          },
          {
            path: 'admin/platform/health',
            element: withSuspense(<PlatformHealthPage />),
          },
          {
            path: 'admin/platform/metrics',
            element: withSuspense(<PlatformRecordsPage title="Metrics" resource="health" />),
          },
          {
            path: 'admin/platform/jobs',
            element: withSuspense(<PlatformRecordsPage title="Job monitoring" resource="jobs" />),
          },
          {
            path: 'admin/platform/incidents',
            element: withSuspense(<PlatformRecordsPage title="Incidents" resource="incidents" />),
          },
          {
            path: 'admin/platform/backups',
            element: withSuspense(<PlatformRecordsPage title="Backups" resource="backups" />),
          },
          {
            path: 'admin/platform/deployments',
            element: withSuspense(
              <PlatformRecordsPage title="Deployments" resource="deployments" />,
            ),
          },
          {
            path: 'admin/platform/feature-flags',
            element: withSuspense(
              <PlatformRecordsPage title="Feature flags" resource="featureFlags" />,
            ),
          },
          {
            path: 'admin/platform/integrations',
            element: withSuspense(<PlatformIntegrationsHealthPage />),
          },
          {
            path: 'admin/platform/ai-health',
            element: withSuspense(<AiHealthPage />),
          },
          {
            path: 'admin/platform/costs',
            element: withSuspense(<PlatformRecordsPage title="Costs" resource="costs" />),
          },
        ],
      },
    ],
  },
]);
